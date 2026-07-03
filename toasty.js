/* ════════════════════════════════════════════════
   TOASTY — Timișoara Toastmasters
   Culori site: #00537f · #004165 · #002d47
   Desktop: popup floating above FAB
   ════════════════════════════════════════════════ */
(function () {

  var NAV_H = 72;

  /* ── CSS ── */
  var style = document.createElement('style');
  style.textContent = [
    '@keyframes tyDot{0%,80%,100%{transform:scale(.6);opacity:.35}40%{transform:scale(1);opacity:1}}',
    '@media(prefers-reduced-motion:reduce){.ty-dot{animation:none!important;opacity:.55;}}',

    /* Overlay */
    '#ty-ov{position:fixed;inset:0;background:rgba(0,21,42,.45);z-index:2147483645;',
    'opacity:0;pointer-events:none;transition:opacity .25s;}',
    '#ty-ov.on{opacity:1;pointer-events:auto;}',
    '@media(min-width:768px){#ty-ov{top:' + NAV_H + 'px;}}',

    /* FAB */
    '#ty-fab{all:unset;position:fixed!important;bottom:20px!important;right:16px!important;',
    'z-index:2147483647!important;width:52px;height:52px;border-radius:50%;cursor:pointer;',
    'background:#002d47;touch-action:manipulation;',
    'box-shadow:0 4px 16px rgba(0,45,71,.55),0 1px 0 rgba(255,255,255,.07) inset;',
    'display:flex!important;align-items:center;justify-content:center;',
    'transition:transform .2s,box-shadow .2s,opacity .2s,visibility .2s;}',
    '#ty-fab:hover{transform:scale(1.09);background:#004165;box-shadow:0 6px 24px rgba(0,65,101,.6);}',
    '#ty-fab:focus-visible{outline:3px solid #00537f;outline-offset:3px;}',
    '#ty-fab.gone,#ty-fab.no-footer{opacity:0!important;visibility:hidden!important;pointer-events:none!important;}',
    '@media(min-width:640px){#ty-fab{bottom:28px!important;right:28px!important;width:56px;height:56px;}}',

    /* Panel — fix 1: visible diagonal gradient instead of invisible blobs */
    '#ty-win{position:fixed!important;top:0!important;right:0!important;',
    'height:100%;height:100dvh;width:380px;max-width:100vw;',
    'background:linear-gradient(155deg,#ddeef8 0%,#eaf4fb 28%,#f4f9fd 60%,#ffffff 100%);',
    'border:1.5px solid rgba(0,83,127,.45);border-radius:16px 0 0 16px;overflow:hidden;',
    'z-index:2147483646!important;display:flex;flex-direction:column;',
    'transform:translateX(100%);',
    'transition:transform .18s cubic-bezier(.4,0,1,1);',
    'box-shadow:-4px 0 32px rgba(0,21,42,.2);',
    'font-family:Inter,-apple-system,BlinkMacSystemFont,sans-serif;pointer-events:none;}',
    '#ty-win.on{transform:translateX(0);pointer-events:auto;transition:transform .3s cubic-bezier(.4,0,.2,1);}',

    /* Desktop popup */
    '@media(min-width:768px){',
    '#ty-win{',
    'top:auto!important;bottom:96px!important;right:28px!important;',
    'height:min(580px,calc(100dvh - 120px))!important;width:380px;max-width:calc(100vw - 56px);',
    'border-radius:16px;',
    'transform:scale(.92) translateY(16px)!important;opacity:0;',
    'transition:transform .18s ease-in,opacity .18s ease-in;',
    'box-shadow:0 8px 40px rgba(0,21,42,.22),0 0 0 1.5px rgba(0,83,127,.45);}',
    '#ty-win.on{transform:scale(1) translateY(0)!important;opacity:1;',
    'transition:transform .3s cubic-bezier(.34,1.3,.64,1),opacity .22s ease-out;}',
    '#ty-ov{background:transparent!important;}}',

    '@media(max-width:479px){#ty-win{width:100vw;border-radius:0;border-left:none;border-right:none;}}',

    /* fix 7: Close button — no fill circle, just icon + hover */
    '#ty-hdr-close{all:unset;width:44px;height:44px;border-radius:50%;',
    'display:flex;align-items:center;justify-content:center;',
    'cursor:pointer;flex-shrink:0;transition:background .15s;touch-action:manipulation;}',
    '#ty-hdr-close:hover{background:rgba(255,255,255,.18);}',
    '#ty-hdr-close:focus-visible{outline:2px solid rgba(255,255,255,.85);outline-offset:2px;}',

    /* Messages */
    '#ty-msgs{overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;',
    'padding:16px 14px;display:flex;flex-direction:column;gap:8px;flex:1;min-height:0;}',
    '#ty-msgs::-webkit-scrollbar{width:3px;}',
    '#ty-msgs::-webkit-scrollbar-track{background:transparent;}',
    '#ty-msgs::-webkit-scrollbar-thumb{background:rgba(0,45,71,.15);border-radius:99px;}',

    /* Chips */
    '.ty-chip{cursor:pointer;border:1.5px solid rgba(0,83,127,.2);border-radius:999px;',
    'padding:10px 16px;font-size:13px;color:#0f2942;background:rgba(255,255,255,.75);',
    'font-family:inherit;font-weight:500;min-height:44px;touch-action:manipulation;',
    'display:inline-flex;align-items:center;gap:6px;',
    'transition:border-color .15s,color .15s,background .15s,transform .1s,opacity .1s;white-space:nowrap;}',
    '.ty-chip:hover{border-color:#00537f;color:#00537f;background:rgba(255,255,255,.95);}',
    '.ty-chip:active{transform:scale(.96);opacity:.82;}',
    '.ty-chip:focus-visible{outline:2px solid #00537f;outline-offset:2px;}',

    /* Input */
    '#ty-inp{flex:1;border:1.5px solid rgba(255,255,255,.25);border-radius:12px;',
    'padding:12px 16px;font-size:16px;outline:none;',
    'font-family:inherit;color:#fff;background:rgba(255,255,255,.13);',
    'transition:border-color .15s,background .15s,box-shadow .15s;min-height:44px;}',
    '#ty-inp:focus{border-color:rgba(255,255,255,.55);background:rgba(255,255,255,.2);',
    'box-shadow:0 0 0 3px rgba(255,255,255,.1);}',
    '#ty-inp::placeholder{color:rgba(255,255,255,.5);}',

    /* fix 6: Send button circular (matches pill chips) */
    '#ty-send{all:unset;width:44px;height:44px;min-width:44px;border-radius:50%;',
    'background:rgba(255,255,255,.18);border:1.5px solid rgba(255,255,255,.25);',
    'display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;',
    'touch-action:manipulation;',
    'transition:background .15s,transform .1s,border-color .15s,opacity .2s;}',
    '#ty-send:hover{background:rgba(255,255,255,.28);border-color:rgba(255,255,255,.4);}',
    '#ty-send:active{transform:scale(.94);}',
    '#ty-send:focus-visible{outline:2px solid rgba(255,255,255,.8);outline-offset:2px;}',
    '#ty-send.loading{opacity:.4;pointer-events:none;cursor:not-allowed;}',

    /* Retry button inside error bubble */
    '.ty-retry{background:none;border:none;color:#00537f;font-weight:600;cursor:pointer;',
    'font-size:14px;padding:0;text-decoration:underline;font-family:inherit;',
    'touch-action:manipulation;}'
  ].join('');
  document.head.appendChild(style);

  /* ── Icons ── */
  /* Chat bubble — FAB only */
  function iconChat(size) {
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none"' +
      ' stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
  }

  /* fix 4: Microphone — header + bot message avatars (on-brand for public speaking) */
  function iconMic(size, color) {
    var c = color || 'white';
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none"' +
      ' stroke="' + c + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>' +
      '<path d="M19 10v2a7 7 0 0 1-14 0v-2"/>' +
      '<line x1="12" y1="19" x2="12" y2="22"/>' +
      '<line x1="8" y1="22" x2="16" y2="22"/></svg>';
  }

  /* ── Overlay ── */
  var ov = document.createElement('div');
  ov.id = 'ty-ov';
  document.body.appendChild(ov);

  /* ── FAB ── */
  var fab = document.createElement('button');
  fab.id = 'ty-fab';
  fab.setAttribute('aria-label', 'Deschide chat Toasty');
  fab.setAttribute('aria-controls', 'ty-win');
  fab.setAttribute('aria-expanded', 'false');
  fab.innerHTML = iconChat(24);
  document.body.appendChild(fab);

  /* ── Panel ── */
  var win = document.createElement('div');
  win.id = 'ty-win';
  win.setAttribute('role', 'dialog');
  win.setAttribute('aria-modal', 'true');
  win.setAttribute('aria-label', 'Chat Toasty');
  win.innerHTML = [

    /* Header — fix 4: mic icon in avatar, fix 7: plain close button */
    '<div style="background:linear-gradient(135deg,#00537f 0%,#004165 55%,#002d47 100%);',
    'padding:16px 18px;display:flex;align-items:center;gap:12px;flex-shrink:0;min-height:68px;">',

      '<div style="width:40px;height:40px;border-radius:11px;',
      'background:rgba(255,255,255,.15);border:1.5px solid rgba(255,255,255,.22);',
      'display:flex;align-items:center;justify-content:center;flex-shrink:0;">',
        iconMic(20),
      '</div>',

      '<div style="flex:1;min-width:0;">',
        '<div style="color:#fff;font-weight:700;font-size:15px;line-height:1.2;">Toasty</div>',
        '<div style="display:flex;align-items:center;gap:5px;margin-top:4px;">',
          '<span style="width:6px;height:6px;background:#4ade80;border-radius:50%;flex-shrink:0;"></span>',
          '<span style="color:rgba(255,255,255,.68);font-size:12px;font-weight:500;">Online · răspunde instant</span>',
        '</div>',
      '</div>',

      /* fix 7: plain icon only, hover reveals fill */
      '<button id="ty-hdr-close" onclick="toastyClose()" aria-label="Închide chat">',
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white"',
        ' stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
      '</button>',

    '</div>',

    '<div id="ty-msgs" role="log" aria-live="polite" aria-relevant="additions">',

      /* fix 4: mic avatar, fix 5: no emoji, fix 8: styled CTA question */
      '<div style="display:flex;gap:8px;align-items:flex-end;margin-top:4px;">',
        '<div style="width:28px;height:28px;border-radius:8px;background:#00537f;',
        'display:flex;align-items:center;justify-content:center;flex-shrink:0;">',
          iconMic(14),
        '</div>',
        '<div style="background:rgba(255,255,255,.88);border-radius:4px 16px 16px 16px;',
        'border:1px solid rgba(0,83,127,.1);',
        'padding:12px 15px;max-width:80%;font-size:14px;line-height:1.65;color:#0f2942;">',
          'Bună! Sunt <strong>Toasty</strong>, asistentul tău Toastmasters.',
          /* fix 8: CTA question visually distinct */
          '<div style="color:#3a6a85;font-size:13px;font-weight:500;margin-top:5px;">Cu ce te pot ajuta?</div>',
        '</div>',
      '</div>',

      /* fix 3: tighter top padding so chips feel attached to message */
      '<div id="ty-chips" style="display:flex;flex-direction:column;align-items:flex-start;gap:8px;padding:2px 0 4px 36px;">',
        '<button class="ty-chip" onclick="toastySend(\'Pot veni gratuit?\')">',
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/></svg>',
          'Pot veni gratuit?',
        '</button>',
        '<button class="ty-chip" onclick="toastySend(\'Când și unde sunt ședințele?\')">',
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
          'Când și unde sunt ședințele?',
        '</button>',
        '<button class="ty-chip" onclick="toastySend(\'Cât costă să devin membru?\')">',
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>',
          'Cât costă să devin membru?',
        '</button>',
      '</div>',

      /* fix 2: hint fills dead zone, disappears on first message */
      '<div id="ty-hint" style="flex:1;display:flex;align-items:flex-end;',
      'justify-content:center;padding-bottom:10px;pointer-events:none;">',
        '<span style="font-size:11.5px;color:rgba(0,65,101,.38);letter-spacing:.02em;',
        'font-weight:500;">Sau scrie direct mai jos</span>',
      '</div>',

    '</div>',

    /* fix 9: more descriptive placeholder, fix 6: send btn now circular via CSS */
    '<div style="padding:12px 14px max(16px,env(safe-area-inset-bottom));',
    'display:flex;gap:8px;align-items:center;',
    'flex-shrink:0;background:linear-gradient(135deg,#00537f 0%,#004165 55%,#002d47 100%);">',
      '<input id="ty-inp" type="text" placeholder="Întreabă despre ședințe, costuri..."',
      ' autocomplete="off" inputmode="text" aria-label="Mesajul tău"',
      ' onkeydown="if(event.key===\'Enter\'&&!event.shiftKey){event.preventDefault();toastySendInput();}">',
      '<button id="ty-send" onclick="toastySendInput()" aria-label="Trimite mesaj">',
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white"',
        ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round">',
        '<path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>',
      '</button>',
    '</div>'

  ].join('');
  document.body.appendChild(win);

  /* ── State ── */
  var isOpen = false, isLoading = false, history = [];
  var lastFocus = null;

  /* ── Helpers ── */
  function isMobile() { return window.innerWidth < 768; }

  /* ── Open / Close ── */
  window.toastyClose = function () {
    isOpen = false;
    fab.classList.remove('gone');
    win.classList.remove('on');
    ov.classList.remove('on');
    fab.setAttribute('aria-expanded', 'false');
    if (isMobile()) document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };

  fab.addEventListener('click', function () {
    lastFocus = document.activeElement;
    isOpen = true;
    fab.classList.add('gone');
    win.classList.add('on');
    ov.classList.add('on');
    fab.setAttribute('aria-expanded', 'true');
    if (isMobile()) document.body.style.overflow = 'hidden';
    setTimeout(function () {
      var inp = document.getElementById('ty-inp');
      if (inp) inp.focus();
    }, 340);
  });

  ov.addEventListener('click', window.toastyClose);

  /* Focus trap + Escape */
  document.addEventListener('keydown', function (e) {
    if (!isOpen) return;
    if (e.key === 'Escape') { window.toastyClose(); return; }
    if (e.key !== 'Tab') return;
    var nodes = win.querySelectorAll('button:not([disabled]),input:not([disabled])');
    var arr = Array.prototype.slice.call(nodes).filter(function (el) {
      return !el.disabled && el.offsetParent !== null;
    });
    if (!arr.length) return;
    var first = arr[0], last = arr[arr.length - 1];
    var inside = win.contains(document.activeElement);
    if (e.shiftKey) {
      if (!inside || document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (!inside || document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ── iOS keyboard — mobile only ── */
  if (window.visualViewport) {
    function onVP() {
      if (window.innerWidth < 768) {
        win.style.setProperty('top',    window.visualViewport.offsetTop + 'px', 'important');
        win.style.setProperty('height', window.visualViewport.height    + 'px', 'important');
      } else {
        win.style.removeProperty('top');
        win.style.removeProperty('height');
      }
    }
    window.visualViewport.addEventListener('resize', onVP);
    window.visualViewport.addEventListener('scroll', onVP);
  }

  /* ── Footer hide ── */
  var footer = document.querySelector('footer');
  if (footer && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        fab.classList.toggle('no-footer', e.isIntersecting);
        if (e.isIntersecting && isOpen) window.toastyClose();
      });
    }, { threshold: 0.05 }).observe(footer);
  }

  /* ── Send ── */
  window.toastySendInput = function () {
    var inp = document.getElementById('ty-inp');
    var txt = inp.value.trim();
    if (!txt || isLoading) return;
    inp.value = '';
    toastySend(txt);
  };

  window.toastySend = function (txt) {
    if (isLoading) return;
    var chips   = document.getElementById('ty-chips');
    var hint    = document.getElementById('ty-hint');
    var sendBtn = document.getElementById('ty-send');
    if (chips) chips.style.display = 'none';
    if (hint)  hint.style.display  = 'none'; /* fix 2: remove dead zone hint */
    addMsg('user', txt);
    history.push({ role: 'user', content: txt });
    isLoading = true;
    if (sendBtn) sendBtn.classList.add('loading');
    var tid = showTyping();

    /* 30s timeout via AbortController */
    var ctrl = new AbortController();
    var timeoutId = setTimeout(function () { ctrl.abort(); }, 30000);

    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history }),
      signal: ctrl.signal
    })
    .then(function (r) { clearTimeout(timeoutId); return r.json(); })
    .then(function (d) {
      hideTyping(tid);
      var reply = d.reply || 'Ne pare rău, a apărut o eroare.';
      addMsg('bot', reply);
      history.push({ role: 'assistant', content: reply });
      isLoading = false;
      if (sendBtn) sendBtn.classList.remove('loading');
    })
    .catch(function (err) {
      clearTimeout(timeoutId);
      hideTyping(tid);
      isLoading = false;
      if (sendBtn) sendBtn.classList.remove('loading');
      var msg = (err && err.name === 'AbortError')
        ? 'Răspunsul a durat prea mult.'
        : 'Eroare de conexiune.';
      addErrorMsg(msg, txt);
    });
  };

  /* ── DOM helpers ── */
  /* fix 4: mic avatar in messages */
  function avatarEl() {
    return '<div style="width:28px;height:28px;border-radius:8px;background:#00537f;' +
      'display:flex;align-items:center;justify-content:center;flex-shrink:0;">' +
      iconMic(14) + '</div>';
  }

  function addMsg(role, text) {
    var msgs = document.getElementById('ty-msgs');
    var row  = document.createElement('div');
    var bot  = role === 'bot';
    row.style.cssText = 'display:flex;gap:8px;align-items:flex-end;' +
      (bot ? '' : 'flex-direction:row-reverse;');
    var bubble = '<div style="' +
      (bot
        ? 'background:rgba(255,255,255,.88);border:1px solid rgba(0,83,127,.1);border-radius:4px 16px 16px 16px;color:#0f2942;'
        : 'background:#00537f;border-radius:16px 4px 16px 16px;color:#fff;') +
      'padding:12px 15px;max-width:80%;font-size:14px;line-height:1.65;">' +
      esc(text) + '</div>';
    row.innerHTML = (bot ? avatarEl() : '') + bubble;
    msgs.appendChild(row);
    msgs.scrollTop = msgs.scrollHeight;
  }

  /* Retry button in error bubble */
  function addErrorMsg(msg, retryTxt) {
    var msgs = document.getElementById('ty-msgs');
    var row  = document.createElement('div');
    row.style.cssText = 'display:flex;gap:8px;align-items:flex-end;';

    var bubble = document.createElement('div');
    bubble.style.cssText = 'background:rgba(255,255,255,.88);border:1px solid rgba(0,83,127,.1);' +
      'border-radius:4px 16px 16px 16px;' +
      'padding:12px 15px;max-width:80%;font-size:14px;line-height:1.65;color:#0f2942;';
    bubble.appendChild(document.createTextNode(msg + ' '));

    var btn = document.createElement('button');
    btn.className = 'ty-retry';
    btn.textContent = 'Încearcă din nou.';
    btn.addEventListener('click', function () {
      row.remove();
      history.pop();
      toastySend(retryTxt);
    });
    bubble.appendChild(btn);

    row.innerHTML = avatarEl();
    row.appendChild(bubble);
    msgs.appendChild(row);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function showTyping() {
    var msgs = document.getElementById('ty-msgs');
    var id   = 'tyt' + Date.now();
    var row  = document.createElement('div');
    row.id   = id;
    row.style.cssText = 'display:flex;gap:8px;align-items:flex-end;';
    var dotStyle = 'width:6px;height:6px;background:#8faab8;border-radius:50%;';
    row.innerHTML = avatarEl() +
      '<div style="background:rgba(255,255,255,.88);border:1px solid rgba(0,83,127,.1);' +
      'border-radius:4px 16px 16px 16px;' +
      'padding:14px 15px;display:flex;gap:4px;align-items:center;">' +
      '<span class="ty-dot" style="' + dotStyle + 'animation:tyDot 1.2s infinite"></span>' +
      '<span class="ty-dot" style="' + dotStyle + 'animation:tyDot 1.2s infinite .2s"></span>' +
      '<span class="ty-dot" style="' + dotStyle + 'animation:tyDot 1.2s infinite .4s"></span>' +
      '</div>';
    msgs.appendChild(row);
    msgs.scrollTop = msgs.scrollHeight;
    return id;
  }

  function hideTyping(id) {
    var el = document.getElementById(id);
    if (el) el.remove();
  }

  /* ── Sanitize + markdown ── */
  function esc(s) {
    var links = [];
    s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, function (_, t, u) {
      var ph = '\x00L' + links.length + '\x00';
      links.push('<a href="' + u + '" target="_blank" rel="noopener noreferrer"' +
        ' style="color:#00537f;font-weight:600;text-decoration:underline;">' + t + '</a>');
      return ph;
    });
    s = s.replace(/(https?:\/\/[^\s\x00]+)/g, function (_, u) {
      var d = u.replace(/https?:\/\/(www\.)?/, '').split('/')[0];
      var ph = '\x00L' + links.length + '\x00';
      links.push('<a href="' + u + '" target="_blank" rel="noopener noreferrer"' +
        ' style="color:#00537f;text-decoration:underline;">' + d + '</a>');
      return ph;
    });
    s = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/\*(.+?)\*/g, '<em>$1</em>');
    s = s.replace(/\n/g, '<br>');
    links.forEach(function (h, i) { s = s.split('\x00L' + i + '\x00').join(h); });
    return s;
  }

})();
