// Pasul 2 al login-ului în Decap CMS: GitHub revine aici cu un cod, îl schimbăm pe token
// și îl trimitem ferestrei /admin prin protocolul de postMessage al Decap.
// Necesită GITHUB_OAUTH_CLIENT_ID și GITHUB_OAUTH_CLIENT_SECRET în Vercel.

function readCookie(req, name) {
  const hit = (req.headers.cookie || '').split(/;\s*/).find(c => c.startsWith(name + '='));
  return hit ? hit.slice(name.length + 1) : '';
}

module.exports = async function handler(req, res) {
  const { code, state } = req.query || {};
  let status = 'error';
  let payload;

  if (!code || !state || state !== readCookie(req, 'decap_oauth_state')) {
    payload = { message: 'Sesiunea de autentificare a expirat. Încearcă din nou.' };
  } else {
    try {
      const r = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: process.env.GITHUB_OAUTH_CLIENT_ID,
          client_secret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
          code,
        }),
      });
      const data = await r.json();
      if (data.access_token) {
        status = 'success';
        payload = { token: data.access_token, provider: 'github' };
      } else {
        payload = { message: data.error_description || 'GitHub a refuzat autentificarea.' };
      }
    } catch (e) {
      payload = { message: 'Nu am putut contacta GitHub. Încearcă din nou.' };
    }
  }

  const message = JSON.stringify(`authorization:github:${status}:${JSON.stringify(payload)}`).replace(/</g, '\\u003c');
  res.setHeader('Set-Cookie', 'decap_oauth_state=; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=0');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(`<!DOCTYPE html><html><body><script>
(function () {
  var origin = window.location.origin;
  function receive(e) {
    if (e.origin !== origin) return;
    window.removeEventListener('message', receive);
    window.opener.postMessage(${message}, origin);
  }
  window.addEventListener('message', receive);
  if (window.opener) window.opener.postMessage('authorizing:github', origin);
})();
</script></body></html>`);
};
