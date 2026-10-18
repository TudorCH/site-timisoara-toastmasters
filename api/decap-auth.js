// Pasul 1 al login-ului în Decap CMS (/admin): trimite editorul la GitHub pentru autorizare.
// Necesită GITHUB_OAUTH_CLIENT_ID în Vercel (OAuth App cu callback https://<domeniu>/api/decap-callback).
const crypto = require('crypto');

module.exports = function handler(req, res) {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  if (!clientId) return res.status(500).send('Lipsește GITHUB_OAUTH_CLIENT_ID.');

  const state = crypto.randomBytes(16).toString('hex');
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `https://${host}/api/decap-callback`,
    scope: 'repo',
    state,
  });

  res.setHeader('Set-Cookie', `decap_oauth_state=${state}; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=600`);
  res.setHeader('Cache-Control', 'no-store');
  res.writeHead(302, { Location: `https://github.com/login/oauth/authorize?${params}` });
  res.end();
};
