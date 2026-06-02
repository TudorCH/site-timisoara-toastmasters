(function () {
  var KEY = 'tm-cookies-v2';
  localStorage.removeItem('tm-cookie-consent');
  localStorage.removeItem('tm-cookies-v1');
  if (localStorage.getItem(KEY)) return;

  var style = document.createElement('style');
  style.textContent =
    '#tm-bar{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(20px);z-index:99999;' +
    'background:#fff;border-radius:999px;box-shadow:0 4px 24px rgba(0,0,0,.15);' +
    'display:inline-flex;align-items:center;gap:10px;padding:8px 8px 8px 18px;' +
    'font-family:Inter,sans-serif;font-size:13px;color:#374151;white-space:nowrap;' +
    'opacity:0;transition:opacity .3s ease,transform .3s ease;border:1px solid rgba(0,0,0,.07);}' +
    '#tm-bar.in{opacity:1;transform:translateX(-50%) translateY(0);}' +
    '#tm-bar span a{color:#004165;font-weight:600;text-decoration:underline;margin-left:4px;}' +
    '#tm-ok{background:#772432;color:#fff;border:none;border-radius:999px;padding:8px 16px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;transition:background .2s;white-space:nowrap;}' +
    '#tm-ok:hover{background:#8c2b3b;}' +
    '#tm-ess{background:transparent;color:#6b7280;border:none;padding:8px 10px;font-size:12px;cursor:pointer;font-family:inherit;transition:color .2s;white-space:nowrap;}' +
    '#tm-ess:hover{color:#004165;}' +
    '@media(max-width:600px){#tm-bar{bottom:16px;max-width:calc(100vw - 32px);border-radius:16px;flex-wrap:wrap;white-space:normal;padding:12px 14px;gap:8px;}' +
    '#tm-bar span{flex:1 1 100%;}' +
    '#tm-ok,#tm-ess{flex:1;text-align:center;}}';
  document.head.appendChild(style);

  var bar = document.createElement('div');
  bar.id = 'tm-bar';
  bar.innerHTML =
    '<span>🍪 Folosim cookies esențiale.<a href="cookies.html">Află mai mult</a></span>' +
    '<button id="tm-ok">Acceptă</button>' +
    '<button id="tm-ess">Respinge</button>';
  document.body.appendChild(bar);

  setTimeout(function () { bar.classList.add('in'); }, 80);

  function dismiss(v) {
    localStorage.setItem(KEY, v);
    bar.classList.remove('in');
    setTimeout(function () { bar.remove(); }, 320);
  }

  document.getElementById('tm-ok').addEventListener('click',  function () { dismiss('all'); });
  document.getElementById('tm-ess').addEventListener('click', function () { dismiss('essential'); });
})();
