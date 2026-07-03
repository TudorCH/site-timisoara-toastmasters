/* ════════════════════════════════════════════════
   TOASTY — Timișoara Toastmasters
   Design: flat minimal · blue #2563EB · ui-ux-pro-max
   ════════════════════════════════════════════════ */
(function () {

  /* ── CSS ── */
  var style = document.createElement('style');
  style.textContent = [
    '@keyframes tyDot{0%,80%,100%{transform:scale(.6);opacity:.4}40%{transform:scale(1);opacity:1}}',

    /* Overlay */
    '#ty-ov{position:fixed;inset:0;background:rgba(15,23,42,.35);z-index:2147483645;',
    'opacity:0;pointer-events:none;transition:opacity .25s;}',
    '#ty-ov.on{opacity:1;pointer-events:auto;}',

    /* FAB — hidden while panel is open */
    '#ty-fab{all:unset;position:fixed!important;bottom:20px!important;right:16px!important;',
    'z-index:2147483647!important;width:52px;height:52px;border-radius:50%;cursor:pointer;',
    'background:#2563EB;box-shadow:0 4px 18px rgba(37,99,235,.45);',
    'display:flex!important;align-items:center;justify-content:center;',
    'transition:transform .2s,box-shadow .2s,opacity .2s,visibility .2s;}',
    '#ty-fab:hover{transform:scale(1.09);box-shadow:0 6px 26px rgba(37,99,235,.55);}',
    '#ty-fab.gone,#ty-fab.no-footer{opacity:0!important;visibility:hidden!important;pointer-events:none!important;}',

    /* Panel */
    '#ty-win{position:fixed!important;top:0!important;right:0!important;',
    'height:100%;height:100dvh;width:380px;max-width:100vw;',
    'background:#fff;border-left:1px solid #E4ECFC;',
    'z-index:2147483646!important;display:flex;flex-direction:column;',
    'transform:translateX(100%);transition:transform .3s cubic-bezier(.4,0,.2,1);',
    'box-shadow:-2px 0 40px rgba(0,0,0,.1);',
    'font-family:Inter,-apple-system,BlinkMacSystemFont,sans-serif;pointer-events:none;}',
    '#ty-win.on{transform:translateX(0);pointer-events:auto;}',

    /* Messages scroll */
    '#ty-msgs{overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;',
    'padding:16px 14px;display:flex;flex-direction:column;gap:8px;flex:1;min-height:0;}',
    '#ty-msgs::-webkit-scrollbar{width:3px;}',
    '#ty-msgs::-webkit-scrollbar-track{background:transparent;}',
    '#ty-msgs::-webkit-scrollbar-thumb{background:#E4ECFC;border-radius:99px;}',

    /* Quick reply chips */
    '.ty-chip{cursor:pointer;border:1.5px solid #E4ECFC;border-radius:999px;',
    'padding:9px 15px;font-size:13px;color:#0F172A;background:#fff;',
    'font-family:inherit;font-weight:500;min-height:38px;',
    'transition:border-color .15s,color .15s,background .15s;white-space:nowrap;}',
    '.ty-chip:hover{border-color:#2563EB;color:#2563EB;background:#F1F5FD;}',

    /* Input */
    '#ty-inp{flex:1;border:1.5px solid #E4ECFC;border-radius:12px;',
    'padding:12px 16px;font-size:15px;outline:none;',
    'font-family:inherit;color:#0F172A;background:#F8FAFF;',
    'transition:border-color .15s,background .15s;min-height:44px;}',
    '#ty-inp:focus{border-color:#2563EB;background:#fff;box-shadow:0 0 0 3px rgba(37,99,235,.08);}',
    '#ty-inp::placeholder{color:#94a3b8;}',

    /* Send button */
    '#ty-send{all:unset;width:44px;height:44px;min-width:44px;border-radius:12px;background:#2563EB;',
    'display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;',
    'transition:background .15s,transform .1s,box-shadow .15s;',
    'box-shadow:0 2px 8px rgba(37,99,235,.3);}',
    '#ty-send:hover{background:#1d4ed8;box-shadow:0 4px 14px rgba(37,99,235,.4);}',
    '#ty-send:active{transform:scale(.94);}',

    /* Mobile full-width */
    '@media(max-width:479px){#ty-win{width:100vw;border-left:none;}}',
    '@media(min-width:640px){#ty-fab{bottom:28px!important;right:28px!important;width:56px;height:56px;}}'
  ].join('');
  document.head.appendChild(style);

  /* ── Shared SVGs ── */
  function iconChat(w) {
    return '<svg width="' + w + '" height="' + w + '" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
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

    /* Header — blue→indigo gradient */
    '<div style="background:linear-gradient(135deg,#2563EB 0%,#6366F1 100%);',
    'padding:16px 18px;display:flex;align-items:center;gap:12px;',
    'flex-shrink:0;min-height:72px;box-shadow:0 1px 0 rgba(0,0,0,.08);">',

      '<div style="width:42px;height:42px;border-radius:12px;',
      'background:rgba(255,255,255,.18);border:1.5px solid rgba(255,255,255,.25);',
      'display:flex;align-items:center;justify-content:center;flex-shrink:0;">',
        iconChat(21),
      '</div>',

      '<div style="flex:1;min-width:0;">',
        '<div style="color:#fff;font-weight:700;font-size:15px;line-height:1.2;',
        'letter-spacing:-.01em;">Toasty</div>',
        '<div style="display:flex;align-items:center;gap:5px;margin-top:4px;">',
          '<span style="width:6px;height:6px;background:#4ade80;border-radius:50%;flex-shrink:0;',
          'box-shadow:0 0 0 2px rgba(74,222,128,.3);"></span>',
          '<span style="color:rgba(255,255,255,.72);font-size:12px;font-weight:500;">',
          'Online · răspunde instant</span>',
        '</div>',
      '</div>',

      /* Close — in header, far from send */
      '<button onclick="toastyClose()" aria-label="Închide chat"',
      'style="all:unset;width:36px;height:36px;border-radius:50%;',
      'background:rgba(255,255,255,.15);',
      'display:flex;align-items:center;justify-content:center;',
      'cursor:pointer;flex-shrink:0;transition:background .15s;"',
      'onmouseover="this.style.background=\'rgba(255,255,255,.28)\'"',
      'onmouseout="this.style.background=\'rgba(255,255,255,.15)\'">',
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"',
        'stroke="white" stroke-width="2.5" stroke-linecap="round">',
        '<path d="M18 6 6 18M6 6l12 12"/></svg>',
      '</button>',

    '</div>',

    /* Messages */
    '<div id="ty-msgs" aria-live="polite">',
      '<div style="display:flex;gap:8px;align-items:flex-end;margin-top:4px;">',
        '<div style="width:28px;height:28px;border-radius:8px;background:#2563EB;',
        'display:flex;align-items:center;justify-content:center;flex-shrink:0;">',
          iconChat(14),
        '</div>',
        '<div style="background:#F1F5FD;border-radius:4px 16px 16px 16px;',
        'padding:12px 15px;max-width:80%;font-size:14px;line-height:1.65;color:#0F172A;">',
          'Bună! 👋 Sunt <strong>Toasty</strong>, asistentul tău Toastmasters.<br>',
          'Cu ce te pot ajuta?',
        '</div>',
      '</div>',
    '</div>',

    /* Quick reply chips */
    '<div id="ty-chips"',
    'style="padding:8px 14px 12px;display:flex;flex-wrap:wrap;gap:8px;',
    'flex-shrink:0;border-top:1px solid #F1F5FD;">',
      '<button class="ty-chip" onclick="toastySend(\'Când sunt ședințele?\')">Ședințe</button>',
      '<button class="ty-chip" onclick="toastySend(\'Cum mă pot înscrie?\')">Înscriere</button>',
      '<button class="ty-chip" onclick="toastySend(\'Pot veni gratuit?\')">Cost</button>',
      '<button class="ty-chip" onclick="toastySend(\'Unde se țin ședințele?\')">Locație</button>',
    '</div>',

    /* Input row — send is here, nowhere near close */
    '<div style="padding:12px 14px 16px;border-top:1px solid #E4ECFC;',
    'display:flex;gap:8px;align-items:center;flex-shrink:0;background:#fff;">',
      '<input id="ty-inp" type="text" placeholder="Scrie un mesaj…"',
      'autocomplete="off" inputmode="text" aria-label="Mesajul tău"',
      'onkeydown="if(event.key===\'Enter\'&&!event.shiftKey){event.preventDefault();toastySendInput();}">',
      '<button id="ty-send" onclick="toastySendInput()" aria-label="Trimite">',
        /* Arrow up — clean, universal "send" */
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"',
        'stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">',
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
    fab.classList.add('gone');      /* hide FAB — no overlap with anything */
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

  /* ── iOS keyboard — panel shrinks to visualViewport ── */
  if (window.visualViewport) {
    function onVP() {
      win.style.setProperty('top',    window.visualViewport.offsetTop + 'px', 'important');
      win.style.setProperty('height', window.visualViewport.height    + 'px', 'important');
    }
    window.visualViewport.addEventListener('resize', onVP);
    window.visualViewport.addEventListener('scroll', onVP);
  }

  /* ── Hide FAB near footer ── */
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
    var chips = document.getElementById('ty-chips');
    if (chips) { chips.style.display = 'none'; }
    addMsg('user', txt);
    history.push({ role: 'user', content: txt });
    isLoading = true;
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
    })
    .catch(function () {
      hideTyping(tid);
      addMsg('bot', 'Eroare de conexiune. Încearcă din nou.');
      isLoading = false;
    });
  };

  /* ── Message helpers ── */
  function avatarEl() {
    return '<div style="width:28px;height:28px;border-radius:8px;background:#2563EB;' +
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
        ? 'background:#F1F5FD;border-radius:4px 16px 16px 16px;color:#0F172A;'
        : 'background:#2563EB;border-radius:16px 4px 16px 16px;color:#fff;') +
      'padding:12px 15px;max-width:80%;font-size:14px;line-height:1.65;">' +
      esc(text) + '</div>';
    row.innerHTML = (bot ? avatarEl() : '') + bubble;
    msgs.appendChild(row);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function showTyping() {
    var msgs = document.getElementById('ty-msgs');
    var id   = 'tyt' + Date.now();
    var row  = document.createElement('div');
    row.id   = id;
    row.style.cssText = 'display:flex;gap:8px;align-items:flex-end;';
    row.innerHTML = avatarEl() +
      '<div style="background:#F1F5FD;border-radius:4px 16px 16px 16px;' +
      'padding:14px 15px;display:flex;gap:4px;align-items:center;">' +
      '<span style="width:6px;height:6px;background:#94a3b8;border-radius:50%;animation:tyDot 1.2s infinite"></span>' +
      '<span style="width:6px;height:6px;background:#94a3b8;border-radius:50%;animation:tyDot 1.2s infinite .2s"></span>' +
      '<span style="width:6px;height:6px;background:#94a3b8;border-radius:50%;animation:tyDot 1.2s infinite .4s"></span>' +
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
        ' style="color:#2563EB;font-weight:600;text-decoration:underline;">' + t + '</a>');
      return ph;
    });
    s = s.replace(/(https?:\/\/[^\s\x00]+)/g, function (_, u) {
      var d = u.replace(/https?:\/\/(www\.)?/, '').split('/')[0];
      var ph = '\x00L' + links.length + '\x00';
      links.push('<a href="' + u + '" target="_blank" rel="noopener noreferrer"' +
        ' style="color:#2563EB;text-decoration:underline;">' + d + '</a>');
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
