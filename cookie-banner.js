(function () {
  var KEY = 'tm-cookies-v2';

  // Clean up old keys from previous versions
  localStorage.removeItem('tm-cookie-consent');
  localStorage.removeItem('tm-cookies-v1');

  if (localStorage.getItem(KEY)) return;

  var style = document.createElement('style');
  style.textContent = [
    '#tm-ov{position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.55);backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px);display:flex;align-items:center;justify-content:center;padding:16px;opacity:0;transition:opacity .3s ease;}',
    '#tm-ov.in{opacity:1;}',
    '#tm-box{background:#fff;border-radius:24px;box-shadow:0 20px 60px rgba(0,0,0,.25);max-width:460px;width:100%;padding:36px 32px 28px;font-family:Inter,sans-serif;transform:translateY(24px);transition:transform .35s cubic-bezier(.34,1.56,.64,1);}',
    '#tm-ov.in #tm-box{transform:translateY(0);}',
    '#tm-ico{width:54px;height:54px;border-radius:16px;background:linear-gradient(135deg,#002d47,#004165);display:flex;align-items:center;justify-content:center;margin-bottom:18px;}',
    '#tm-box h2{font-family:"Plus Jakarta Sans",Inter,sans-serif;font-size:1.3rem;font-weight:800;color:#004165;margin:0 0 10px;}',
    '#tm-box p{font-size:.875rem;line-height:1.7;color:#6b7280;margin:0 0 22px;}',
    '#tm-box p a{color:#004165;font-weight:600;}',
    '#tm-ok{display:block;width:100%;background:#772432;color:#fff;border:none;border-radius:999px;padding:14px;font-size:.95rem;font-weight:700;cursor:pointer;font-family:inherit;margin-bottom:10px;transition:background .2s;}',
    '#tm-ok:hover{background:#8c2b3b;}',
    '#tm-ess{display:block;width:100%;background:transparent;color:#004165;border:2px solid #004165;border-radius:999px;padding:12px;font-size:.875rem;font-weight:600;cursor:pointer;font-family:inherit;transition:background .2s,color .2s;}',
    '#tm-ess:hover{background:#004165;color:#fff;}',
    '#tm-note{text-align:center;margin-top:14px;font-size:.75rem;color:#9ca3af;}',
    '#tm-note a{color:#9ca3af;}',
    '@media(max-width:480px){#tm-box{padding:26px 18px 22px;border-radius:20px;}}'
  ].join('');
  document.head.appendChild(style);

  var ov = document.createElement('div');
  ov.id = 'tm-ov';
  ov.innerHTML =
    '<div id="tm-box">' +
      '<div id="tm-ico">' +
        '<svg width="26" height="26" viewBox="0 0 24 24" fill="none">' +
          '<circle cx="12" cy="12" r="9" stroke="#F2DF74" stroke-width="1.5" fill="rgba(242,223,116,.12)"/>' +
          '<circle cx="8.5"  cy="9"    r="1.2" fill="#F2DF74"/>' +
          '<circle cx="14.5" cy="8"    r="1.2" fill="#F2DF74"/>' +
          '<circle cx="10"   cy="13.5" r="1.2" fill="#F2DF74"/>' +
          '<circle cx="15"   cy="13"   r="1"   fill="#F2DF74"/>' +
          '<circle cx="8.5"  cy="14.8" r=".8"  fill="#F2DF74"/>' +
        '</svg>' +
      '</div>' +
      '<h2>Respectăm confidențialitatea ta 🍪</h2>' +
      '<p>Folosim cookie-uri esențiale pentru funcționarea site-ului și reținerea preferințelor. Nu urmărim activitatea ta și nu partajăm date cu terți în scop publicitar.<br><a href="cookies.html">Citește politica noastră de cookies</a></p>' +
      '<button id="tm-ok">Acceptă toate cookie-urile</button>' +
      '<button id="tm-ess">Doar esențiale</button>' +
      '<p id="tm-note">Poți modifica preferințele oricând din <a href="cookies.html">politica cookies</a>.</p>' +
    '</div>';
  document.body.appendChild(ov);

  setTimeout(function () { ov.classList.add('in'); }, 80);

  function dismiss(v) {
    localStorage.setItem(KEY, v);
    ov.classList.remove('in');
    setTimeout(function () { ov.remove(); }, 320);
  }

  document.getElementById('tm-ok').addEventListener('click',  function () { dismiss('all'); });
  document.getElementById('tm-ess').addEventListener('click', function () { dismiss('essential'); });
  ov.addEventListener('click', function (e) { if (e.target === ov) dismiss('essential'); });
})();
