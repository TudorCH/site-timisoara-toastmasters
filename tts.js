/* ════════════════════════════════════════════════
   TTS - Azure Neural ro-RO-EmilNeural
   ════════════════════════════════════════════════ */
(function () {

  /* ── CSS ── */
  var css = document.createElement('style');
  css.textContent = [
    '@keyframes ttsPulse{0%,100%{box-shadow:0 4px 20px rgba(119,36,50,.5)}50%{box-shadow:0 4px 28px rgba(119,36,50,.85),0 0 0 7px rgba(119,36,50,.15)}}',
    '@keyframes ttsSpin{to{transform:rotate(360deg)}}',
    '#tts-btn{all:unset;position:fixed!important;bottom:24px!important;left:24px!important;z-index:2147483646!important;width:48px;height:48px;border-radius:50%;cursor:pointer;background:linear-gradient(135deg,#772432,#9a2f40);box-shadow:0 4px 20px rgba(119,36,50,.45);display:flex!important;align-items:center;justify-content:center;transition:opacity .3s ease,background .25s,box-shadow .2s;opacity:0.45;}',
    '#tts-btn:focus-visible{outline:3px solid #F2DF74!important;outline-offset:3px!important;opacity:1;}',
    '#tts-btn:hover{box-shadow:0 6px 28px rgba(119,36,50,.6);opacity:1;}',
    '#tts-btn.tts-speaking{animation:ttsPulse 1.5s ease-in-out infinite;opacity:1;}',
    '#tts-btn.tts-loading{opacity:1;}',
    '#tts-btn .tts-spin{animation:ttsSpin .9s linear infinite;transform-origin:center;}',
    /* tooltip */
    '#tts-btn::after{content:attr(data-tip);position:absolute;left:60px;bottom:50%;transform:translateY(50%);background:rgba(0,0,0,.82);color:#fff;font-family:Inter,sans-serif;font-size:12px;white-space:nowrap;padding:5px 10px;border-radius:6px;pointer-events:none;opacity:0;transition:opacity .2s ease;}',
    '#tts-btn:hover::after,#tts-btn:focus-visible::after{opacity:1;}',
    '@media(min-width:640px){#tts-btn{width:56px;height:56px;}}'
  ].join('');
  document.head.appendChild(css);

  /* ── Icons ── */
  var iSpeak = '<svg width="22" height="22" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>';
  var iPause = '<svg width="22" height="22" fill="white" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>';
  var iPlay  = '<svg width="20" height="20" fill="white" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
  var iLoad  = '<svg class="tts-spin" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><path d="M12 2a10 10 0 0 1 10 10" opacity=".9"/><path d="M12 2a10 10 0 0 0-10 10" opacity=".3"/></svg>';

  /* ── Live region for screen readers ── */
  var liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;';
  document.body.appendChild(liveRegion);

  function announce(msg) { liveRegion.textContent = ''; setTimeout(function(){ liveRegion.textContent = msg; }, 50); }

  /* ── Button ── */
  var btn = document.createElement('button');
  btn.id = 'tts-btn';
  btn.setAttribute('tabindex', '0');
  btn.setAttribute('aria-keyshortcuts', 'Alt+T');
  btn.setAttribute('data-tip', 'Citește pagina (Alt+T)');
  btn.setAttribute('aria-label', 'Citește pagina cu voce (Alt+T)');
  btn.innerHTML = iSpeak;
  document.body.appendChild(btn);

  /* ── State ── */
  var state = 'idle';
  var currentAudio = null;
  var aborted = false;
  var FIRST_CHUNK = 650;
  var CHUNK = 2800;

  function setIdle()    { state='idle';     btn.innerHTML=iSpeak;  btn.classList.remove('tts-speaking','tts-loading'); btn.setAttribute('aria-label','Citește pagina cu voce (Alt+T)'); btn.setAttribute('data-tip','Citește pagina (Alt+T)'); }
  function setLoading() { state='loading';  btn.innerHTML=iLoad;   btn.classList.remove('tts-speaking'); btn.classList.add('tts-loading'); btn.setAttribute('aria-label','Se încarcă audio…'); btn.setAttribute('data-tip','Se încarcă…'); }
  function setSpeaking(){ state='speaking'; btn.innerHTML=iPause;  btn.classList.add('tts-speaking');    btn.setAttribute('aria-label','Pauză citire (Alt+T)');            btn.setAttribute('data-tip','Pauză (Alt+T)'); }
  function setPaused()  { state='paused';   btn.innerHTML=iPlay;   btn.classList.remove('tts-speaking'); btn.setAttribute('aria-label','Continuă citirea (Alt+T)');         btn.setAttribute('data-tip','Continuă (Alt+T)'); }

  /* ── Extract readable text with friendly intro/outro ── */
  function getPageText() {
    var title = (document.title || '').split('|')[0].trim();
    var clone = document.body.cloneNode(true);
    clone.querySelectorAll(
      'script,style,noscript,nav,footer,header,[aria-hidden="true"],' +
      '#tts-btn,#toasty-btn,#toasty-win,#btt-btn,' +
      '#mobile-menu,#search-dropdown,#mobile-search-dropdown,.sr-only'
    ).forEach(function(el){ el.remove(); });
    var body = (clone.innerText || '').replace(/\s+/g, ' ').trim();
    return 'Bună ziua! Citesc pagina ' + title + '. ' + body + ' Acesta este sfârșitul paginii. Vă mulțumesc că ați ascultat.';
  }

  /* ── Split: small first chunk for fast start, larger rest ── */
  function splitChunks(text) {
    var chunks = [];
    var rem = text.trim();
    // First chunk smaller → faster first audio response
    if (rem.length > FIRST_CHUNK) {
      var i = rem.lastIndexOf('. ', FIRST_CHUNK);
      if (i < 150) i = FIRST_CHUNK;
      chunks.push(rem.slice(0, i + 1).trim());
      rem = rem.slice(i + 1).trim();
    }
    while (rem.length > CHUNK) {
      var j = rem.lastIndexOf('. ', CHUNK);
      if (j < 400) j = rem.lastIndexOf(' ', CHUNK);
      if (j < 0)   j = CHUNK;
      chunks.push(rem.slice(0, j + 1).trim());
      rem = rem.slice(j + 1).trim();
    }
    if (rem) chunks.push(rem);
    return chunks;
  }

  function fetchChunk(text) {
    return fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text })
    }).then(function(r) {
      if (!r.ok) throw new Error('TTS ' + r.status);
      return r.blob();
    }).then(function(blob) {
      return URL.createObjectURL(blob);
    });
  }

  function playUrl(url) {
    return new Promise(function(resolve) {
      currentAudio = new Audio(url);
      currentAudio.onended = resolve;
      currentAudio.onerror = resolve;
      currentAudio.play().catch(resolve);
    });
  }

  async function runQueue(chunks) {
    aborted = false;
    announce('Se încarcă audio, vă rugăm așteptați.');
    var nextFetch = fetchChunk(chunks[0]);

    for (var i = 0; i < chunks.length; i++) {
      if (aborted) break;
      if (i === 0) setLoading();

      var url;
      try { url = await nextFetch; }
      catch(e) { announce('Eroare la încărcarea audio. Verificați conexiunea.'); setIdle(); return; }

      if (aborted) { URL.revokeObjectURL(url); break; }

      if (i + 1 < chunks.length) nextFetch = fetchChunk(chunks[i + 1]);

      setSpeaking();
      if (i === 0) announce('Citire pornită. Apăsați butonul pentru pauză.');
      await playUrl(url);
      URL.revokeObjectURL(url);
    }

    if (!aborted) { announce('Citirea paginii s-a terminat.'); setIdle(); }
  }

  /* ── Toggle ── */
  function toggle() {
    if (state === 'idle') {
      runQueue(splitChunks(getPageText()));
    } else if (state === 'loading') {
      aborted = true;
      announce('Citire anulată.');
      setIdle();
    } else if (state === 'speaking') {
      if (currentAudio) currentAudio.pause();
      announce('Pauză.');
      setPaused();
    } else if (state === 'paused') {
      if (currentAudio) currentAudio.play();
      announce('Continuă citirea.');
      setSpeaking();
    }
  }

  btn.addEventListener('click', toggle);

  /* ── Alt+T keyboard shortcut ── */
  document.addEventListener('keydown', function(e) {
    if (e.altKey && e.key === 't') { e.preventDefault(); toggle(); }
  });

  window.addEventListener('beforeunload', function() {
    aborted = true;
    if (currentAudio) currentAudio.pause();
  });

})();
