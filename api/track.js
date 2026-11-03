// Cookie-free visit counting (sent by /track.js with navigator.sendBeacon).
// Stores only daily aggregates: page views, an estimate of unique visitors, top pages, referring
// sites, device type, country and outbound clicks. No IP address or identifier is stored: unique
// visitors are a HyperLogLog of a hash salted with a key that changes every day.
const crypto = require('crypto');
const { configured, pipeline, k, day, hmac, secret, clientIp, eventCmds, DAY_TTL } = require('./_lib/store');

const BOT = /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|preview|facebookexternalhit|whatsapp|telegram|discord|curl|wget|python|axios|node-fetch/i;
const OWN = /(^|\.)timisoaratoastmasters\.ro$|\.vercel\.app$|^localhost$/;
// Outbound clicks are grouped into these labels; anything else counts as "alt".
const CLICKS = [
  ['whatsapp', /whatsapp\.com$/], ['facebook', /facebook\.com$/], ['instagram', /instagram\.com$/],
  ['linkedin', /linkedin\.com$/], ['tiktok', /tiktok\.com$/], ['youtube', /youtube\.com$|youtu\.be$/],
  ['maps', /google\.[a-z.]+$|goo\.gl$/], ['uber', /uber\.com$/], ['bolt', /bolt\.eu$/], ['toastmasters.org', /toastmasters\.org$/],
];

const cleanPath = p => {
  p = String(p || '/').split(/[?#]/)[0].replace(/\.html$/, '').replace(/\/+$/, '') || '/';
  if (p === '/home' || p === '/index') p = '/';
  return /^\/[a-z0-9\-/]{0,80}$/i.test(p) ? p.toLowerCase() : null;
};
const hostOf = u => { try { return new URL(u).hostname.replace(/^www\./, '').toLowerCase(); } catch { return ''; } };
const device = ua => /iPad|Tablet|PlayBook|Silk/i.test(ua) ? 'tableta' : /Mobi|Android|iPhone|iPod/i.test(ua) ? 'mobil' : 'desktop';

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const ua = String(req.headers['user-agent'] || '');
    const origin = hostOf(req.headers.origin || req.headers.referer || '');
    // Same-site beacons only, no bots, and the club admins' own visits don't count.
    if (!configured() || BOT.test(ua) || !OWN.test(origin) || /(?:^|;\s*)tm_admin=/.test(req.headers.cookie || '')) {
      return res.status(204).end();
    }

    let body = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
    body = body || {};
    const date = day();
    const cmds = [];
    const hinc = (key, field) => { const kk = k(key + ':' + date); cmds.push(['HINCRBY', kk, field, 1], ['EXPIRE', kk, DAY_TTL]); };

    if (body.t === 'click') {
      const h = hostOf(body.u);
      if (!h || OWN.test(h)) return res.status(204).end();
      const hit = CLICKS.find(([, re]) => re.test(h));
      cmds.push(...eventCmds('click:' + (hit ? hit[0] : 'alt'), date));
    } else {
      const path = cleanPath(body.p);
      if (!path) return res.status(204).end();
      const pv = k('pv:' + date), uv = k('uv:' + date);
      const visitor = crypto.createHash('sha256').update(hmac(secret(), 'salt:' + date) + clientIp(req) + ua).digest('hex').slice(0, 24);
      cmds.push(['INCR', pv], ['EXPIRE', pv, DAY_TTL], ['PFADD', uv, visitor], ['EXPIRE', uv, DAY_TTL]);
      hinc('pages', path);
      // Where the visit came from; moving between our own pages isn't a source.
      // l.facebook.com, m.facebook.com... all count as facebook.com.
      const ref = hostOf(body.r).replace(/^(?:l|m|lm|mobile|web)\.(?=(?:facebook|instagram|linkedin|youtube)\.)/, '');
      if (!ref) hinc('ref', 'direct');
      else if (!OWN.test(ref)) hinc('ref', ref.slice(0, 60));
      hinc('dev', device(ua));
      const cc = String(req.headers['x-vercel-ip-country'] || '').toUpperCase();
      hinc('cty', /^[A-Z]{2}$/.test(cc) ? cc : '??');
    }
    await pipeline(cmds);
  } catch (err) {
    console.error('track:', err.message);
  }
  return res.status(204).end();
};
