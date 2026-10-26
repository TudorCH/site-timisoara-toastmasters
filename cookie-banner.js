(function () {
  var KEY = 'tm-cookies-v3';
  localStorage.removeItem('tm-cookie-consent');
  localStorage.removeItem('tm-cookies-v1');
  localStorage.removeItem('tm-cookies-v2');
  if (localStorage.getItem(KEY)) return;

  var MOBILE = '(max-width:700px)';

  var style = document.createElement('style');
  style.textContent =
    '#tm-bar{position:fixed;bottom:24px;left:24px;z-index:99999;width:calc(100% - 48px);max-width:420px;box-sizing:border-box;' +
    'background:rgba(0,45,71,.72);-webkit-backdrop-filter:blur(20px) saturate(140%);backdrop-filter:blur(20px) saturate(140%);' +
    'border:1px solid rgba(255,255,255,.12);border-radius:24px;box-shadow:0 20px 50px rgba(0,0,0,.45);' +
    'padding:24px;overflow:hidden;font-family:Inter,sans-serif;' +
    'opacity:0;transform:translateY(24px);transition:opacity .35s ease,transform .35s ease;}' +
    '#tm-bar.in{opacity:1;transform:translateY(0);}' +
    '#tm-glow{position:absolute;top:-56px;left:-56px;width:150px;height:150px;border-radius:50%;' +
    'background:rgba(242,223,116,.10);filter:blur(32px);pointer-events:none;}' +
    '#tm-inner{position:relative;display:flex;flex-direction:column;gap:16px;}' +

    '#tm-icon{width:44px;height:44px;border-radius:16px;display:flex;align-items:center;justify-content:center;flex-shrink:0;' +
    'color:#F2DF74;background:rgba(242,223,116,.08);border:1px solid rgba(242,223,116,.25);box-shadow:0 0 16px rgba(242,223,116,.15);}' +
    '#tm-icon svg{width:24px;height:24px;}' +

    '#tm-text p{margin:0;}' +
    '#tm-text-long p:first-child{font-size:14px;line-height:1.6;color:rgba(255,255,255,.88);margin-bottom:8px;}' +
    '#tm-text-long p+p{font-size:12.5px;line-height:1.6;color:rgba(255,255,255,.6);}' +
    '#tm-text a{color:#F2DF74;font-weight:600;text-decoration:underline;text-underline-offset:3px;transition:color .2s;}' +
    '#tm-text a:hover{color:#f7ea99;}' +
    '#tm-text-short{display:none;}' +

    '#tm-actions{display:flex;align-items:center;justify-content:flex-end;gap:10px;padding-top:4px;}' +
    '#tm-more{display:none;}' +
    '#tm-settings{background:transparent;border:none;color:rgba(255,255,255,.6);font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;' +
    'text-decoration:underline;text-underline-offset:3px;padding:4px 2px;margin-right:auto;white-space:nowrap;transition:color .2s;}' +
    '#tm-settings:hover{color:#F2DF74;}' +
    '#tm-ess{background:rgba(255,255,255,.04);color:#fff;border:1.5px solid rgba(255,255,255,.3);border-radius:12px;padding:9px 18px;' +
    'font-size:12.5px;font-weight:700;cursor:pointer;font-family:inherit;white-space:nowrap;transition:all .2s;}' +
    '#tm-ess:hover{border-color:#fff;background:rgba(255,255,255,.1);}' +
    '#tm-ok{background:#F2DF74;color:#004165;border:none;border-radius:12px;padding:9px 22px;font-size:12.5px;font-weight:700;cursor:pointer;' +
    'font-family:inherit;white-space:nowrap;box-shadow:0 0 18px rgba(242,223,116,.25);transition:background .2s,box-shadow .2s;}' +
    '#tm-ok:hover{background:#f7ea99;box-shadow:0 0 24px rgba(242,223,116,.4);}' +
    '#tm-bar button:focus-visible,#tm-bar a:focus-visible{outline:2px solid #F2DF74;outline-offset:3px;}' +

    '@keyframes tm-cta-pulse{0%{box-shadow:0 0 0 0 rgba(242,223,116,.7)}70%{box-shadow:0 0 0 10px rgba(242,223,116,0)}100%{box-shadow:0 0 0 0 rgba(242,223,116,0)}}' +
    '.tm-cta-active{animation:tm-cta-pulse .7s ease 2;}' +

    /* Mobile: bottom sheet docked to the screen edge */
    '@media' + MOBILE + '{' +
    '#tm-bar{bottom:0;left:0;width:100%;max-width:none;border-radius:20px 20px 0 0;border-width:1px 0 0;' +
    'padding:16px 16px calc(14px + env(safe-area-inset-bottom,0px));box-shadow:0 -10px 40px rgba(0,0,0,.4);' +
    'background:rgba(0,45,71,.88);opacity:1;transform:translateY(100%);}' +
    '#tm-inner{gap:12px;}' +
    '#tm-head{display:flex;align-items:center;gap:12px;}' +
    '#tm-icon{width:36px;height:36px;border-radius:12px;}' +
    '#tm-icon svg{width:20px;height:20px;}' +
    '#tm-text-long{display:none;}' +
    '#tm-text-short{display:block;font-size:13px;line-height:1.45;color:rgba(255,255,255,.88);}' +
    '#tm-actions{gap:6px;padding-top:0;}' +
    '#tm-settings{display:none;}' +
    '#tm-more{display:flex;flex:1;align-items:center;justify-content:center;color:#F2DF74;border:1.5px solid rgba(242,223,116,.35);border-radius:12px;' +
    'padding:9px 8px;font-size:11.5px;font-weight:600;text-decoration:none;white-space:nowrap;font-family:Inter,sans-serif;transition:border-color .2s;}' +
    '#tm-more:hover{border-color:rgba(242,223,116,.7);}' +
    '#tm-ess,#tm-ok{flex:1;text-align:center;padding:9px 8px;font-size:11.5px;}' +
    /* Toasty's FAB rides above the sheet instead of being covered by it */
    'body.tm-consent-open #ty-fab{bottom:calc(var(--tm-bar-h,0px) + 12px)!important;}' +
    '#ty-fab{transition:transform .2s,box-shadow .2s,opacity .2s,visibility .2s,bottom .35s ease!important;}' +
    '}' +
    '@media(min-width:701px){#tm-head{display:contents;}}' +
    '@media(prefers-reduced-motion:reduce){#tm-bar{transition:none;}}';
  document.head.appendChild(style);

  var bar = document.createElement('div');
  bar.id = 'tm-bar';
  bar.setAttribute('role', 'dialog');
  bar.setAttribute('aria-label', 'Preferințe cookies');
  bar.innerHTML =
    '<div id="tm-glow"></div>' +
    '<div id="tm-inner">' +
      '<div id="tm-head">' +
        '<div id="tm-icon" aria-hidden="true">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/>' +
            '<path d="M8.5 8.5v.01"/><path d="M7.5 15.5v.01"/><path d="M12 12v.01"/><path d="M11 17v.01"/><path d="M16 14v.01"/>' +
          '</svg>' +
        '</div>' +
        '<div id="tm-text">' +
          '<div id="tm-text-long">' +
            '<p>Folosim date stocate local în browserul tău și servicii terțe de bază. Nu folosim trackere de urmărire sau publicitate.</p>' +
            '<p>Apasă „Acceptă” pentru toate funcționalitățile sau „Respinge” pentru cele esențiale. <a href="/cookies">Politică cookies</a></p>' +
          '</div>' +
          '<p id="tm-text-short">Folosim cookie-uri esențiale, fără elemente de tracking.</p>' +
        '</div>' +
      '</div>' +
      '<div id="tm-actions">' +
        '<a id="tm-more" href="/cookies">Află mai multe</a>' +
        '<button id="tm-settings" type="button">Setări cookies</button>' +
        '<button id="tm-ess" type="button">Respinge</button>' +
        '<button id="tm-ok" type="button">Acceptă</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(bar);

  var mq = window.matchMedia(MOBILE);

  /* On mobile the sheet shares the bottom edge with Toasty: publish its height so the FAB
     can sit above it, and flag the body so Toasty holds its teaser until a choice is made. */
  function syncLayout() {
    if (!bar.classList.contains('in')) return;
    document.body.style.setProperty('--tm-bar-h', bar.offsetHeight + 'px');
    document.body.classList.toggle('tm-consent-open', mq.matches);
  }

  function showBar() {
    bar.classList.add('in');
    syncLayout();
  }

  function dismiss(v) {
    localStorage.setItem(KEY, v);
    bar.classList.remove('in');
    document.body.classList.remove('tm-consent-open');
    window.removeEventListener('resize', syncLayout);
    setTimeout(function () {
      bar.remove();
      document.body.style.removeProperty('--tm-bar-h');
      document.querySelectorAll('a[href="contact"].bg-gold, a[href="/contact"].bg-gold').forEach(function (el) {
        el.classList.add('tm-cta-active');
        setTimeout(function () { el.classList.remove('tm-cta-active'); }, 1500);
      });
    }, 380);
  }

  window.addEventListener('resize', syncLayout);
  document.getElementById('tm-ok').addEventListener('click', function () { dismiss('all'); });
  document.getElementById('tm-ess').addEventListener('click', function () { dismiss('essential'); });
  document.getElementById('tm-settings').addEventListener('click', function () { window.location.href = '/cookies'; });

  setTimeout(showBar, 2000);
})();
