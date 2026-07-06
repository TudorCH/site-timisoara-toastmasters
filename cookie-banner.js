(function () {
  var KEY = 'tm-cookies-v3';
  localStorage.removeItem('tm-cookie-consent');
  localStorage.removeItem('tm-cookies-v1');
  localStorage.removeItem('tm-cookies-v2');
  if (localStorage.getItem(KEY)) return;

  var style = document.createElement('style');
  style.textContent =
    '#tm-bar{position:fixed;bottom:16px;left:16px;right:16px;z-index:99999;' +
    'background:#002d47;border-radius:14px;border:1px solid rgba(255,255,255,.1);' +
    'box-shadow:0 8px 32px rgba(0,0,0,.35);' +
    'padding:20px 28px;display:flex;align-items:center;gap:28px;' +
    'font-family:Inter,sans-serif;transform:translateY(calc(100% + 20px));transition:transform .35s ease;}' +
    '#tm-bar.in{transform:translateY(0);}' +

    '#tm-text{flex:1;font-size:13px;line-height:1.65;color:rgba(255,255,255,.75);}' +
    '#tm-text a{color:#F2DF74;font-weight:600;text-decoration:underline;text-underline-offset:2px;}' +
    '#tm-text-long{display:block;}' +
    '#tm-text-short{display:none;}' +

    '#tm-actions{display:flex;align-items:center;gap:8px;flex-shrink:0;}' +
    '#tm-more{display:none;}' +
    '#tm-settings{background:transparent;border:none;color:rgba(255,255,255,.7);font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;text-decoration:underline;text-underline-offset:2px;padding:4px 2px;white-space:nowrap;transition:color .2s;}' +
    '#tm-settings:hover{color:#F2DF74;}' +
    '#tm-ess{background:transparent;color:#fff;border:1.5px solid rgba(255,255,255,.35);border-radius:999px;padding:9px 18px;font-size:12.5px;font-weight:700;cursor:pointer;font-family:inherit;white-space:nowrap;transition:all .2s;}' +
    '#tm-ess:hover{border-color:#fff;background:rgba(255,255,255,.08);}' +
    '#tm-ok{background:#772432;color:#fff;border:none;border-radius:999px;padding:9px 20px;font-size:12.5px;font-weight:700;cursor:pointer;font-family:inherit;white-space:nowrap;transition:background .2s;}' +
    '#tm-ok:hover{background:#8c2b3b;}' +

    '@keyframes tm-cta-pulse{0%{box-shadow:0 0 0 0 rgba(242,223,116,.7)}70%{box-shadow:0 0 0 10px rgba(242,223,116,0)}100%{box-shadow:0 0 0 0 rgba(242,223,116,0)}}' +
    '.tm-cta-active{animation:tm-cta-pulse .7s ease 2;}' +

    '@media(max-width:700px){' +
    '#tm-bar{flex-direction:column;align-items:stretch;gap:10px;padding:16px 16px 14px;}' +
    '#tm-text-long{display:none;}' +
    '#tm-text-short{display:block;font-size:13px;line-height:1.4;color:rgba(255,255,255,.85);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}' +
    '#tm-actions{width:100%;gap:6px;}' +
    '#tm-settings{display:none;}' +
    '#tm-more{display:flex;flex:1;align-items:center;justify-content:center;color:#F2DF74;border:1.5px solid rgba(242,223,116,.35);border-radius:999px;padding:9px 8px;font-size:11.5px;font-weight:600;text-decoration:none;white-space:nowrap;font-family:Inter,sans-serif;transition:border-color .2s;}' +
    '#tm-more:hover{border-color:rgba(242,223,116,.7);}' +
    '#tm-ess,#tm-ok{flex:1;text-align:center;padding:9px 8px;font-size:11.5px;}' +
    '}';
  document.head.appendChild(style);

  var bar = document.createElement('div');
  bar.id = 'tm-bar';
  bar.innerHTML =
    '<div id="tm-text">' +
      '<span id="tm-text-long">Folosim date stocate local în browserul tău și servicii terțe de bază. Nu folosim trackere de urmărire sau publicitate.<br>Apasă <strong style="color:#fff;">Acceptă</strong> pentru toate funcționalitățile sau <strong style="color:#fff;">Respinge</strong> pentru cele esențiale. <a href="cookies">Politică cookies</a></span>' +
      '<span id="tm-text-short">Folosim cookie-uri esențiale, fără elemente de tracking.</span>' +
    '</div>' +
    '<div id="tm-actions">' +
      '<a id="tm-more" href="cookies">Află mai multe</a>' +
      '<button id="tm-settings">Setări cookies</button>' +
      '<button id="tm-ok">Acceptă</button>' +
      '<button id="tm-ess">Respinge</button>' +
    '</div>';
  document.body.appendChild(bar);

  function showBar() {
    bar.classList.add('in');
  }

  function dismiss(v) {
    localStorage.setItem(KEY, v);
    bar.classList.remove('in');
    setTimeout(function () {
      bar.remove();
      document.querySelectorAll('a[href="contact"].bg-gold').forEach(function (el) {
        el.classList.add('tm-cta-active');
        setTimeout(function () { el.classList.remove('tm-cta-active'); }, 1500);
      });
    }, 380);
  }

  document.getElementById('tm-ok').addEventListener('click', function () { dismiss('all'); });
  document.getElementById('tm-ess').addEventListener('click', function () { dismiss('essential'); });
  document.getElementById('tm-settings').addEventListener('click', function () { window.location.href = 'cookies.html'; });

  setTimeout(showBar, 2000);
})();
