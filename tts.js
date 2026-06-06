/* ════════════════════════════════════════════════
   TTS - Azure Neural ro-RO-EmilNeural
   ════════════════════════════════════════════════ */
(function () {

  /* ── CSS for button states ── */
  var css = document.createElement('style');
  css.textContent = [
    '@keyframes ttsPulse{0%,100%{opacity:1}50%{opacity:.4}}',
    '@keyframes ttsSpin{to{transform:rotate(360deg)}}',
    '[data-tts-btn].tts-loading svg{animation:ttsPulse .9s ease-in-out infinite;}',
    '[data-tts-btn].tts-speaking{color:#F2DF74!important;}',
    '[data-tts-btn] .tts-spin{animation:ttsSpin .9s linear infinite;transform-origin:center;}',
    '#tts-live{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;}'
  ].join('');
  document.head.appendChild(css);

  /* ── Icons ── */
  var iSpeak = '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>';
  var iPause = '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>';
  var iPlay  = '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
  var iLoad  = '<svg class="w-4 h-4 tts-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 2a10 10 0 0 1 10 10" opacity=".9"/><path d="M12 2a10 10 0 0 0-10 10" opacity=".3"/></svg>';

  /* ── Live region for screen readers ── */
  var live = document.createElement('div');
  live.id = 'tts-live';
  live.setAttribute('aria-live', 'polite');
  live.setAttribute('aria-atomic', 'true');
  document.body.appendChild(live);

  function announce(msg) { live.textContent = ''; setTimeout(function(){ live.textContent = msg; }, 50); }

  /* ── State ── */
  var state = 'idle';
  var currentAudio = null;
  var aborted = false;
  var FIRST_CHUNK = 650;
  var CHUNK = 2800;

  function updateBtns(icon, addCls) {
    document.querySelectorAll('[data-tts-btn]').forEach(function(b) {
      b.innerHTML = icon;
      b.classList.remove('tts-speaking', 'tts-loading');
      if (addCls) b.classList.add(addCls);
    });
  }

  function setIdle()    { state='idle';     updateBtns(iSpeak);               }
  function setLoading() { state='loading';  updateBtns(iLoad, 'tts-loading'); }
  function setSpeaking(){ state='speaking'; updateBtns(iPause,'tts-speaking');}
  function setPaused()  { state='paused';   updateBtns(iPlay);                }

  /* ── Extract readable text ── */
  function getPageText() {
    var title = (document.title || '').split('|')[0].trim();
    var clone = document.body.cloneNode(true);
    clone.querySelectorAll(
      'script,style,noscript,nav,footer,header,[aria-hidden="true"],' +
      '[data-tts-btn],#toasty-btn,#toasty-win,#btt-btn,' +
      '#mobile-menu,#search-dropdown,#mobile-search-dropdown,.sr-only,#tts-live'
    ).forEach(function(el){ el.remove(); });
    var body = (clone.innerText || '').replace(/\s+/g, ' ').trim();
    return 'Bună ziua! Citesc pagina ' + title + '. ' + body + ' Acesta este sfârșitul paginii. Vă mulțumesc că ați ascultat.';
  }

  /* ── Split: small first chunk for fast start, larger rest ── */
  function splitChunks(text) {
    var chunks = [];
    var rem = text.trim();
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
      aborted = true; announce('Citire anulată.'); setIdle();
    } else if (state === 'speaking') {
      if (currentAudio) currentAudio.pause();
      announce('Pauză.'); setPaused();
    } else if (state === 'paused') {
      if (currentAudio) currentAudio.play();
      announce('Continuă citirea.'); setSpeaking();
    }
  }

  /* ── Wire buttons after DOM ready ── */
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('[data-tts-btn]').forEach(function(b) {
      b.addEventListener('click', toggle);
    });
  });

  /* ── Alt+T keyboard shortcut ── */
  document.addEventListener('keydown', function(e) {
    if (e.altKey && (e.key === 't' || e.key === 'T')) { e.preventDefault(); toggle(); }
  });

  window.addEventListener('beforeunload', function() {
    aborted = true;
    if (currentAudio) currentAudio.pause();
  });

})();
