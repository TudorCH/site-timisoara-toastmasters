/* ════════════════════════════════════════════════
   TTS - Accessibility text-to-speech button
   ════════════════════════════════════════════════ */
(function () {
  if (!('speechSynthesis' in window)) return;

  /* ── CSS ── */
  var css = document.createElement('style');
  css.textContent = [
    '@keyframes ttsPulse{0%,100%{box-shadow:0 4px 20px rgba(0,65,101,.5)}50%{box-shadow:0 4px 28px rgba(0,65,101,.85),0 0 0 7px rgba(0,65,101,.15)}}',
    '#tts-btn{all:unset;position:fixed!important;bottom:24px!important;left:24px!important;z-index:2147483646!important;width:48px;height:48px;border-radius:50%;cursor:pointer;background:linear-gradient(135deg,#004165,#00537f);box-shadow:0 4px 20px rgba(0,65,101,.45);display:flex!important;align-items:center;justify-content:center;transition:background .25s,transform .2s,box-shadow .2s;}',
    '#tts-btn:hover{transform:scale(1.1);box-shadow:0 6px 28px rgba(0,65,101,.6);}',
    '#tts-btn.tts-speaking{animation:ttsPulse 1.5s ease-in-out infinite;}',
    '@media(min-width:640px){#tts-btn{width:56px;height:56px;}}'
  ].join('');
  document.head.appendChild(css);

  /* ── Icons ── */
  var iconSpeaker = '<svg width="22" height="22" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>';
  var iconPause   = '<svg width="22" height="22" fill="white" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>';
  var iconPlay    = '<svg width="20" height="20" fill="white" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>';

  /* ── Button ── */
  var btn = document.createElement('button');
  btn.id = 'tts-btn';
  btn.title = 'Citește pagina cu voce';
  btn.setAttribute('aria-label', 'Citește pagina cu voce');
  btn.innerHTML = iconSpeaker;
  document.body.appendChild(btn);

  /* ── State ── */
  var state = 'idle'; // idle | speaking | paused
  var keepAlive;

  /* ── Get readable page text (skip nav/footer/scripts) ── */
  function getPageText() {
    var src = document.querySelector('body');
    var clone = src.cloneNode(true);
    clone.querySelectorAll(
      'script,style,noscript,nav,footer,[aria-hidden="true"],' +
      '#tts-btn,#toasty-btn,#toasty-win,#btt-btn,' +
      '#mobile-menu,#search-dropdown,#mobile-search-dropdown,' +
      '.sr-only,[hidden]'
    ).forEach(function (el) { el.remove(); });
    return (clone.innerText || clone.textContent || '').replace(/\s+/g, ' ').trim();
  }

  /* ── Chrome keepAlive: synthesis stops after ~15s ── */
  function startKeepAlive() {
    clearInterval(keepAlive);
    keepAlive = setInterval(function () {
      if (state === 'speaking' && window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      } else {
        clearInterval(keepAlive);
      }
    }, 10000);
  }

  function setIdle() {
    clearInterval(keepAlive);
    state = 'idle';
    btn.innerHTML = iconSpeaker;
    btn.classList.remove('tts-speaking');
    btn.setAttribute('aria-label', 'Citește pagina cu voce');
  }

  /* ── Start ── */
  function start() {
    window.speechSynthesis.cancel();
    clearInterval(keepAlive);

    var utt = new SpeechSynthesisUtterance(getPageText());
    utt.lang  = 'ro-RO';
    utt.rate  = 0.92;
    utt.pitch = 1;

    utt.onstart = startKeepAlive;
    utt.onend   = setIdle;
    utt.onerror = setIdle;

    window.speechSynthesis.speak(utt);
    state = 'speaking';
    btn.innerHTML = iconPause;
    btn.classList.add('tts-speaking');
    btn.setAttribute('aria-label', 'Pauză citire');
  }

  /* ── Toggle on click ── */
  btn.addEventListener('click', function () {
    if (state === 'idle') {
      start();
    } else if (state === 'speaking') {
      window.speechSynthesis.pause();
      clearInterval(keepAlive);
      state = 'paused';
      btn.innerHTML = iconPlay;
      btn.classList.remove('tts-speaking');
      btn.setAttribute('aria-label', 'Continuă citirea');
    } else {
      window.speechSynthesis.resume();
      state = 'speaking';
      btn.innerHTML = iconPause;
      btn.classList.add('tts-speaking');
      btn.setAttribute('aria-label', 'Pauză citire');
      startKeepAlive();
    }
  });

  /* ── Stop on navigate ── */
  window.addEventListener('beforeunload', function () {
    clearInterval(keepAlive);
    window.speechSynthesis.cancel();
  });

})();
