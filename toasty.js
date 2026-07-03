/* ════════════════════════════════════════════════
   TOASTY — Timișoara Toastmasters
   Culori site: #00537f · #004165 · #002d47
   Desktop: panel sub navbar (72px offset)
   ════════════════════════════════════════════════ */
(function () {

  var NAV_H = 72;

  /* ── CSS ── */
  var style = document.createElement('style');
  style.textContent = [
    /* Typing dots — disable for reduced-motion */
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
    /* fix 4: focus ring on FAB */
    '#ty-fab:focus-visible{outline:3px solid #00537f;outline-offset:3px;}',
    '#ty-fab.gone,#ty-fab.no-footer{opacity:0!important;visibility:hidden!important;pointer-events:none!important;}',
    '@media(min-width:640px){#ty-fab{bottom:28px!important;right:28px!important;width:56px;height:56px;}}',

    /* Panel — fix 7: base transition ease-in .18s (exit), .on overrides with ease-out .3s (enter) */
    '#ty-win{position:fixed!important;top:0!important;right:0!important;',
    'height:100%;height:100dvh;width:380px;max-width:100vw;',
    'background:#fff;border-left:1px solid rgba(0,45,71,.12);',
    'z-index:2147483646!important;display:flex;flex-direction:column;',
    'transform:translateX(100%);',
    'transition:transform .18s cubic-bezier(.4,0,1,1);',
    'box-shadow:-3px 0 32px rgba(0,45,71,.18);',
    'font-family:Inter,-apple-system,BlinkMacSystemFont,sans-serif;pointer-events:none;}',
    '#ty-win.on{transform:translateX(0);pointer-events:auto;transition:transform .3s cubic-bezier(.4,0,.2,1);}',
    '@media(min-width:768px){',
    '#ty-win{top:' + NAV_H + 'px!important;height:calc(100dvh - ' + NAV_H + 'px)!important;',
    'box-shadow:-3px 0 32px rgba(0,45,71,.2),0 4px 16px rgba(0,45,71,.1);}}',
    '@media(max-width:479px){#ty-win{width:100vw;border-left:none;}}',

    /* Close button — fix 10: CSS hover instead of inline onmouseover */
    '#ty-hdr-close{all:unset;width:36px;height:36px;border-radius:50%;',
    'background:rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center;',
    'cursor:pointer;flex-shrink:0;transition:background .15s;touch-action:manipulation;}',
    '#ty-hdr-close:hover{background:rgba(255,255,255,.26);}',
    '#ty-hdr-close:focus-visible{outline:2px solid rgba(255,255,255,.85);outline-offset:2px;}',

    /* Messages */
    '#ty-msgs{overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;',
    'padding:16px 14px;display:flex;flex-direction:column;gap:8px;flex:1;min-height:0;}',
    '#ty-msgs::-webkit-scrollbar{width:3px;}',
    '#ty-msgs::-webkit-scrollbar-track{background:transparent;}',
    '#ty-msgs::-webkit-scrollbar-thumb{background:rgba(0,45,71,.15);border-radius:99px;}',

    /* fix 2: chips min-height 44px, fix 8: touch-action, fix 4: focus ring */
    '.ty-chip{cursor:pointer;border:1.5px solid #dde6ee;border-radius:999px;',
    'padding:11px 16px;font-size:13px;color:#0f2942;background:#fff;',
    'font-family:inherit;font-weight:500;min-height:44px;touch-action:manipulation;',
    'transition:border-color .15s,color .15s,background .15s;white-space:nowrap;}',
    '.ty-chip:hover{border-color:#00537f;color:#00537f;background:#f0f7fa;}',
    '.ty-chip:focus-visible{outline:2px solid #00537f;outline-offset:2px;}',

    /* fix 1: font-size 16px prevents iOS auto-zoom; fix 4: focus ring already has box-shadow */
    '#ty-inp{flex:1;border:1.5px solid #dde6ee;border-radius:12px;',
    'padding:12px 16px;font-size:16px;outline:none;',
    'font-family:inherit;color:#0f2942;background:#f4f8fb;',
    'transition:border-color .15s,background .15s,box-shadow .15s;min-height:44px;}',
    '#ty-inp:focus{border-color:#00537f;background:#fff;box-shadow:0 0 0 3px rgba(0,83,127,.12);}',
    '#ty-inp::placeholder{color:#8faab8;}',

    /* fix 5: send disabled visual during loading; fix 8: touch-action; fix 4: focus ring */
    '#ty-send{all:unset;width:44px;height:44px;min-width:44px;border-radius:12px;background:#002d47;',
    'display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;',
    'touch-action:manipulation;',
    'transition:background .15s,transform .1s,box-shadow .15s,opacity .2s;',
    'box-shadow:0 2px 8px rgba(0,45,71,.35);}',
    '#ty-send:hover{background:#004165;box-shadow:0 4px 14px rgba(0,65,101,.45);}',
    '#ty-send:active{transform:scale(.94);}',
    '#ty-send:focus-visible{outline:2px solid #00537f;outline-offset:2px;}',
    '#ty-send.loading{opacity:.4;pointer-events:none;cursor:not-allowed;}'
  ].join('');
  document.head.appendChild(style);

  /* ── Chat icon SVG ── */
  function iconChat(size) {
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none"' +
      ' stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
  }

  /* ── Overlay ── */
  var ov = document.createElement('div');
  ov.id = 'ty-ov';
  document.body.appendChild(ov);

  /* ── FAB ── */
  var fab = document.createElement('button');
  fab.id = 'ty-fab';
  fab.setAttribute('aria-label', 'Deschide chat Toasty');
  fab.innerHTML = iconChat(24);
  document.body.appendChild(fab);

  /* ── Panel ── */
  var win = document.createElement('div');
  win.id = 'ty-win';
  win.setAttribute('role', 'dialog');
  win.setAttribute('aria-modal', 'true');
  win.setAttribute('aria-label', 'Chat Toasty');
  win.innerHTML = [

    /* Header */
    '<div style="background:linear-gradient(135deg,#00537f 0%,#004165 55%,#002d47 100%);',
    'padding:16px 18px;display:flex;align-items:center;gap:12px;flex-shrink:0;min-height:68px;">',

      '<div style="width:40px;height:40px;border-radius:11px;',
      'background:rgba(255,255,255,.15);border:1.5px solid rgba(255,255,255,.22);',
      'display:flex;align-items:center;justify-content:center;flex-shrink:0;">',
        iconChat(20),
      '</div>',

      '<div style="flex:1;min-width:0;">',
        '<div style="color:#fff;font-weight:700;font-size:15px;line-height:1.2;">Toasty</div>',
        '<div style="display:flex;align-items:center;gap:5px;margin-top:4px;">',
          '<span style="width:6px;height:6px;background:#4ade80;border-radius:50%;flex-shrink:0;"></span>',
          '<span style="color:rgba(255,255,255,.68);font-size:12px;font-weight:500;">Online · răspunde instant</span>',
        '</div>',
      '</div>',

      /* fix 10: id + CSS hover, no inline onmouseover */
      '<button id="ty-hdr-close" onclick="toastyClose()" aria-label="Închide chat">',
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white"',
        ' stroke-width="2.5" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
      '</button>',

    '</div>',

    /* fix 9: role="log" aria-relevant="additions" */
    '<div id="ty-msgs" role="log" aria-live="polite" aria-relevant="additions">',
      '<div style="display:flex;gap:8px;align-items:flex-end;margin-top:4px;">',
        '<div style="width:28px;height:28px;border-radius:8px;background:#00537f;',
        'display:flex;align-items:center;justify-content:center;flex-shrink:0;">',
          iconChat(14),
        '</div>',
        '<div style="background:#eef4f8;border-radius:4px 16px 16px 16px;',
        'padding:12px 15px;max-width:80%;font-size:14px;line-height:1.65;color:#0f2942;">',
          'Bună! 👋 Sunt <strong>Toasty</strong>, asistentul tău Toastmasters.<br>',
          'Cu ce te pot ajuta?',
        '</div>',
      '</div>',
      /* Chips inline below welcome bubble, aligned with bubble (avatar 28px + gap 8px = 36px) */
      '<div id="ty-chips" style="display:flex;flex-direction:column;align-items:flex-start;gap:6px;padding:6px 0 4px 36px;">',
        '<button class="ty-chip" onclick="toastySend(\'Când sunt ședințele?\')">Când sunt ședințele?</button>',
        '<button class="ty-chip" onclick="toastySend(\'Cum mă pot înscrie?\')">Cum mă pot înscrie?</button>',
        '<button class="ty-chip" onclick="toastySend(\'Pot veni gratuit?\')">Pot veni gratuit?</button>',
        '<button class="ty-chip" onclick="toastySend(\'Unde se țin ședințele?\')">Unde se țin ședințele?</button>',
      '</div>',
    '</div>',

    /* fix 6: safe-area-inset-bottom pe padding */
    '<div style="padding:12px 14px max(16px,env(safe-area-inset-bottom));',
    'border-top:1px solid #dde6ee;display:flex;gap:8px;align-items:center;',
    'flex-shrink:0;background:#fff;">',
      '<input id="ty-inp" type="text" placeholder="Scrie un mesaj…"',
      ' autocomplete="off" inputmode="text" aria-label="Mesajul tău"',
      ' onkeydown="if(event.key===\'Enter\'&&!event.shiftKey){event.preventDefault();toastySendInput();}">',
      /* fix 5: loading class toggled via JS */
      '<button id="ty-send" onclick="toastySendInput()" aria-label="Trimite mesaj">',
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white"',
        ' stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">',
        '<path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>',
      '</button>',
    '</div>'

  ].join('');
  document.body.appendChild(win);

  /* ── State ── */
  var isOpen = false, isLoading = false, history = [];

  /* ── Open / Close ── */
  window.toastyClose = function () {
    isOpen = false;
    fab.classList.remove('gone');
    win.classList.remove('on');
    ov.classList.remove('on');
    document.body.style.overflow = '';
  };

  fab.addEventListener('click', function () {
    isOpen = true;
    fab.classList.add('gone');
    win.classList.add('on');
    ov.classList.add('on');
    document.body.style.overflow = 'hidden';
    setTimeout(function () {
      var inp = document.getElementById('ty-inp');
      if (inp) inp.focus();
    }, 340);
  });

  ov.addEventListener('click', window.toastyClose);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen) window.toastyClose();
  });

  /* ── iOS keyboard — doar pe mobile ── */
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
    var sendBtn = document.getElementById('ty-send');
    if (chips) chips.style.display = 'none';
    addMsg('user', txt);
    history.push({ role: 'user', content: txt });
    isLoading = true;
    /* fix 5: visual disabled state */
    if (sendBtn) sendBtn.classList.add('loading');
    var tid = showTyping();
    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history })
    })
    .then(function (r) { return r.json(); })
    .then(function (d) {
      hideTyping(tid);
      var reply = d.reply || 'Ne pare rău, a apărut o eroare.';
      addMsg('bot', reply);
      history.push({ role: 'assistant', content: reply });
      isLoading = false;
      if (sendBtn) sendBtn.classList.remove('loading');
    })
    .catch(function () {
      hideTyping(tid);
      addMsg('bot', 'Eroare de conexiune. Încearcă din nou.');
      isLoading = false;
      if (sendBtn) sendBtn.classList.remove('loading');
    });
  };

  /* ── DOM helpers ── */
  function avatarEl() {
    return '<div style="width:28px;height:28px;border-radius:8px;background:#00537f;' +
      'display:flex;align-items:center;justify-content:center;flex-shrink:0;">' +
      iconChat(14) + '</div>';
  }

  function addMsg(role, text) {
    var msgs = document.getElementById('ty-msgs');
    var row  = document.createElement('div');
    var bot  = role === 'bot';
    row.style.cssText = 'display:flex;gap:8px;align-items:flex-end;' +
      (bot ? '' : 'flex-direction:row-reverse;');
    var bubble = '<div style="' +
      (bot
        ? 'background:#eef4f8;border-radius:4px 16px 16px 16px;color:#0f2942;'
        : 'background:#00537f;border-radius:16px 4px 16px 16px;color:#fff;') +
      'padding:12px 15px;max-width:80%;font-size:14px;line-height:1.65;">' +
      esc(text) + '</div>';
    row.innerHTML = (bot ? avatarEl() : '') + bubble;
    msgs.appendChild(row);
    msgs.scrollTop = msgs.scrollHeight;
  }

  /* fix 3: add class ty-dot so prefers-reduced-motion CSS applies */
  function showTyping() {
    var msgs = document.getElementById('ty-msgs');
    var id   = 'tyt' + Date.now();
    var row  = document.createElement('div');
    row.id   = id;
    row.style.cssText = 'display:flex;gap:8px;align-items:flex-end;';
    var dotStyle = 'width:6px;height:6px;background:#8faab8;border-radius:50%;';
    row.innerHTML = avatarEl() +
      '<div style="background:#eef4f8;border-radius:4px 16px 16px 16px;' +
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
