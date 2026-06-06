/* ════════════════════════════════════════════════
   TTS - Azure Neural ro-RO-EmilNeural
   ════════════════════════════════════════════════ */
(function () {

  /* ── CSS ── */
  var css = document.createElement('style');
  css.textContent = [
    '@keyframes ttsPulse{0%,100%{box-shadow:0 4px 20px rgba(0,65,101,.5)}50%{box-shadow:0 4px 28px rgba(0,65,101,.85),0 0 0 7px rgba(0,65,101,.15)}}',
    '@keyframes ttsSpin{to{transform:rotate(360deg)}}',
    '#tts-btn{all:unset;position:fixed!important;bottom:24px!important;left:24px!important;z-index:2147483646!important;width:48px;height:48px;border-radius:50%;cursor:pointer;background:linear-gradient(135deg,#004165,#00537f);box-shadow:0 4px 20px rgba(0,65,101,.45);display:flex!important;align-items:center;justify-content:center;transition:background .25s,box-shadow .2s;}',
    '#tts-btn:hover{box-shadow:0 6px 28px rgba(0,65,101,.6);}',
    '#tts-btn.tts-speaking{animation:ttsPulse 1.5s ease-in-out infinite;}',
    '#tts-btn .tts-spin{animation:ttsSpin .9s linear infinite;transform-origin:center;}',
    '@media(min-width:640px){#tts-btn{width:56px;height:56px;}}'
  ].join('');
  document.head.appendChild(css);

  /* ── Icons ── */
  var iSpeak  = '<svg width="22" height="22" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>';
  var iPause  = '<svg width="22" height="22" fill="white" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>';
  var iPlay   = '<svg width="20" height="20" fill="white" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
  var iLoad   = '<svg class="tts-spin" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><path d="M12 2a10 10 0 0 1 10 10" opacity=".9"/><path d="M12 2a10 10 0 0 0-10 10" opacity=".3"/></svg>';

  /* ── Button ── */
  var btn = document.createElement('button');
  btn.id = 'tts-btn';
  btn.setAttribute('aria-label', 'Citește pagina cu voce');
  btn.title = 'Citește pagina cu voce';
  btn.innerHTML = iSpeak;
  document.body.appendChild(btn);

  /* ── State ── */
  var state = 'idle'; // idle | loading | speaking | paused
  var currentAudio = null;
  var aborted = false;
  var CHUNK = 2800;

  /* ── Helpers ── */
  function setIdle()    { state='idle';     btn.innerHTML=iSpeak;  btn.classList.remove('tts-speaking'); btn.setAttribute('aria-label','Citește pagina cu voce'); }
  function setLoading() { state='loading';  btn.innerHTML=iLoad;   btn.classList.remove('tts-speaking'); btn.setAttribute('aria-label','Se încarcă…'); }
  function setSpeaking(){ state='speaking'; btn.innerHTML=iPause;  btn.classList.add('tts-speaking');    btn.setAttribute('aria-label','Pauză citire'); }
  function setPaused()  { state='paused';   btn.innerHTML=iPlay;   btn.classList.remove('tts-speaking'); btn.setAttribute('aria-label','Continuă citirea'); }

  /* ── Get readable text, skip chrome/scripts ── */
  function getPageText() {
    var clone = document.body.cloneNode(true);
    clone.querySelectorAll(
      'script,style,noscript,nav,footer,header,[aria-hidden="true"],' +
      '#tts-btn,#toasty-btn,#toasty-win,#btt-btn,' +
      '#mobile-menu,#search-dropdown,#mobile-search-dropdown,.sr-only'
    ).forEach(function(el){ el.remove(); });
    return (clone.innerText || '').replace(/\s+/g, ' ').trim();
  }

  /* ── Split at sentence boundaries ── */
  function splitChunks(text) {
    var chunks = [], remaining = text.trim();
    while (remaining.length > CHUNK) {
      var i = remaining.lastIndexOf('. ', CHUNK);
      if (i < 400) i = remaining.lastIndexOf(' ', CHUNK);
      if (i < 0) i = CHUNK;
      chunks.push(remaining.slice(0, i + 1).trim());
      remaining = remaining.slice(i + 1).trim();
    }
    if (remaining) chunks.push(remaining);
    return chunks;
  }

  /* ── Fetch one chunk from API ── */
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

  /* ── Play one URL, return promise that resolves when done ── */
  function playUrl(url) {
    return new Promise(function(resolve) {
      currentAudio = new Audio(url);
      currentAudio.onended  = resolve;
      currentAudio.onerror  = resolve;
      currentAudio.play().catch(resolve);
    });
  }

  /* ── Run queue with prefetch pipeline ── */
  async function runQueue(chunks) {
    aborted = false;
    var nextFetch = fetchChunk(chunks[0]);

    for (var i = 0; i < chunks.length; i++) {
      if (aborted) break;
      if (i === 0) setLoading();

      var url;
      try { url = await nextFetch; }
      catch(e) { setIdle(); return; }

      if (aborted) { URL.revokeObjectURL(url); break; }

      // Prefetch next chunk while current plays
      if (i + 1 < chunks.length) nextFetch = fetchChunk(chunks[i + 1]);

      setSpeaking();
      await playUrl(url);
      URL.revokeObjectURL(url);
    }

    if (!aborted) setIdle();
  }

  /* ── Toggle ── */
  btn.addEventListener('click', function() {
    if (state === 'idle') {
      runQueue(splitChunks(getPageText()));
    } else if (state === 'loading') {
      aborted = true;
      setIdle();
    } else if (state === 'speaking') {
      if (currentAudio) currentAudio.pause();
      setPaused();
    } else if (state === 'paused') {
      if (currentAudio) currentAudio.play();
      setSpeaking();
    }
  });

  window.addEventListener('beforeunload', function() {
    aborted = true;
    if (currentAudio) currentAudio.pause();
  });

})();
