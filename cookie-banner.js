(function () {
  var STORAGE_KEY = 'tm-cookie-consent';

  if (localStorage.getItem(STORAGE_KEY)) return;

  var css = document.createElement('style');
  css.textContent =
    '#tm-cookie-bar{position:fixed;bottom:0;left:0;right:0;z-index:9999;background:#002d47;border-top:1px solid rgba(242,223,116,.2);padding:16px 20px;display:flex;flex-wrap:wrap;align-items:center;gap:12px;box-shadow:0 -4px 24px rgba(0,0,0,.3);transform:translateY(100%);transition:transform .4s ease;}' +
    '#tm-cookie-bar.visible{transform:translateY(0);}' +
    '#tm-cookie-bar p{flex:1;min-width:220px;color:rgba(255,255,255,.8);font-size:13px;line-height:1.5;margin:0;font-family:Inter,sans-serif;}' +
    '#tm-cookie-bar a{color:#F2DF74;text-decoration:underline;}' +
    '#tm-cookie-bar .tm-cb-btns{display:flex;gap:8px;flex-shrink:0;}' +
    '#tm-cb-accept{background:#772432;color:#fff;border:none;border-radius:999px;padding:9px 20px;font-size:13px;font-weight:600;cursor:pointer;font-family:Inter,sans-serif;transition:background .2s;}' +
    '#tm-cb-accept:hover{background:#8c2b3b;}' +
    '#tm-cb-decline{background:transparent;color:rgba(255,255,255,.6);border:1px solid rgba(255,255,255,.25);border-radius:999px;padding:9px 16px;font-size:13px;font-weight:500;cursor:pointer;font-family:Inter,sans-serif;transition:all .2s;}' +
    '#tm-cb-decline:hover{color:#fff;border-color:rgba(255,255,255,.5);}' +
    '@media(max-width:480px){#tm-cookie-bar{flex-direction:column;align-items:flex-start;}#tm-cookie-bar .tm-cb-btns{width:100%;}#tm-cb-accept,#tm-cb-decline{flex:1;text-align:center;}}';
  document.head.appendChild(css);

  var bar = document.createElement('div');
  bar.id = 'tm-cookie-bar';
  bar.innerHTML =
    '<p>Folosim cookie-uri esențiale pentru funcționarea site-ului. ' +
    'Citește <a href="cookies.html">Politica noastră de cookies</a>.</p>' +
    '<div class="tm-cb-btns">' +
    '<button id="tm-cb-decline">Doar esențiale</button>' +
    '<button id="tm-cb-accept">Acceptă toate</button>' +
    '</div>';
  document.body.appendChild(bar);

  requestAnimationFrame(function () {
    requestAnimationFrame(function () { bar.classList.add('visible'); });
  });

  function dismiss(value) {
    localStorage.setItem(STORAGE_KEY, value);
    bar.style.transform = 'translateY(100%)';
    setTimeout(function () { bar.remove(); }, 400);
  }

  document.getElementById('tm-cb-accept').addEventListener('click', function () { dismiss('all'); });
  document.getElementById('tm-cb-decline').addEventListener('click', function () { dismiss('essential'); });
})();
