/* ════════════════════════════════════════════════
   TTS - Azure Neural ro-RO + karaoke bar
   ════════════════════════════════════════════════ */
(function () {

  /* ── CSS ── */
  var css = document.createElement('style');
  css.textContent = [
    '@keyframes ttsPulse{0%,100%{opacity:1}50%{opacity:.4}}',
    '@keyframes ttsSpin{to{transform:rotate(360deg)}}',
    '#tts-float{position:fixed;bottom:1.5rem;left:1.25rem;z-index:9998;width:3rem;height:3rem;border-radius:9999px;background:#004165;color:white;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 18px rgba(0,45,71,.45);transition:background .2s,transform .2s,bottom .3s;}',
    '#tts-float:hover{background:#00527f;transform:scale(1.08);}',
    '#tts-float.tts-loading svg{animation:ttsPulse .9s ease-in-out infinite;}',
    '#tts-float.tts-speaking{background:#772432!important;}',
    '#tts-float.tts-speaking:hover{background:#8e2b3a!important;}',
    '#tts-float .tts-spin{animation:ttsSpin .9s linear infinite;transform-origin:center;}',
    '[data-tts-btn].tts-nav-active{color:#F2DF74!important;}',
    '#tts-live{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;}',

    /* karaoke panel */
    '#tts-kar{position:fixed;bottom:0;left:0;right:0;z-index:9990;' +
      'background:rgba(0,28,43,.96);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);' +
      'color:rgba(255,255,255,.85);padding:.65rem 1.1rem .75rem;' +
      'font-size:.82rem;line-height:1.7;' +
      'border-top:1px solid rgba(242,223,116,.18);' +
      'transition:opacity .3s;}',
    '#tts-kar-prog{height:2px;background:rgba(255,255,255,.1);margin-bottom:.45rem;border-radius:1px;overflow:hidden;}',
    '#tts-kar-bar{height:100%;background:#F2DF74;width:0%;transition:width .4s linear;border-radius:1px;}',
    '#tts-kar-words{word-break:break-word;}',
    '#tts-kar .tw{display:inline;border-radius:3px;padding:0 1px;transition:background .1s,color .1s;}',
    '#tts-kar .tw.cur{background:rgba(242,223,116,.28);color:#F2DF74;font-weight:600;}'
  ].join('');
  document.head.appendChild(css);

  /* ── Icons ── */
  var iPause = '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>';
  var iPlay  = '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
  var iLoad  = '<svg class="w-5 h-5 tts-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 2a10 10 0 0 1 10 10" opacity=".9"/><path d="M12 2a10 10 0 0 0-10 10" opacity=".3"/></svg>';

  /* ── Live region ── */
  var live = document.createElement('div');
  live.id = 'tts-live';
  live.setAttribute('aria-live', 'polite');
  live.setAttribute('aria-atomic', 'true');
  document.body.appendChild(live);

  function announce(msg) { live.textContent = ''; setTimeout(function(){ live.textContent = msg; }, 50); }

  /* ── State ── */
  var state        = 'idle';
  var currentAudio = null;
  var aborted      = false;
  var FIRST_CHUNK  = 650;
  var CHUNK        = 2800;

  /* ── Karaoke state ── */
  var karPanel  = null;
  var karWords  = [];
  var karIdx    = -1;
  var rafId     = null;
  var totalChunks = 0;
  var chunkIndex  = 0;

  /* ── Floating button ── */
  var floatBtn = null;

  function floatBottom() {
    if (!floatBtn) return;
    floatBtn.style.bottom = karPanel ? '5.5rem' : '1.5rem';
  }

  function createFloat() {
    if (floatBtn) return;
    floatBtn = document.createElement('button');
    floatBtn.id = 'tts-float';
    floatBtn.setAttribute('aria-label', 'Control citire pagină');
    floatBtn.innerHTML = iLoad;
    floatBtn.addEventListener('click', toggleFloat);
    document.body.appendChild(floatBtn);
  }

  function removeFloat() {
    if (floatBtn) { floatBtn.remove(); floatBtn = null; }
  }

  function updateFloat(icon, addCls) {
    if (!floatBtn) return;
    floatBtn.innerHTML = icon;
    floatBtn.classList.remove('tts-speaking', 'tts-loading');
    if (addCls) floatBtn.classList.add(addCls);
  }

  function setNavActive(active) {
    document.querySelectorAll('[data-tts-btn]').forEach(function(b) {
      b.classList.toggle('tts-nav-active', active);
    });
  }

  function setIdle() {
    state = 'idle';
    setNavActive(false);
    removeFloat();
    removeKaraoke();
  }
  function setLoading()  { state = 'loading';  updateFloat(iLoad,  'tts-loading'); }
  function setSpeaking() { state = 'speaking'; updateFloat(iPause, 'tts-speaking'); startKarTick(); }
  function setPaused()   { state = 'paused';   updateFloat(iPlay);  stopKarTick(); }

  /* ── Karaoke panel ── */
  function createKaraoke() {
    if (karPanel) return;
    karPanel = document.createElement('div');
    karPanel.id = 'tts-kar';
    karPanel.setAttribute('aria-hidden', 'true');
    karPanel.innerHTML =
      '<div id="tts-kar-prog"><div id="tts-kar-bar"></div></div>' +
      '<div id="tts-kar-words"></div>';
    document.body.appendChild(karPanel);
    floatBottom();
  }

  function removeKaraoke() {
    stopKarTick();
    if (karPanel) { karPanel.remove(); karPanel = null; }
    karWords = []; karIdx = -1;
    floatBottom();
  }

  function setKarChunk(text) {
    if (!karPanel) return;
    var wordsEl = document.getElementById('tts-kar-words');
    if (!wordsEl) return;
    var raw = text.trim().split(/\s+/);
    wordsEl.innerHTML = raw.map(function(w) {
      return '<span class="tw">' + w.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</span>';
    }).join(' ');
    karWords = Array.from(wordsEl.querySelectorAll('.tw'));
    karIdx   = -1;
  }

  function karTick() {
    if (!currentAudio || !karWords.length) return;
    var t = currentAudio.currentTime;
    var d = currentAudio.duration;

    if (d && d > 0) {
      var progress = t / d;
      var idx = Math.min(Math.floor(progress * karWords.length), karWords.length - 1);

      if (idx !== karIdx) {
        if (karIdx >= 0 && karWords[karIdx]) karWords[karIdx].classList.remove('cur');
        if (karWords[idx]) karWords[idx].classList.add('cur');
        karIdx = idx;
      }

      var bar = document.getElementById('tts-kar-bar');
      if (bar) {
        var globalProgress = totalChunks > 0
          ? ((chunkIndex + progress) / totalChunks) * 100
          : progress * 100;
        bar.style.width = globalProgress.toFixed(1) + '%';
      }
    }

    if (state === 'speaking') rafId = requestAnimationFrame(karTick);
  }

  function startKarTick() {
    stopKarTick();
    rafId = requestAnimationFrame(karTick);
  }

  function stopKarTick() {
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
  }

  /* ── Extract readable text ── */
  function getPageText() {
    var title = (document.title || '').split('|')[0].trim();
    var clone = document.body.cloneNode(true);
    clone.querySelectorAll(
      'script,style,noscript,nav,footer,header,[aria-hidden="true"],' +
      '[data-tts-btn],#tts-float,#toasty-btn,#toasty-win,#btt-btn,' +
      '#mobile-menu,#search-dropdown,#mobile-search-dropdown,.sr-only,#tts-live,#tts-kar'
    ).forEach(function(el){ el.remove(); });
    var body = (clone.innerText || '').replace(/\s+/g, ' ').trim();
    return 'Bună ziua! Citesc pagina ' + title + '. ' + body + ' Acesta este sfârșitul paginii. Vă mulțumesc că ați ascultat.';
  }

  /* ── Split chunks ── */
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
    var lang = localStorage.getItem('tmt_lang') || 'ro';
    return fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text, lang: lang })
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
      currentAudio.onended  = resolve;
      currentAudio.onerror  = resolve;
      currentAudio.play().catch(resolve);
    });
  }

  async function runQueue(chunks) {
    aborted      = false;
    totalChunks  = chunks.length;
    chunkIndex   = 0;

    createKaraoke();
    announce('Se încarcă audio, vă rugăm așteptați.');
    var nextFetch = fetchChunk(chunks[0]);

    for (var i = 0; i < chunks.length; i++) {
      if (aborted) break;
      if (i === 0) setLoading();

      chunkIndex = i;

      var url;
      try { url = await nextFetch; }
      catch(e) { announce('Eroare la încărcarea audio. Verificați conexiunea.'); setIdle(); return; }

      if (aborted) { URL.revokeObjectURL(url); break; }
      if (i + 1 < chunks.length) nextFetch = fetchChunk(chunks[i + 1]);

      setKarChunk(chunks[i]);
      setSpeaking();
      if (i === 0) announce('Citire pornită. Apăsați butonul pentru pauză.');
      await playUrl(url);
      URL.revokeObjectURL(url);
    }

    if (!aborted) { announce('Citirea paginii s-a terminat.'); setIdle(); }
  }

  /* ── Navbar button ── */
  function toggleNav() {
    if (state === 'idle') {
      createFloat();
      setNavActive(true);
      runQueue(splitChunks(getPageText()));
    } else {
      aborted = true;
      if (currentAudio) currentAudio.pause();
      announce('Citire anulată.');
      setIdle();
    }
  }

  /* ── Float button ── */
  function toggleFloat() {
    if (state === 'loading') {
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

  /* ── Wire buttons ── */
  function wireButtons() {
    document.querySelectorAll('[data-tts-btn]').forEach(function(b) {
      b.addEventListener('click', toggleNav);
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireButtons);
  } else {
    wireButtons();
  }

  /* ── Alt+T shortcut ── */
  document.addEventListener('keydown', function(e) {
    if (e.altKey && (e.key === 't' || e.key === 'T')) { e.preventDefault(); toggleNav(); }
  });

  window.addEventListener('beforeunload', function() {
    aborted = true;
    if (currentAudio) currentAudio.pause();
  });

})();
