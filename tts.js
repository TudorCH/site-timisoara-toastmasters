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

    /* panel */
    '#tts-kar{position:fixed;bottom:0;left:0;right:0;z-index:9990;' +
      'background:rgba(0,24,38,.96);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);' +
      'color:rgba(255,255,255,.82);border-top:1px solid rgba(242,223,116,.18);' +
      'transition:opacity .3s;}',
    '#tts-kar-close{position:absolute;top:.3rem;right:.45rem;z-index:2;' +
      'background:rgba(255,255,255,.1)!important;border:1px solid rgba(255,255,255,.15)!important;color:rgba(255,255,255,.6)!important;' +
      'font-size:.75rem;width:1.6rem;height:1.6rem;border-radius:9999px;cursor:pointer;display:flex;align-items:center;justify-content:center;' +
      'transition:background .15s,color .15s;}',
    '#tts-kar-close:hover{background:rgba(255,255,255,.22)!important;color:#fff!important;}',
    '#tts-kar-prog{height:3px;background:rgba(255,255,255,.1);}',
    '#tts-kar-bar{height:100%;background:#F2DF74;width:0%;transition:width .35s linear;}',

    /* full text (desktop) */
    '#tts-kar-text{padding:.6rem 1rem .3rem;font-size:.8rem;line-height:1.75;word-break:break-word;min-height:2.8rem;}',

    /* sentence (mobile only — hidden on desktop) */
    '#tts-kar-sentence{display:none;padding:.45rem .85rem .2rem;font-size:.78rem;line-height:1.6;word-break:break-word;}',

    /* word spans */
    '#tts-kar .tw{display:inline;border-radius:3px;padding:0 1px;transition:background .08s,color .08s;}',
    '#tts-kar .tw.cur{background:rgba(242,223,116,.3);color:#F2DF74;font-weight:600;}',

    /* auto-collapse state — hide text on desktop after timeout */
    '#tts-kar.kar-min #tts-kar-text{display:none;}',

    /* controls */
    '#tts-kar-ctrl{display:flex;align-items:center;justify-content:center;gap:.35rem;padding:.3rem .75rem .6rem;position:relative;}',
    '#tts-kar-ctrl button{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);color:rgba(255,255,255,.75);' +
      'border-radius:9999px;cursor:pointer;display:flex;align-items:center;justify-content:center;' +
      'transition:background .15s,color .15s;}',
    '#tts-kar-ctrl button:hover{background:rgba(255,255,255,.18);color:#fff;}',
    '#tts-kar-ctrl .kc-sm{width:2rem;height:2rem;}',
    '#tts-kar-ctrl .kc-md{width:2.4rem;height:2.4rem;}',
    '#tts-kar-ctrl .kc-pp{width:2.6rem;height:2.6rem;background:rgba(242,223,116,.15)!important;border-color:rgba(242,223,116,.35)!important;color:#F2DF74!important;}',
    '#tts-kar-ctrl .kc-pp:hover{background:rgba(242,223,116,.28)!important;}',
    '#tts-kar-ctrl .kc-spd{font-size:.6rem;font-weight:700;letter-spacing:-.3px;min-width:2.2rem;padding:0 .3rem;}',
    '#tts-kar-chunk{position:absolute;left:.75rem;top:50%;transform:translateY(-50%);' +
      'font-size:.65rem;color:rgba(255,255,255,.35);letter-spacing:.03em;pointer-events:none;}',

    /* mobile: hide full text, show sentence, smaller controls */
    '@media(max-width:639px){' +
      '#tts-kar-text{display:none!important;}' +
      '#tts-kar-sentence{display:block;}' +
      '#tts-kar-close{top:.25rem;right:.35rem;width:1.4rem;height:1.4rem;font-size:.65rem;}' +
      '#tts-kar-ctrl{gap:.25rem;padding:.25rem .5rem .4rem;}' +
      '#tts-kar-ctrl .kc-sm{width:1.75rem;height:1.75rem;}' +
      '#tts-kar-ctrl .kc-md{width:2rem;height:2rem;}' +
      '#tts-kar-ctrl .kc-pp{width:2.25rem;height:2.25rem;}' +
      '#tts-kar-chunk{font-size:.58rem;}' +
    '}'
  ].join('');
  document.head.appendChild(css);

  /* ── Icons ── */
  var iPause = '<svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>';
  var iPlay  = '<svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
  var iLoad  = '<svg class="tts-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 2a10 10 0 0 1 10 10" opacity=".9"/><path d="M12 2a10 10 0 0 0-10 10" opacity=".3"/></svg>';
  var iPrev  = '<svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><polygon points="19 20 9 12 19 4 19 20"/><rect x="5" y="4" width="3" height="16" rx="1"/></svg>';
  var iNext  = '<svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><polygon points="5 4 15 12 5 20 5 4"/><rect x="16" y="4" width="3" height="16" rx="1"/></svg>';

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

  /* ── Queue ── */
  var allChunks   = [];
  var totalChunks = 0;
  var chunkIndex  = 0;
  var skipCmd     = 'none';

  /* ── Karaoke ── */
  var karPanel    = null;
  var karWords    = [];
  var karWeights  = [];
  var karSentences = [];  // [{start, end}] word index ranges per sentence
  var karRawWords  = [];  // raw word strings for sentence rebuild
  var karIdx      = -1;
  var karSentIdx  = -1;
  var rafId       = null;
  var collapseTimer = null;
  var START_OFFSET  = 0.20;
  var karSpeed      = parseFloat(localStorage.getItem('tts_spd') || '1');

  /* ── Float button ── */
  var floatBtn = null;

  function floatBottom() {
    if (!floatBtn) return;
    if (!karPanel) { floatBtn.style.bottom = '1.5rem'; return; }
    floatBtn.style.bottom = window.innerWidth < 640 ? '4.5rem' : '7.5rem';
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

  /* ── Auto-collapse (desktop only) ── */
  function scheduleCollapse() {
    if (window.innerWidth < 640) return;
    clearTimeout(collapseTimer);
    collapseTimer = setTimeout(function() {
      if (karPanel) karPanel.classList.add('kar-min');
    }, 5000);
  }

  function cancelCollapse() {
    clearTimeout(collapseTimer);
    if (karPanel) karPanel.classList.remove('kar-min');
    scheduleCollapse();
  }

  function setIdle() {
    state = 'idle';
    clearTimeout(collapseTimer);
    setNavActive(false);
    removeFloat();
    removeKaraoke();
  }
  function setLoading()  { state = 'loading'; updateFloat(iLoad, 'tts-loading'); }
  function setSpeaking() {
    state = 'speaking';
    updateFloat(iPause, 'tts-speaking');
    updateKarCtrlPP(true);
    startKarTick();
    scheduleCollapse();
  }
  function setPaused() {
    state = 'paused';
    updateFloat(iPlay);
    updateKarCtrlPP(false);
    stopKarTick();
    clearTimeout(collapseTimer);
    if (karPanel) karPanel.classList.remove('kar-min');
  }

  /* ── Karaoke panel ── */
  function createKaraoke() {
    if (karPanel) return;
    karPanel = document.createElement('div');
    karPanel.id = 'tts-kar';
    karPanel.setAttribute('aria-hidden', 'true');
    karPanel.innerHTML =
      '<button id="tts-kar-close" aria-label="Oprește citirea">✕</button>' +
      '<div id="tts-kar-prog"><div id="tts-kar-bar"></div></div>' +
      '<div id="tts-kar-sentence"></div>' +
      '<div id="tts-kar-text"></div>' +
      '<div id="tts-kar-ctrl">' +
        '<span id="tts-kar-chunk"></span>' +
        '<button class="kc-sm" id="kc-prev" aria-label="Secțiune anterioară">' + iPrev + '</button>' +
        '<button class="kc-sm" id="kc-rew"  aria-label="Înapoi 10 secunde"><span style="font-size:.6rem;font-weight:700;letter-spacing:-.5px">-10s</span></button>' +
        '<button class="kc-pp kc-md" id="kc-pp" aria-label="Pauză">' + iPause + '</button>' +
        '<button class="kc-sm" id="kc-fwd"  aria-label="Înainte 10 secunde"><span style="font-size:.6rem;font-weight:700;letter-spacing:-.5px">+10s</span></button>' +
        '<button class="kc-sm" id="kc-next" aria-label="Secțiune următoare">' + iNext + '</button>' +
        '<button class="kc-sm kc-spd" id="kc-spd" aria-label="Viteză redare">' + karSpeed + '×</button>' +
      '</div>';

    document.body.appendChild(karPanel);

    /* ── control listeners ── */
    document.getElementById('kc-pp').addEventListener('click', toggleFloat);

    document.getElementById('kc-rew').addEventListener('click', function() {
      if (currentAudio) currentAudio.currentTime = Math.max(0, currentAudio.currentTime - 10);
      cancelCollapse();
    });
    document.getElementById('kc-fwd').addEventListener('click', function() {
      if (currentAudio) {
        var d = currentAudio.duration;
        if (d && currentAudio.currentTime + 10 < d) currentAudio.currentTime += 10;
        else triggerSkip('next');
      }
      cancelCollapse();
    });
    document.getElementById('kc-prev').addEventListener('click', function() {
      if (currentAudio && currentAudio.currentTime > 3) currentAudio.currentTime = 0;
      else triggerSkip('prev');
      cancelCollapse();
    });
    document.getElementById('kc-next').addEventListener('click', function() {
      triggerSkip('next');
      cancelCollapse();
    });
    document.getElementById('kc-spd').addEventListener('click', function() {
      karSpeed = karSpeed === 1 ? 1.25 : karSpeed === 1.25 ? 0.75 : 1;
      if (currentAudio) currentAudio.playbackRate = karSpeed;
      this.textContent = karSpeed + '×';
      localStorage.setItem('tts_spd', karSpeed);
      cancelCollapse();
    });
    document.getElementById('tts-kar-close').addEventListener('click', function() {
      aborted = true;
      if (currentAudio) currentAudio.pause();
      announce('Citire anulată.');
      setIdle();
    });

    /* ── swipe gestures (mobile) ── */
    var swipeX = 0, swipeY = 0;
    karPanel.addEventListener('touchstart', function(e) {
      swipeX = e.touches[0].clientX;
      swipeY = e.touches[0].clientY;
    }, { passive: true });
    karPanel.addEventListener('touchend', function(e) {
      var dx = e.changedTouches[0].clientX - swipeX;
      var dy = e.changedTouches[0].clientY - swipeY;
      if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      if (dx < 0) { /* swipe left = forward 10s */
        if (currentAudio) {
          var d = currentAudio.duration;
          if (d && currentAudio.currentTime + 10 < d) currentAudio.currentTime += 10;
          else triggerSkip('next');
        }
      } else { /* swipe right = back 10s */
        if (currentAudio) currentAudio.currentTime = Math.max(0, currentAudio.currentTime - 10);
      }
    }, { passive: true });

    /* reset collapse timer on any interaction */
    karPanel.addEventListener('touchstart', cancelCollapse, { passive: true });
    karPanel.addEventListener('mousedown', cancelCollapse);

    /* lift Toasty above bar */
    var tb = document.getElementById('toasty-btn');
    if (tb) tb.style.setProperty('bottom', window.innerWidth < 640 ? '4.5rem' : '8rem', 'important');

    floatBottom();
  }

  function removeKaraoke() {
    clearTimeout(collapseTimer);
    stopKarTick();
    if (karPanel) { karPanel.remove(); karPanel = null; }
    karWords = []; karWeights = []; karSentences = []; karRawWords = [];
    karIdx = -1; karSentIdx = -1;
    var tb = document.getElementById('toasty-btn');
    if (tb) tb.style.removeProperty('bottom');
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

  /* ── Build char-weighted fractions per word ── */
  function buildWeights(words) {
    var total = words.reduce(function(s, w) { return s + w.length + 1; }, 0);
    var cum = 0;
    return words.map(function(w) {
      var f = cum / total;
      cum += w.length + 1;
      return f;
    });
  }

  /* ── Build sentence ranges from word array ── */
  function buildSentences(words) {
    var sents = [];
    var start = 0;
    words.forEach(function(w, i) {
      if (/[.!?]$/.test(w) || i === words.length - 1) {
        sents.push({ start: start, end: i });
        start = i + 1;
      }
    });
    if (start <= words.length - 1) sents.push({ start: start, end: words.length - 1 });
    return sents;
  }

  function esc(w) { return w.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  /* ── Render sentence div (mobile) with highlight spans ── */
  function renderSentence(sentIdx, highlightWordIdx) {
    var sentEl = document.getElementById('tts-kar-sentence');
    if (!sentEl || !karSentences.length) return;
    var sent = karSentences[sentIdx];
    if (!sent) return;
    sentEl.innerHTML = karRawWords.slice(sent.start, sent.end + 1).map(function(w, i) {
      var gi = sent.start + i;
      return '<span class="tw' + (gi === highlightWordIdx ? ' cur' : '') + '" data-i="' + gi + '">' + esc(w) + '</span>';
    }).join(' ');
  }

  /* ── Update only the highlight within the sentence div ── */
  function updateSentenceHighlight(wordIdx) {
    var sentEl = document.getElementById('tts-kar-sentence');
    if (!sentEl) return;
    sentEl.querySelectorAll('.tw').forEach(function(sp) {
      sp.classList.toggle('cur', parseInt(sp.getAttribute('data-i')) === wordIdx);
    });
  }

  function setKarChunk(text) {
    if (!karPanel) return;
    var wordsEl = document.getElementById('tts-kar-text');
    if (!wordsEl) return;
    var raw = text.trim().split(/\s+/);
    wordsEl.innerHTML = raw.map(function(w) {
      return '<span class="tw">' + esc(w) + '</span>';
    }).join(' ');
    karWords      = Array.from(wordsEl.querySelectorAll('.tw'));
    karWeights    = buildWeights(raw);
    karSentences  = buildSentences(raw);
    karRawWords   = raw;
    karIdx        = -1;
    karSentIdx    = -1;

    /* init mobile sentence display */
    if (karSentences.length) renderSentence(0, -1);

    updateKarChunkLabel();
  }

  /* ── Animation tick ── */
  function karTick() {
    if (!currentAudio || !karWords.length) return;
    var t = Math.max(0, currentAudio.currentTime - START_OFFSET);
    var d = currentAudio.duration;

    if (d && d > 0) {
      var progress = Math.min(t / (d - START_OFFSET), 1);

      var idx = 0;
      for (var k = 0; k < karWeights.length; k++) {
        if (karWeights[k] <= progress) idx = k;
        else break;
      }

      if (idx !== karIdx) {
        /* update full-text highlight */
        if (karIdx >= 0 && karWords[karIdx]) karWords[karIdx].classList.remove('cur');
        if (karWords[idx]) karWords[idx].classList.add('cur');
        karIdx = idx;

        /* update sentence display (mobile) */
        var newSentIdx = 0;
        for (var s = 0; s < karSentences.length; s++) {
          if (karSentences[s].start <= idx) newSentIdx = s;
          else break;
        }
        if (newSentIdx !== karSentIdx) {
          karSentIdx = newSentIdx;
          renderSentence(newSentIdx, idx);
        } else {
          updateSentenceHighlight(idx);
        }
      }

      /* progress bar */
      var bar = document.getElementById('tts-kar-bar');
      if (bar) {
        var glob = totalChunks > 0 ? ((chunkIndex + progress) / totalChunks) * 100 : progress * 100;
        bar.style.width = glob.toFixed(1) + '%';
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
    }).then(function(blob) { return URL.createObjectURL(blob); });
  }

  function playUrl(url) {
    return new Promise(function(resolve) {
      currentAudio = new Audio(url);
      currentAudio.playbackRate = karSpeed;
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
      prefetch = (i + 1 < chunks.length) ? fetchChunk(chunks[i + 1]) : Promise.resolve(null);

      setKarChunk(chunks[i]);
      setSpeaking();
      if (i === 0) announce('Citire pornită. Apăsați butonul pentru pauză.');

      await playUrl(url);
      URL.revokeObjectURL(url);

      if (!aborted) {
        var cmd = skipCmd; skipCmd = 'none';
        if (cmd === 'next') {
          i = Math.min(i + 1, chunks.length - 1);
          if (i < chunks.length) prefetch = fetchChunk(chunks[i]);
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
      aborted = true; announce('Citire anulată.'); setIdle();
    } else if (state === 'speaking') {
      if (currentAudio) currentAudio.pause();
      announce('Pauză.'); setPaused();
    } else if (state === 'paused') {
      if (currentAudio) currentAudio.play();
      announce('Continuă citirea.'); setSpeaking();
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

  /* ── Keyboard shortcuts ── */
  document.addEventListener('keydown', function(e) {
    if (e.altKey && (e.key === 't' || e.key === 'T')) { e.preventDefault(); toggleNav(); return; }
    if (state === 'idle') return;
    var tag = (document.activeElement || {}).tagName || '';
    if (['INPUT','TEXTAREA','SELECT','BUTTON'].includes(tag)) return;
    if (e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault(); toggleFloat();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (currentAudio) currentAudio.currentTime = Math.max(0, currentAudio.currentTime - 10);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (currentAudio) {
        var d = currentAudio.duration;
        if (d && currentAudio.currentTime + 10 < d) currentAudio.currentTime += 10;
        else triggerSkip('next');
      }
    }
  });

  window.addEventListener('beforeunload', function() {
    aborted = true;
    if (currentAudio) currentAudio.pause();
  });

})();
