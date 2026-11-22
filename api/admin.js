// Admin API for /admin/stats.
//   POST ?action=login   { password }   sets the tm_admin session cookie (7 days)
//   POST ?action=logout                  clears it
//   GET  ?action=stats&days=30           visits, sources, devices, events and form submissions
//   POST ?action=delete  { id }          deletes one form submission (GDPR requests)
// Meeting agendas (/admin/agenda), kept until deleted:
//   GET  ?action=agendas                 saved dates, names used before (autocomplete), club defaults
//   GET  ?action=agenda&date=YYYY-MM-DD  one agenda
//   POST ?action=agenda-save   { agenda }
//   POST ?action=agenda-delete { date }
//   POST ?action=agenda-settings { settings }   club defaults for new agendas (officers, venue...)
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
    links: top(evs, 60).filter(([n]) => n.startsWith('link:')).map(([n, c]) => [n.slice(5), c]),
    registrations,
  });
}

async function remove(req, res) {
  const { id } = parseBody(req);
  if (!/^[a-z0-9-]{6,40}$/i.test(String(id || ''))) return res.status(400).json({ error: 'ID invalid.' });
  await pipeline([['DEL', k('reg:' + id)], ['ZREM', k('reg:index'), id]]);
  return res.status(200).json({ ok: true });
}

// ── Agendas ──
const AG_DATE = /^\d{4}-\d{2}-\d{2}$/;
const AG_MAX = 40000;   // bytes of JSON per agenda; a full one is ~3 KB
// Keeps only plain data: short strings, numbers, booleans, small arrays/objects with simple keys.
function clean(v, depth = 0) {
  if (typeof v === 'string') return v.slice(0, 400);
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  if (typeof v === 'boolean' || v === null) return v;
  if (depth > 4) return null;
  if (Array.isArray(v)) return v.slice(0, 40).map(x => clean(x, depth + 1));
  if (typeof v === 'object') {
    const o = {};
    for (const [key, x] of Object.entries(v).slice(0, 60)) if (/^[a-zA-Z0-9_]{1,30}$/.test(key)) o[key] = clean(x, depth + 1);
    return o;
  }
  return null;
}
const parseJson = s => { try { return s ? JSON.parse(s) : null; } catch { return null; } };
// Every person named in an agenda, for autocomplete next time.
function namesIn(a) {
  const out = [];
  const add = n => { if (typeof n === 'string' && n.trim() && n.length <= 60) out.push(n.trim()); };
  Object.values(a.roles || {}).forEach(add);
  (a.speeches || []).forEach(s => { if (s) { add(s.speaker); add(s.evaluator); } });
  if (a.vote) add(a.vote.name);
  Object.values((a.club && a.club.officers) || {}).forEach(add);
  return [...new Set(out)];
}

async function agendaList(req, res) {
  if (!configured()) return res.status(200).json({ configured: false, agendas: [], names: [], settings: null });
  const [dates, names, settings] = await pipeline([
    ['ZREVRANGE', k('agenda:index'), 0, 199], ['SMEMBERS', k('agenda:names')], ['GET', k('agenda:settings')],
  ]);
  let titles = [];
  if (dates && dates.length) titles = (await pipeline([['MGET', ...dates.map(d => k('agenda:' + d))]]))[0] || [];
  return res.status(200).json({
    configured: true,
    agendas: (dates || []).map((date, i) => { const a = parseJson(titles[i]) || {}; return { date, title: a.title || '', lang: a.lang || 'ro' }; }),
    names: (names || []).sort((a, b) => a.localeCompare(b, 'ro')),
    settings: parseJson(settings),
  });
}
async function agendaGet(req, res) {
  const date = String(req.query.date || '');
  if (!AG_DATE.test(date)) return res.status(400).json({ error: 'Dată invalidă.' });
  const [raw] = await pipeline([['GET', k('agenda:' + date)]]);
  const agenda = parseJson(raw);
  return agenda ? res.status(200).json({ agenda }) : res.status(404).json({ error: 'Agenda nu există.' });
}
async function agendaSave(req, res) {
  if (!configured()) return res.status(503).json({ error: 'Baza de date nu e conectată, agenda nu se poate salva.' });
  const agenda = clean(parseBody(req).agenda);
  if (!agenda || !AG_DATE.test(agenda.date || '')) return res.status(400).json({ error: 'Agenda nu are o dată validă.' });
  agenda.updated = Date.now();
  const json = JSON.stringify(agenda);
  if (json.length > AG_MAX) return res.status(413).json({ error: 'Agenda e prea mare.' });
  const cmds = [['SET', k('agenda:' + agenda.date), json], ['ZADD', k('agenda:index'), Date.parse(agenda.date), agenda.date]];
  const names = namesIn(agenda);
  if (names.length) cmds.push(['SADD', k('agenda:names'), ...names]);
  await pipeline(cmds);
  return res.status(200).json({ ok: true, updated: agenda.updated });
}
async function agendaDelete(req, res) {
  const { date } = parseBody(req);
  if (!AG_DATE.test(String(date || ''))) return res.status(400).json({ error: 'Dată invalidă.' });
  await pipeline([['DEL', k('agenda:' + date)], ['ZREM', k('agenda:index'), date]]);
  return res.status(200).json({ ok: true });
}
async function agendaSettings(req, res) {
  if (!configured()) return res.status(503).json({ error: 'Baza de date nu e conectată.' });
  const settings = clean(parseBody(req).settings);
  const json = JSON.stringify(settings || {});
  if (json.length > AG_MAX) return res.status(413).json({ error: 'Setările sunt prea mari.' });
  await pipeline([['SET', k('agenda:settings'), json]]);
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
    if (action === 'agendas' && req.method === 'GET') return await agendaList(req, res);
    if (action === 'agenda' && req.method === 'GET') return await agendaGet(req, res);
    if (action === 'agenda-save' && req.method === 'POST') return await agendaSave(req, res);
    if (action === 'agenda-delete' && req.method === 'POST') return await agendaDelete(req, res);
    if (action === 'agenda-settings' && req.method === 'POST') return await agendaSettings(req, res);
    return res.status(400).json({ error: 'Acțiune necunoscută.' });
  } catch (err) {
    console.error('admin:', err);
    return res.status(500).json({ error: 'Eroare server: ' + err.message });
  }
};
