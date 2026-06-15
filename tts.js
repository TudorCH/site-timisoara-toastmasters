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
      'background:rgba(0,24,38,.96);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);' +
      'color:rgba(255,255,255,.82);' +
      'border-top:1px solid rgba(242,223,116,.18);' +
      'transition:opacity .3s;}',
    '#tts-kar-prog{height:3px;background:rgba(255,255,255,.1);}',
    '#tts-kar-bar{height:100%;background:#F2DF74;width:0%;transition:width .35s linear;}',
    '#tts-kar-text{padding:.6rem 1rem .3rem;font-size:.8rem;line-height:1.75;word-break:break-word;min-height:2.8rem;}',
    '#tts-kar .tw{display:inline;border-radius:3px;padding:0 1px;transition:background .08s,color .08s;}',
    '#tts-kar .tw.cur{background:rgba(242,223,116,.3);color:#F2DF74;font-weight:600;}',

    /* controls row */
    '#tts-kar-ctrl{display:flex;align-items:center;justify-content:center;gap:.35rem;padding:.3rem .75rem .6rem;position:relative;}',
    '#tts-kar-ctrl button{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);color:rgba(255,255,255,.75);' +
      'border-radius:9999px;cursor:pointer;display:flex;align-items:center;justify-content:center;' +
      'transition:background .15s,color .15s;}',
    '#tts-kar-ctrl button:hover{background:rgba(255,255,255,.18);color:#fff;}',
    '#tts-kar-ctrl .kc-sm{width:2rem;height:2rem;}',
    '#tts-kar-ctrl .kc-md{width:2.4rem;height:2.4rem;font-size:.95rem;}',
    '#tts-kar-ctrl .kc-pp{width:2.6rem;height:2.6rem;background:rgba(242,223,116,.15)!important;border-color:rgba(242,223,116,.35)!important;color:#F2DF74!important;}',
    '#tts-kar-ctrl .kc-pp:hover{background:rgba(242,223,116,.28)!important;}',
    '#tts-kar-close{position:absolute;right:.6rem;top:50%;transform:translateY(-50%);' +
      'background:none!important;border:none!important;color:rgba(255,255,255,.35)!important;' +
      'font-size:1.1rem;width:1.8rem;height:1.8rem;cursor:pointer;display:flex;align-items:center;justify-content:center;}',
    '#tts-kar-close:hover{color:rgba(255,255,255,.7)!important;}',
    '#tts-kar-chunk{position:absolute;left:.75rem;top:50%;transform:translateY(-50%);' +
      'font-size:.65rem;color:rgba(255,255,255,.35);letter-spacing:.03em;pointer-events:none;}'
  ].join('');
  document.head.appendChild(css);

  /* ── Icons ── */
  var iPause = '<svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>';
  var iPlay  = '<svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
  var iLoad  = '<svg class="tts-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 2a10 10 0 0 1 10 10" opacity=".9"/><path d="M12 2a10 10 0 0 0-10 10" opacity=".3"/></svg>';
  var iPrev  = '<svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><polygon points="19 20 9 12 19 4 19 20"/><rect x="5" y="4" width="3" height="16" rx="1"/></svg>';
  var iNext  = '<svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><polygon points="5 4 15 12 5 20 5 4"/><rect x="16" y="4" width="3" height="16" rx="1"/></svg>';
  var iRew   = '<svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><polygon points="13 19 2 12 13 5 13 19"/><polygon points="22 19 11 12 22 5 22 19"/></svg>';
  var iFwd   = '<svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><polygon points="11 5 22 12 11 19 11 5"/><polygon points="2 5 13 12 2 19 2 5"/></svg>';
  var iClose = '✕';

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

  /* ── Queue state ── */
  var allChunks   = [];
  var totalChunks = 0;
  var chunkIndex  = 0;
  /* 'none'|'next'|'prev'|'restart' — resolved after playUrl resolves */
  var skipCmd = 'none';

  /* ── Karaoke state ── */
  var karPanel   = null;
  var karWords   = [];
  var karWeights = []; // cumulative char-fraction per word (0..1)
  var karIdx     = -1;
  var rafId      = null;
  /* small start offset: first ~0.25 s is usually silence/envelope */
  var START_OFFSET = 0.22;

  /* ── Float button ── */
  var floatBtn = null;

  function floatBottom() {
    if (!floatBtn) return;
    floatBtn.style.bottom = karPanel ? '7.5rem' : '1.5rem';
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
  function setSpeaking() {
    state = 'speaking';
    updateFloat(iPause, 'tts-speaking');
    updateKarCtrlPP(true);
    startKarTick();
  }
  function setPaused() {
    state = 'paused';
    updateFloat(iPlay);
    updateKarCtrlPP(false);
    stopKarTick();
  }

  /* ── Karaoke panel ── */
  function createKaraoke() {
    if (karPanel) return;
    karPanel = document.createElement('div');
    karPanel.id = 'tts-kar';
    karPanel.setAttribute('aria-hidden', 'true');
    karPanel.innerHTML =
      '<div id="tts-kar-prog"><div id="tts-kar-bar"></div></div>' +
      '<div id="tts-kar-text"></div>' +
      '<div id="tts-kar-ctrl">' +
        '<span id="tts-kar-chunk"></span>' +
        '<button class="kc-sm" id="kc-prev" title="Chunk anterior" aria-label="Secțiune anterioară">' + iPrev + '</button>' +
        '<button class="kc-sm" id="kc-rew"  title="-10s" aria-label="Înapoi 10 secunde"><span style="font-size:.6rem;font-weight:700;letter-spacing:-.5px">-10s</span></button>' +
        '<button class="kc-pp kc-md" id="kc-pp" aria-label="Pauză">' + iPause + '</button>' +
        '<button class="kc-sm" id="kc-fwd"  title="+10s" aria-label="Înainte 10 secunde"><span style="font-size:.6rem;font-weight:700;letter-spacing:-.5px">+10s</span></button>' +
        '<button class="kc-sm" id="kc-next" title="Chunk următor" aria-label="Secțiune următoare">' + iNext + '</button>' +
        '<button id="tts-kar-close" aria-label="Oprește citirea">' + iClose + '</button>' +
      '</div>';

    document.body.appendChild(karPanel);

    document.getElementById('kc-pp').addEventListener('click', toggleFloat);
    document.getElementById('kc-rew').addEventListener('click', function() {
      if (currentAudio) currentAudio.currentTime = Math.max(0, currentAudio.currentTime - 10);
    });
    document.getElementById('kc-fwd').addEventListener('click', function() {
      if (currentAudio) {
        var d = currentAudio.duration;
        if (d && currentAudio.currentTime + 10 < d) {
          currentAudio.currentTime += 10;
        } else {
          triggerSkip('next');
        }
      }
    });
    document.getElementById('kc-prev').addEventListener('click', function() {
      if (currentAudio && currentAudio.currentTime > 3) {
        currentAudio.currentTime = 0;
      } else {
        triggerSkip('prev');
      }
    });
    document.getElementById('kc-next').addEventListener('click', function() { triggerSkip('next'); });
    document.getElementById('tts-kar-close').addEventListener('click', function() {
      aborted = true;
      if (currentAudio) currentAudio.pause();
      announce('Citire anulată.');
      setIdle();
    });

    floatBottom();
  }

  function removeKaraoke() {
    stopKarTick();
    if (karPanel) { karPanel.remove(); karPanel = null; }
    karWords = []; karWeights = []; karIdx = -1;
    floatBottom();
  }

  function triggerSkip(dir) {
    skipCmd = dir;
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.dispatchEvent(new Event('ended'));
    }
  }

  function updateKarCtrlPP(speaking) {
    var btn = document.getElementById('kc-pp');
    if (!btn) return;
    btn.innerHTML = speaking ? iPause : iPlay;
    btn.setAttribute('aria-label', speaking ? 'Pauză' : 'Continuă');
  }

  function updateKarChunkLabel() {
    var el = document.getElementById('tts-kar-chunk');
    if (el) el.textContent = (chunkIndex + 1) + ' / ' + totalChunks;
  }

  /* ── Word weights (char-length-based for realistic timing) ── */
  function buildWeights(words) {
    var total = words.reduce(function(s, w) { return s + w.length + 1; }, 0);
    var cum = 0;
    return words.map(function(w) {
      var f = cum / total;
      cum += w.length + 1;
      return f;
    });
  }

  function setKarChunk(text) {
    if (!karPanel) return;
    var wordsEl = document.getElementById('tts-kar-text');
    if (!wordsEl) return;
    var raw = text.trim().split(/\s+/);
    wordsEl.innerHTML = raw.map(function(w) {
      return '<span class="tw">' + w.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</span>';
    }).join(' ');
    karWords   = Array.from(wordsEl.querySelectorAll('.tw'));
    karWeights = buildWeights(raw);
    karIdx     = -1;
    updateKarChunkLabel();
  }

  /* ── Animation tick (char-weighted estimation) ── */
  function karTick() {
    if (!currentAudio || !karWords.length) return;
    var t = Math.max(0, currentAudio.currentTime - START_OFFSET);
    var d = currentAudio.duration;

    if (d && d > 0) {
      var progress = Math.min(t / (d - START_OFFSET), 1);

      /* find last word whose cumulative fraction <= progress */
      var idx = 0;
      for (var k = 0; k < karWeights.length; k++) {
        if (karWeights[k] <= progress) idx = k;
        else break;
      }

      if (idx !== karIdx) {
        if (karIdx >= 0 && karWords[karIdx]) karWords[karIdx].classList.remove('cur');
        if (karWords[idx]) karWords[idx].classList.add('cur');
        karIdx = idx;
      }

      /* global progress bar */
      var bar = document.getElementById('tts-kar-bar');
      if (bar) {
        var global = totalChunks > 0
          ? ((chunkIndex + progress) / totalChunks) * 100
          : progress * 100;
        bar.style.width = global.toFixed(1) + '%';
      }
    }

    if (state === 'speaking') rafId = requestAnimationFrame(karTick);
  }

  function startKarTick() { stopKarTick(); rafId = requestAnimationFrame(karTick); }
  function stopKarTick()  { if (rafId) { cancelAnimationFrame(rafId); rafId = null; } }

  /* ── Text extraction ── */
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

  /* ── Chunk splitter ── */
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
      currentAudio.onended = resolve;
      currentAudio.onerror = resolve;
      currentAudio.play().catch(resolve);
    });
  }

  async function runQueue(chunks) {
    aborted     = false;
    skipCmd     = 'none';
    allChunks   = chunks;
    totalChunks = chunks.length;
    chunkIndex  = 0;

    createKaraoke();
    announce('Se încarcă audio, vă rugăm așteptați.');

    var prefetch = fetchChunk(chunks[0]);

    var i = 0;
    while (i < chunks.length) {
      if (aborted) break;
      if (i === 0) setLoading();

      chunkIndex = i;

      var url;
      try { url = await prefetch; }
      catch(e) { announce('Eroare la încărcarea audio. Verificați conexiunea.'); setIdle(); return; }

      if (aborted) { URL.revokeObjectURL(url); break; }

      /* prefetch next while current plays */
      prefetch = (i + 1 < chunks.length) ? fetchChunk(chunks[i + 1]) : Promise.resolve(null);

      setKarChunk(chunks[i]);
      setSpeaking();
      if (i === 0) announce('Citire pornită. Apăsați butonul pentru pauză.');

      await playUrl(url);
      URL.revokeObjectURL(url);

      /* handle skip commands */
      if (!aborted) {
        var cmd = skipCmd;
        skipCmd = 'none';
        if (cmd === 'next') {
          i = Math.min(i + 1, chunks.length - 1);
          if (i + 1 < chunks.length) prefetch = fetchChunk(chunks[i]);
          else { setIdle(); return; }
        } else if (cmd === 'prev') {
          i = Math.max(0, i - 1);
          prefetch = fetchChunk(chunks[i]);
        } else {
          i++;
        }
      }
    }

    if (!aborted) { announce('Citirea paginii s-a terminat.'); setIdle(); }
  }

  /* ── Navbar toggle ── */
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

  /* ── Float toggle ── */
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

  /* ── Wire navbar buttons ── */
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
