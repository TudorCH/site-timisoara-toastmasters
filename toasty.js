/* ════════════════════════════════════════════════
   TOASTY - Chatbot Timișoara Toastmasters
   Panel slide-in din dreapta
   ════════════════════════════════════════════════ */
(function () {

  /* ── CSS ── */
  var css = document.createElement('style');
  css.textContent = [
    '@keyframes toastyDot{0%,80%,100%{transform:scale(.6);opacity:.4}40%{transform:scale(1);opacity:1}}',
    '#toasty-overlay{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:2147483645;opacity:0;pointer-events:none;transition:opacity .35s;backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px);}',
    '#toasty-overlay.visible{opacity:1;pointer-events:auto;}',
    '#toasty-btn{all:unset;position:fixed!important;bottom:20px!important;right:16px!important;z-index:2147483647!important;width:56px;height:56px;border-radius:50%;cursor:pointer;background:linear-gradient(135deg,#772432,#5c1a25);box-shadow:0 4px 20px rgba(119,36,50,.45);display:flex!important;align-items:center;justify-content:center;transition:background .25s,transform .2s,box-shadow .2s,opacity .3s,visibility .3s;}',
    '#toasty-btn:hover{transform:scale(1.1);box-shadow:0 6px 28px rgba(119,36,50,.55);}',
    '#toasty-btn.open{background:#F2DF74!important;box-shadow:0 4px 20px rgba(242,223,116,.5)!important;}',
    '#toasty-btn.hidden-by-footer{opacity:0!important;visibility:hidden!important;pointer-events:none!important;}',
    '#toasty-win{position:fixed!important;top:0!important;right:0!important;height:100%;height:100dvh;width:380px;max-width:calc(100vw - 48px);background:#fff;z-index:2147483646!important;display:flex;flex-direction:column;transform:translateX(110%);transition:transform .38s cubic-bezier(.4,0,.2,1);box-shadow:-4px 0 40px rgba(119,36,50,.18);font-family:Inter,sans-serif;pointer-events:none;}',
    '#toasty-win.open{transform:translateX(0);pointer-events:auto;}',
    '#toasty-msgs{overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;padding:16px;display:flex;flex-direction:column;gap:10px;flex:1;min-height:0;}',
    '@media(min-width:640px){#toasty-btn{bottom:28px!important;right:28px!important;width:64px;height:64px;}}'
  ].join('');
  document.head.appendChild(css);

  /* ── Icons ── */
  var iconBot = '<svg id="ti-chat" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5V20.7929C3 21.2383 3.53857 21.4614 3.85355 21.1464L7.70711 17.2929C7.89464 17.1054 8.149 17 8.41421 17H19C20.1046 17 21 16.1046 21 15V5C21 3.89543 20.1046 3 19 3H5C3.89543 3 3 3.89543 3 5Z"/><path d="M15 12C14.2005 12.6224 13.1502 13 12 13C10.8498 13 9.79952 12.6224 9 12"/><path d="M9 8.01953V8"/><path d="M15 8.01953V8"/></svg>';
  var iconX   = '<svg id="ti-x" width="20" height="20" fill="none" stroke="#772432" stroke-width="2.5" viewBox="0 0 24 24" style="display:none"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>';

  /* ── Overlay ── */
  var overlay = document.createElement('div');
  overlay.id = 'toasty-overlay';
  document.body.appendChild(overlay);

  /* ── Button ── */
  var btn = document.createElement('button');
  btn.id = 'toasty-btn';
  btn.setAttribute('aria-label', 'Deschide chat Toasty');
  btn.innerHTML = iconBot + iconX;
  document.body.appendChild(btn);

  /* ── Panel ── */
  var win = document.createElement('div');
  win.id = 'toasty-win';
  win.setAttribute('role', 'dialog');
  win.setAttribute('aria-modal', 'true');
  win.setAttribute('aria-label', 'Chat Toasty');
  win.innerHTML = [
    '<div style="background:linear-gradient(135deg,#772432,#5c1a25);padding:16px 20px;display:flex;align-items:center;gap:12px;flex-shrink:0;border-bottom:2px solid rgba(242,223,116,.25);">',
      '<div style="width:42px;height:42px;border-radius:50%;background:rgba(242,223,116,.15);border:2px solid rgba(242,223,116,.4);display:flex;align-items:center;justify-content:center;flex-shrink:0;">',
        '<svg width="22" height="22" fill="none" stroke="#F2DF74" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>',
      '</div>',
      '<div style="flex:1;min-width:0;">',
        '<div style="color:#fff;font-weight:700;font-size:15px;line-height:1.2;">Toasty</div>',
        '<div style="display:flex;align-items:center;gap:5px;margin-top:3px;">',
          '<span style="width:7px;height:7px;background:#4ade80;border-radius:50%;flex-shrink:0;display:block;"></span>',
          '<span style="color:rgba(255,255,255,.6);font-size:11px;">Asistent Timișoara Toastmasters</span>',
        '</div>',
      '</div>',
      '<button onclick="toastyClose()" aria-label="Închide chat" style="all:unset;width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;transition:background .2s;" onmouseover="this.style.background=\'rgba(255,255,255,.2)\'" onmouseout="this.style.background=\'rgba(255,255,255,.1)\'">',
        '<svg width="17" height="17" fill="none" stroke="white" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>',
      '</button>',
    '</div>',
    '<div id="toasty-msgs" aria-live="polite" aria-label="Mesaje Toasty">',
      '<div style="display:flex;gap:10px;align-items:flex-end;">',
        '<div style="width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,#772432,#5c1a25);display:flex;align-items:center;justify-content:center;flex-shrink:0;"><svg width="15" height="15" fill="none" stroke="#F2DF74" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg></div>',
        '<div style="background:#fdf6f0;border-radius:18px 18px 18px 4px;padding:12px 15px;max-width:80%;font-size:14px;line-height:1.6;color:#1f2937;border:1px solid rgba(119,36,50,.08);">Bună! 👋 Sunt <b>Toasty</b>, asistentul Timișoara Toastmasters.<br>Cu ce te pot ajuta?</div>',
      '</div>',
    '</div>',
    '<div id="toasty-chips" style="padding:4px 16px 14px;display:flex;flex-wrap:wrap;gap:7px;flex-shrink:0;">',
      '<button onclick="toastySend(\'Când sunt ședințele?\')" style="all:unset;background:rgba(242,223,116,.1);border:1px solid rgba(119,36,50,.18);border-radius:999px;padding:7px 14px;font-size:13px;color:#772432;cursor:pointer;font-weight:500;">📅 Ședințe</button>',
      '<button onclick="toastySend(\'Cum mă pot înscrie?\')" style="all:unset;background:rgba(242,223,116,.1);border:1px solid rgba(119,36,50,.18);border-radius:999px;padding:7px 14px;font-size:13px;color:#772432;cursor:pointer;font-weight:500;">✍️ Înscriere</button>',
      '<button onclick="toastySend(\'Pot veni gratuit?\')" style="all:unset;background:rgba(242,223,116,.1);border:1px solid rgba(119,36,50,.18);border-radius:999px;padding:7px 14px;font-size:13px;color:#772432;cursor:pointer;font-weight:500;">💰 Cost</button>',
      '<button onclick="toastySend(\'Unde se țin ședințele?\')" style="all:unset;background:rgba(242,223,116,.1);border:1px solid rgba(119,36,50,.18);border-radius:999px;padding:7px 14px;font-size:13px;color:#772432;cursor:pointer;font-weight:500;">📍 Locație</button>',
    '</div>',
    '<div style="padding:12px 16px 16px;border-top:1px solid #f0ebe8;display:flex;gap:10px;align-items:center;flex-shrink:0;background:#fff;">',
      '<input id="toasty-input" type="text" placeholder="Scrie un mesaj…" style="flex:1;border:1.5px solid #e5e7eb;border-radius:999px;padding:11px 16px;font-size:14px;outline:none;font-family:Inter,sans-serif;color:#1f2937;transition:border-color .2s;" onfocus="this.style.borderColor=\'#772432\'" onblur="this.style.borderColor=\'#e5e7eb\'" onkeydown="if(event.key===\'Enter\'){event.preventDefault();toastySendInput();}">',
      '<button onclick="toastySendInput()" aria-label="Trimite mesaj" style="all:unset;width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#772432,#5c1a25);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;box-shadow:0 2px 10px rgba(119,36,50,.35);transition:transform .15s,box-shadow .15s;" onmouseover="this.style.transform=\'scale(1.08)\'" onmouseout="this.style.transform=\'\'">',
        '<svg width="17" height="17" fill="none" stroke="white" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>',
      '</button>',
    '</div>'
  ].join('');
  document.body.appendChild(win);

  /* ── Toggle ── */
  var isOpen = false, isLoading = false, chatHistory = [];

  window.toastyClose = function () {
    isOpen = false;
    btn.classList.remove('open');
    btn.setAttribute('aria-label', 'Deschide chat Toasty');
    document.getElementById('ti-chat').style.display = 'block';
    document.getElementById('ti-x').style.display    = 'none';
    win.classList.remove('open');
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
  };

  btn.addEventListener('click', function () {
    isOpen = !isOpen;
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-label', isOpen ? 'Închide chat Toasty' : 'Deschide chat Toasty');
    document.getElementById('ti-chat').style.display = isOpen ? 'none' : 'block';
    document.getElementById('ti-x').style.display    = isOpen ? 'block' : 'none';
    if (isOpen) {
      win.classList.add('open');
      overlay.classList.add('visible');
      document.body.style.overflow = 'hidden';
      setTimeout(function () { document.getElementById('toasty-input').focus(); }, 400);
    } else {
      window.toastyClose();
    }
  });

  overlay.addEventListener('click', window.toastyClose);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen) window.toastyClose();
  });

  /* ── iOS keyboard: ajustare panel la viewport real ── */
  if (window.visualViewport) {
    function onVPResize() {
      win.style.setProperty('top',    window.visualViewport.offsetTop + 'px', 'important');
      win.style.setProperty('height', window.visualViewport.height    + 'px', 'important');
    }
    window.visualViewport.addEventListener('resize', onVPResize);
    window.visualViewport.addEventListener('scroll', onVPResize);
  }

  /* ── Ascunde lângă footer ── */
  var footer = document.querySelector('footer');
  if (footer && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          btn.classList.add('hidden-by-footer');
          if (isOpen) window.toastyClose();
        } else {
          btn.classList.remove('hidden-by-footer');
        }
      });
    }, { threshold: 0.05 }).observe(footer);
  }

  /* ── Trimitere mesaje ── */
  window.toastySendInput = function () {
    var input = document.getElementById('toasty-input');
    var text  = input.value.trim();
    if (!text) return;
    input.value = '';
    toastySend(text);
  };

  window.toastySend = function (text) {
    if (isLoading) return;
    document.getElementById('toasty-chips').style.display = 'none';
    addMsg('user', text);
    chatHistory.push({ role: 'user', content: text });
    isLoading = true;
    var loadId = addLoading();
    fetch('/api/chat', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ messages: chatHistory })
    })
    .then(function (r) { return r.json(); })
    .then(function (d) {
      rmLoading(loadId);
      var reply = d.reply || 'Ne pare rău, a apărut o eroare.';
      addMsg('bot', reply);
      chatHistory.push({ role: 'assistant', content: reply });
      isLoading = false;
    })
    .catch(function () {
      rmLoading(loadId);
      addMsg('bot', '⚠️ Eroare de conexiune. Încearcă din nou.');
      isLoading = false;
    });
  };

  function addMsg(role, text) {
    var msgs = document.getElementById('toasty-msgs');
    var row  = document.createElement('div');
    row.style.cssText = 'display:flex;gap:10px;align-items:flex-end;' + (role === 'user' ? 'flex-direction:row-reverse;' : '');
    var avatar = role === 'bot'
      ? '<div style="width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,#772432,#5c1a25);display:flex;align-items:center;justify-content:center;flex-shrink:0;"><svg width="15" height="15" fill="none" stroke="#F2DF74" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg></div>'
      : '';
    var bg     = role === 'user' ? '#772432' : '#fdf6f0';
    var clr    = role === 'user' ? 'white'   : '#1f2937';
    var br     = role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px';
    var border = role === 'bot'  ? 'border:1px solid rgba(119,36,50,.08);' : '';
    row.innerHTML = avatar + '<div style="background:' + bg + ';color:' + clr + ';border-radius:' + br + ';padding:12px 15px;max-width:78%;font-size:14px;line-height:1.6;' + border + '">' + esc(text) + '</div>';
    msgs.appendChild(row);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function addLoading() {
    var msgs = document.getElementById('toasty-msgs');
    var id   = 'tld' + Date.now();
    var row  = document.createElement('div');
    row.id   = id;
    row.style.cssText = 'display:flex;gap:10px;align-items:flex-end;';
    row.innerHTML = '<div style="width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,#772432,#5c1a25);display:flex;align-items:center;justify-content:center;flex-shrink:0;"><svg width="15" height="15" fill="none" stroke="#F2DF74" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg></div><div style="background:#fdf6f0;border-radius:18px 18px 18px 4px;padding:14px 16px;display:flex;gap:5px;align-items:center;border:1px solid rgba(119,36,50,.08);"><span style="width:7px;height:7px;background:#c4a882;border-radius:50%;animation:toastyDot 1.2s infinite"></span><span style="width:7px;height:7px;background:#c4a882;border-radius:50%;animation:toastyDot 1.2s infinite .2s"></span><span style="width:7px;height:7px;background:#c4a882;border-radius:50%;animation:toastyDot 1.2s infinite .4s"></span></div>';
    msgs.appendChild(row);
    msgs.scrollTop = msgs.scrollHeight;
    return id;
  }

  function rmLoading(id) { var el = document.getElementById(id); if (el) el.remove(); }

  function esc(s) {
    var links = [];
    s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, function(_, text, url) {
      var ph = '\x00L' + links.length + '\x00';
      links.push('<a href="' + url + '" target="_blank" rel="noopener noreferrer" style="color:#772432;font-weight:600;text-decoration:underline;">' + text + '</a>');
      return ph;
    });
    s = s.replace(/(https?:\/\/[^\s\x00]+)/g, function(_, url) {
      var domain = url.replace(/https?:\/\/(www\.)?/, '').split('/')[0];
      var ph = '\x00L' + links.length + '\x00';
      links.push('<a href="' + url + '" target="_blank" rel="noopener noreferrer" style="color:#772432;text-decoration:underline;">' + domain + '</a>');
      return ph;
    });
    s = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/\*(.+?)\*/g, '<em>$1</em>');
    s = s.replace(/\n/g, '<br>');
    links.forEach(function(html, i) { s = s.split('\x00L' + i + '\x00').join(html); });
    return s;
  }

})();
