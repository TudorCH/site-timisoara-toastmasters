// Board session shared by the admin endpoints: the tm_admin cookie set by /api/admin?action=login,
// signed with a key derived from ADMIN_PASSWORD (changing the password logs everyone out).
const crypto = require('crypto');
const { hmac, secret } = require('./store');

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
  try { return !o || new URL(o).host === (req.headers['x-forwarded-host'] || req.headers.host); } catch { return false; }
};
const parseBody = req => {
  if (typeof req.body === 'string') { try { return JSON.parse(req.body); } catch { return {}; } }
  return req.body || {};
};

module.exports = { sign, safeEqual, isAuthed, sameOrigin, parseBody };
