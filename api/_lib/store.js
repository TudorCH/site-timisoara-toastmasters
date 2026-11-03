// Shared helpers for the stats endpoints: Upstash Redis over its REST API (no npm dependency),
// per-environment key prefix and Bucharest-local dates.
// Needs the Upstash Redis integration from the Vercel Marketplace, which sets KV_REST_API_URL and
// KV_REST_API_TOKEN (UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN also work).
const crypto = require('crypto');

// Vercel lets you pick a prefix when connecting the database (STORAGE_KV_REST_API_URL...), so any
// *_REST_API_URL / *_REDIS_REST_URL with its matching token is accepted.
function findEnv() {
  const env = process.env;
  for (const [u, tk] of [['KV_REST_API_URL', 'KV_REST_API_TOKEN'], ['UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN']]) {
    if (env[u] && env[tk]) return [env[u], env[tk]];
  }
  for (const name of Object.keys(env)) {
    const m = /^(.*)(KV_REST_API|REDIS_REST)_URL$/.exec(name);
    const token = m && env[m[1] + m[2] + '_TOKEN'];
    if (m && token && /^https:\/\//.test(env[name])) return [env[name], token];
  }
  return ['', ''];
}
const [URL_, TOKEN] = findEnv();
// Names only (never values), shown to logged-in admins when the database isn't found.
const envNames = () => Object.keys(process.env).filter(n => /KV|REDIS|UPSTASH/i.test(n)).sort();

// Preview deployments count separately from production, so testing never mixes into real stats.
const ENV = process.env.VERCEL_ENV || 'development';
const PREFIX = (ENV === 'production' ? 'prod' : ENV) + ':';

const DAY_TTL = 400 * 86400;   // daily counters: ~13 months
const REG_TTL = 365 * 86400;   // form submissions: 12 months, then Redis deletes them

const configured = () => Boolean(URL_ && TOKEN);
const k = key => PREFIX + key;

// Runs several commands in one round trip; returns their results (null for a failed command).
async function pipeline(cmds) {
  if (!configured() || !cmds.length) return cmds.map(() => null);
  const res = await fetch(URL_.replace(/\/$/, '') + '/pipeline', {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmds),
  });
  if (!res.ok) throw new Error('Redis ' + res.status + ': ' + (await res.text()).slice(0, 200));
  return (await res.json()).map(r => (r && 'result' in r ? r.result : null));
}

// YYYY-MM-DD in Romanian time, `offset` days back.
function day(offset = 0) {
  const d = new Date(Date.now() - offset * 86400000);
  return d.toLocaleDateString('en-CA', { timeZone: 'Europe/Bucharest' });
}

// Secret for hashing and signing; never leaves the server.
const secret = () => process.env.ADMIN_SECRET || TOKEN || process.env.ADMIN_PASSWORD || 'tm-dev-only';
const hmac = (key, msg) => crypto.createHmac('sha256', key).update(msg).digest('hex');

function clientIp(req) {
  return String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').split(',')[0].trim();
}

// Counts a named event for today (form submission, Toasty message, outbound click...).
function eventCmds(name, date = day()) {
  const key = k('ev:' + date);
  return [['HINCRBY', key, name, 1], ['EXPIRE', key, DAY_TTL]];
}

module.exports = { configured, pipeline, k, day, hmac, secret, clientIp, eventCmds, envNames, DAY_TTL, REG_TTL, ENV };
