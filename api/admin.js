// Admin API for /admin/stats.
//   POST ?action=login   { password }   sets the tm_admin session cookie (7 days)
//   POST ?action=logout                  clears it
//   GET  ?action=stats&days=30           visits, sources, devices, events and form submissions
//   POST ?action=delete  { id }          deletes one form submission (GDPR requests)
// Needs ADMIN_PASSWORD in Vercel; stats need the Upstash Redis integration (see _lib/store.js).
const crypto = require('crypto');
const { configured, pipeline, k, day, hmac, secret, clientIp, envNames, ENV } = require('./_lib/store');

const COOKIE = 'tm_admin';
const SESSION_DAYS = 7;

const signingKey = () => crypto.createHash('sha256').update('tm-admin:' + secret() + ':' + (process.env.ADMIN_PASSWORD || '')).digest();
const sign = exp => `${exp}.${hmac(signingKey(), 'session:' + exp)}`;
const safeEqual = (a, b) => {
  const x = crypto.createHash('sha256').update(String(a)).digest(), y = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(x, y);
};

function isAuthed(req) {
  const m = /(?:^|;\s*)tm_admin=([0-9]+)\.([a-f0-9]{64})/.exec(req.headers.cookie || '');
  if (!m || !process.env.ADMIN_PASSWORD) return false;
  return Number(m[1]) > Date.now() && safeEqual(sign(m[1]), `${m[1]}.${m[2]}`);
}
const sameOrigin = req => {
  const o = req.headers.origin;
  return !o || new URL(o).host === (req.headers['x-forwarded-host'] || req.headers.host);
};
const parseBody = req => {
  if (typeof req.body === 'string') { try { return JSON.parse(req.body); } catch { return {}; } }
  return req.body || {};
};

async function login(req, res) {
  if (!process.env.ADMIN_PASSWORD) return res.status(503).json({ error: 'ADMIN_PASSWORD nu e setat în Vercel.' });
  // At most 10 attempts per IP every 15 minutes (only when Redis is connected).
  const rl = k('rl:login:' + hmac(secret(), clientIp(req)).slice(0, 16));
  if (configured()) {
    const [, n] = await pipeline([['SET', rl, 0, 'EX', 900, 'NX'], ['INCR', rl]]);
    if (n > 10) return res.status(429).json({ error: 'Prea multe încercări. Mai încearcă peste 15 minute.' });
  }
  const { password } = parseBody(req);
  if (!password || !safeEqual(password, process.env.ADMIN_PASSWORD)) {
    await new Promise(r => setTimeout(r, 600));
    return res.status(401).json({ error: 'Parolă greșită.' });
  }
  if (configured()) await pipeline([['DEL', rl]]);
  const exp = Date.now() + SESSION_DAYS * 86400000;
  res.setHeader('Set-Cookie', `${COOKIE}=${sign(exp)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_DAYS * 86400}`);
  return res.status(200).json({ ok: true });
}

// Sums hash fields over several days and returns the top entries.
function top(hashes, n) {
  const sum = {};
  for (const h of hashes) {
    if (!Array.isArray(h)) continue;
    for (let i = 0; i < h.length; i += 2) sum[h[i]] = (sum[h[i]] || 0) + Number(h[i + 1]);
  }
  return Object.entries(sum).sort((a, b) => b[1] - a[1]).slice(0, n);
}

async function stats(req, res) {
  const days = Math.min(Math.max(parseInt(req.query.days, 10) || 30, 1), 180);
  if (!configured()) return res.status(200).json({ configured: false, env: ENV, days, envNames: envNames() });

  const dates = Array.from({ length: days }, (_, i) => day(days - 1 - i));      // oldest → today
  const prev = Array.from({ length: days }, (_, i) => day(2 * days - 1 - i));   // the period before
  const cmds = [];
  for (const d of dates) cmds.push(['GET', k('pv:' + d)], ['PFCOUNT', k('uv:' + d)], ['HGETALL', k('ev:' + d)],
    ['HGETALL', k('pages:' + d)], ['HGETALL', k('ref:' + d)], ['HGETALL', k('dev:' + d)], ['HGETALL', k('cty:' + d)]);
  for (const d of prev) cmds.push(['GET', k('pv:' + d)], ['PFCOUNT', k('uv:' + d)], ['HGET', k('ev:' + d), 'reg']);
  // Form submissions: drop index entries whose records have expired, then read the latest 200.
  const cutoff = Date.now() - 365 * 86400000;
  cmds.push(['ZREMRANGEBYSCORE', k('reg:index'), 0, cutoff], ['ZREVRANGE', k('reg:index'), 0, 199]);
  const out = await pipeline(cmds);

  const per = 7, daily = [], pages = [], refs = [], devs = [], ctys = [], evs = [];
  dates.forEach((date, i) => {
    const [pv, uv, ev, pg, rf, dv, ct] = out.slice(i * per, i * per + per);
    const e = {}; if (Array.isArray(ev)) for (let j = 0; j < ev.length; j += 2) e[ev[j]] = Number(ev[j + 1]);
    daily.push({ date, pv: Number(pv) || 0, uv: Number(uv) || 0, reg: e.reg || 0, chat: e.chat || 0, conv: e.chatconv || 0 });
    pages.push(pg); refs.push(rf); devs.push(dv); ctys.push(ct); evs.push(ev);
  });
  let o = days * per;
  const previous = { pv: 0, uv: 0, reg: 0 };
  for (let i = 0; i < days; i++, o += 3) {
    previous.pv += Number(out[o]) || 0; previous.uv += Number(out[o + 1]) || 0; previous.reg += Number(out[o + 2]) || 0;
  }
  const ids = out[o + 1] || [];

  let registrations = [];
  if (ids.length) {
    const recs = await pipeline([['MGET', ...ids.map(id => k('reg:' + id))]]);
    registrations = (recs[0] || []).map(r => { try { return r && JSON.parse(r); } catch { return null; } }).filter(Boolean);
  }

  const total = key => daily.reduce((s, d) => s + d[key], 0);
  return res.status(200).json({
    configured: true, env: ENV, days,
    totals: { pv: total('pv'), uv: total('uv'), reg: total('reg'), chat: total('chat'), conv: total('conv') },
    previous,
    daily,
    pages: top(pages, 15),
    refs: top(refs, 10),
    devices: top(devs, 5),
    countries: top(ctys, 10),
    clicks: top(evs, 30).filter(([n]) => n.startsWith('click:')).map(([n, c]) => [n.slice(6), c]),
    registrations,
  });
}

async function remove(req, res) {
  const { id } = parseBody(req);
  if (!/^[a-z0-9-]{6,40}$/i.test(String(id || ''))) return res.status(400).json({ error: 'ID invalid.' });
  await pipeline([['DEL', k('reg:' + id)], ['ZREM', k('reg:index'), id]]);
  return res.status(200).json({ ok: true });
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex');
  const action = req.query.action;
  try {
    if (req.method === 'POST' && !sameOrigin(req)) return res.status(403).json({ error: 'Origine invalidă.' });
    if (action === 'login' && req.method === 'POST') return await login(req, res);
    if (action === 'logout' && req.method === 'POST') {
      res.setHeader('Set-Cookie', `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`);
      return res.status(200).json({ ok: true });
    }
    if (!isAuthed(req)) return res.status(401).json({ error: 'Neautentificat.' });
    if (action === 'stats' && req.method === 'GET') return await stats(req, res);
    if (action === 'delete' && req.method === 'POST') return await remove(req, res);
    return res.status(400).json({ error: 'Acțiune necunoscută.' });
  } catch (err) {
    console.error('admin:', err);
    return res.status(500).json({ error: 'Eroare server: ' + err.message });
  }
};
