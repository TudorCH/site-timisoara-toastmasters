// Cookie-free visit statistics (see /cookies#statistici). Sends the page path and the referring
// site once per page, plus outbound link clicks. Nothing is stored in the browser.
// Skipped when the visitor refused in the cookie banner or the browser asks not to be tracked.
(function () {
  try {
    if (localStorage.getItem('tm-cookies-v3') === 'essential') return;
  } catch (e) { /* storage blocked: still fine to count */ }
  if (navigator.globalPrivacyControl || navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.webdriver) return;
  if (!navigator.sendBeacon) return;

  function send(data) {
    try { navigator.sendBeacon('/api/track', new Blob([JSON.stringify(data)], { type: 'text/plain' })); } catch (e) {}
  }

  var ref = document.referrer;
  try { if (ref && new URL(ref).host === location.host) ref = location.origin; } catch (e) { ref = ''; }
  send({ p: location.pathname, r: ref });

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="http"]');
    if (a && a.host !== location.host) send({ t: 'click', u: a.href });
  }, true);
})();
