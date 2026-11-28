// GitHub API proxy for the blog editor (/admin, Decap CMS), so the board signs in with its password
// instead of a GitHub account. The browser never sees a GitHub token: it sends the board session
// cookie, and this function adds GITHUB_CMS_TOKEN (a fine-grained token for this repository only,
// Contents read/write) on its way to api.github.com.
//   /api/gh/<github path>  ->  https://api.github.com/<github path>   (rewrite in vercel.json)
// Only /user and this repository's paths are allowed, and the editor can only write to the blog's branch.
const { isAuthed, sameOrigin } = require('./_lib/auth');

const REPO = 'TudorCH/site-timisoara-toastmasters';
const API = 'https://api.github.com';
// Branch the CMS commits to: dev on previews, main on the live site (CMS_BRANCH overrides)
const branch = () => process.env.CMS_BRANCH || (process.env.VERCEL_ENV === 'production' ? 'main' : 'dev');
const WRITE = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

// Writes that would move a branch other than the blog's one are refused (no pushes to main from a preview).
function wrongBranch(method, path, body) {
  if (!WRITE.has(method)) return false;
  const ref = /^\/repos\/[^/]+\/[^/]+\/git\/refs\/(.+)$/.exec(path);
  if (ref) return ref[1] !== 'heads/' + branch();
  if (/^\/repos\/[^/]+\/[^/]+\/git\/refs$/.test(path)) return true;   // creating new branches
  if (/^\/repos\/[^/]+\/[^/]+\/(contents|merges|pulls)\b/.test(path)) {
    const b = body && (body.branch || body.base);
    return !!b && b !== branch();
  }
  return false;
}

function readBody(req) {
  if (req.body !== undefined && req.body !== null) return Promise.resolve(typeof req.body === 'string' ? req.body : JSON.stringify(req.body));
  return new Promise((ok) => { let s = ''; req.on('data', (c) => { s += c; }); req.on('end', () => ok(s)); req.on('error', () => ok('')); });
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex');
  if (WRITE.has(req.method) && !sameOrigin(req)) return res.status(403).json({ message: 'Origine invalidă.' });
  if (!isAuthed(req)) return res.status(401).json({ message: 'Neautentificat. Intră cu parola de board.' });
  const token = process.env.GITHUB_CMS_TOKEN;
  if (!token) return res.status(503).json({ message: 'Lipsește GITHUB_CMS_TOKEN în Vercel.' });

  const raw = String((req.query && req.query.path) || '');
  const path = '/' + raw.replace(/^\/+/, '');
  const repoPath = '/repos/' + REPO;
  if (!(path === '/user' || path === repoPath || path.startsWith(repoPath + '/')) || path.includes('..')) {
    return res.status(403).json({ message: 'Cale nepermisă.' });
  }

  // Query string without our own "path" parameter
  const q = new URLSearchParams();
  Object.entries(req.query || {}).forEach(([k, v]) => { if (k !== 'path') [].concat(v).forEach((x) => q.append(k, x)); });
  const body = WRITE.has(req.method) ? await readBody(req) : undefined;
  let parsed = null;
  try { parsed = body ? JSON.parse(body) : null; } catch { parsed = null; }
  if (wrongBranch(req.method, path, parsed)) return res.status(403).json({ message: 'Editorul poate scrie doar pe ramura ' + branch() + '.' });

  try {
    const r = await fetch(API + path + (q.toString() ? '?' + q : ''), {
      method: req.method,
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: req.headers.accept || 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'timisoara-toastmasters-cms',
      },
      body,
    });
    res.status(r.status);
    ['content-type', 'etag', 'last-modified'].forEach((h) => { const v = r.headers.get(h); if (v) res.setHeader(h, v); });
    // Pagination links point at api.github.com; send them back through this proxy
    const link = r.headers.get('link');
    if (link) {
      const host = req.headers['x-forwarded-host'] || req.headers.host;
      res.setHeader('link', link.split(API + '/').join('https://' + host + '/api/gh/'));
    }
    const buf = Buffer.from(await r.arrayBuffer());
    return res.end(buf);
  } catch (e) {
    console.error('gh proxy:', e.message);
    return res.status(502).json({ message: 'Nu am putut contacta GitHub.' });
  }
};
