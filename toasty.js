/* ════════════════════════════════════════════════
   TOASTY - Chatbot Timișoara Toastmasters
   Panel slide-in — stil Intercom
   ════════════════════════════════════════════════ */
(function () {

  /* ── CSS ── */
  var css = document.createElement('style');
  css.textContent = [
    '@keyframes toastyDot{0%,80%,100%{transform:scale(.6);opacity:.4}40%{transform:scale(1);opacity:1}}',
    '#toasty-overlay{position:fixed;inset:0;background:rgba(0,0,0,.35);z-index:2147483645;opacity:0;pointer-events:none;transition:opacity .3s;}',
    '#toasty-overlay.visible{opacity:1;pointer-events:auto;}',
    '#toasty-btn{all:unset;position:fixed!important;bottom:20px!important;right:16px!important;z-index:2147483647!important;width:56px;height:56px;border-radius:50%;cursor:pointer;background:#772432;box-shadow:0 4px 16px rgba(119,36,50,.4);display:flex!important;align-items:center;justify-content:center;transition:transform .2s,box-shadow .2s,opacity .3s,visibility .3s;}',
    '#toasty-btn:hover{transform:scale(1.08);box-shadow:0 6px 24px rgba(119,36,50,.55);}',
    '#toasty-btn.hidden-by-footer{opacity:0!important;visibility:hidden!important;pointer-events:none!important;}',
    '#toasty-win{position:fixed!important;top:0!important;right:0!important;height:100%;height:100dvh;width:376px;max-width:calc(100vw - 40px);background:#fff;z-index:2147483646!important;display:flex;flex-direction:column;transform:translateX(110%);transition:transform .35s cubic-bezier(.4,0,.2,1);box-shadow:-2px 0 24px rgba(0,0,0,.12),-8px 0 48px rgba(0,0,0,.08);font-family:Inter,sans-serif;pointer-events:none;}',
    '#toasty-win.open{transform:translateX(0);pointer-events:auto;}',
    '#toasty-msgs{overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;padding:20px 16px;display:flex;flex-direction:column;gap:8px;flex:1;min-height:0;background:#fff;}',
    '#toasty-msgs::-webkit-scrollbar{width:0;}',
    '@media(min-width:640px){#toasty-btn{bottom:28px!important;right:28px!important;width:60px;height:60px;}}'
  ].join('');
  document.head.appendChild(css);

  /* ── Overlay ── */
  var overlay = document.createElement('div');
  overlay.id = 'toasty-overlay';
  document.body.appendChild(overlay);

  /* ── Button ── */
  var btn = document.createElement('button');
  btn.id = 'toasty-btn';
  btn.setAttribute('aria-label', 'Deschide chat Toasty');
  btn.innerHTML = [
    '<svg id="ti-chat" width="26" height="26" viewBox="0 0 28 28" fill="none"><path d="M4 6C4 4.89543 4.89543 4 6 4H22C23.1046 4 24 4.89543 24 6V18C24 19.1046 23.1046 20 22 20H15L9 24V20H6C4.89543 20 4 19.1046 4 18V6Z" fill="white" fill-opacity=".95"/><circle cx="10" cy="12" r="1.5" fill="#772432"/><circle cx="14" cy="12" r="1.5" fill="#772432"/><circle cx="18" cy="12" r="1.5" fill="#772432"/></svg>',
    '<svg id="ti-x" width="22" height="22" fill="none" stroke="white" stroke-width="2.5" viewBox="0 0 24 24" style="display:none"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>'
  ].join('');
  document.body.appendChild(btn);

  /* ── Panel ── */
  var win = document.createElement('div');
  win.id = 'toasty-win';
  win.setAttribute('role', 'dialog');
  win.setAttribute('aria-modal', 'true');
  win.setAttribute('aria-label', 'Chat Toasty');
  win.innerHTML = [
    // Header — solid maroon, mai înalt ca Intercom
    '<div style="background:#772432;padding:20px 20px 24px;flex-shrink:0;">',
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">',
        '<div style="display:flex;align-items:center;gap:6px;">',
          '<span style="width:8px;height:8px;background:#4ade80;border-radius:50%;display:block;box-shadow:0 0 0 2px rgba(255,255,255,.25);"></span>',
          '<span style="color:rgba(255,255,255,.75);font-size:12px;font-weight:500;letter-spacing:.01em;">Suntem online</span>',
        '</div>',
        '<button onclick="toastyClose()" aria-label="Închide chat" style="all:unset;width:32px;height:32px;border-radius:50%;background:rgba(0,0,0,.15);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background .15s;" onmouseover="this.style.background=\'rgba(0,0,0,.25)\'" onmouseout="this.style.background=\'rgba(0,0,0,.15)\'">',
          '<svg width="15" height="15" fill="none" stroke="white" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>',
        '</button>',
      '</div>',
      '<div style="display:flex;align-items:center;gap:12px;">',
        '<div style="width:48px;height:48px;border-radius:14px;background:rgba(255,255,255,.15);border:2px solid rgba(255,255,255,.25);display:flex;align-items:center;justify-content:center;flex-shrink:0;">',
          '<svg width="24" height="24" viewBox="0 0 28 28" fill="none"><path d="M4 6C4 4.89543 4.89543 4 6 4H22C23.1046 4 24 4.89543 24 6V18C24 19.1046 23.1046 20 22 20H15L9 24V20H6C4.89543 20 4 19.1046 4 18V6Z" fill="white" fill-opacity=".9"/><circle cx="10" cy="12" r="1.5" fill="#772432"/><circle cx="14" cy="12" r="1.5" fill="#772432"/><circle cx="18" cy="12" r="1.5" fill="#772432"/></svg>',
        '</div>',
        '<div>',
          '<div style="color:#fff;font-weight:700;font-size:18px;line-height:1.2;">Toasty</div>',
          '<div style="color:rgba(255,255,255,.65);font-size:13px;margin-top:3px;">Asistentul Timișoara Toastmasters</div>',
        '</div>',
      '</div>',
    '</div>',
    // Messages
    '<div id="toasty-msgs" aria-live="polite" aria-label="Mesaje Toasty">',
      '<div style="display:flex;gap:10px;align-items:flex-end;">',
        '<div style="width:32px;height:32px;border-radius:10px;background:#772432;display:flex;align-items:center;justify-content:center;flex-shrink:0;"><svg width="16" height="16" viewBox="0 0 28 28" fill="none"><path d="M4 6C4 4.89543 4.89543 4 6 4H22C23.1046 4 24 4.89543 24 6V18C24 19.1046 23.1046 20 22 20H15L9 24V20H6C4.89543 20 4 19.1046 4 18V6Z" fill="white" fill-opacity=".95"/><circle cx="10" cy="12" r="1.5" fill="#772432"/><circle cx="14" cy="12" r="1.5" fill="#772432"/><circle cx="18" cy="12" r="1.5" fill="#772432"/></svg></div>',
        '<div style="background:#f3f4f6;border-radius:18px 18px 18px 4px;padding:12px 16px;max-width:80%;font-size:14px;line-height:1.6;color:#111827;">Bună! 👋 Sunt <b>Toasty</b>.<br>Cu ce te pot ajuta azi?</div>',
      '</div>',
    '</div>',
    // Chips
    '<div id="toasty-chips" style="padding:0 16px 14px;display:flex;flex-wrap:wrap;gap:8px;flex-shrink:0;background:#fff;">',
      '<button onclick="toastySend(\'Când sunt ședințele?\')" style="all:unset;border:1.5px solid #e5e7eb;border-radius:999px;padding:8px 15px;font-size:13px;color:#374151;cursor:pointer;font-weight:500;transition:border-color .15s,color .15s;" onmouseover="this.style.borderColor=\'#772432\';this.style.color=\'#772432\'" onmouseout="this.style.borderColor=\'#e5e7eb\';this.style.color=\'#374151\'">📅 Ședințe</button>',
      '<button onclick="toastySend(\'Cum mă pot înscrie?\')" style="all:unset;border:1.5px solid #e5e7eb;border-radius:999px;padding:8px 15px;font-size:13px;color:#374151;cursor:pointer;font-weight:500;transition:border-color .15s,color .15s;" onmouseover="this.style.borderColor=\'#772432\';this.style.color=\'#772432\'" onmouseout="this.style.borderColor=\'#e5e7eb\';this.style.color=\'#374151\'">✍️ Înscriere</button>',
      '<button onclick="toastySend(\'Pot veni gratuit?\')" style="all:unset;border:1.5px solid #e5e7eb;border-radius:999px;padding:8px 15px;font-size:13px;color:#374151;cursor:pointer;font-weight:500;transition:border-color .15s,color .15s;" onmouseover="this.style.borderColor=\'#772432\';this.style.color=\'#772432\'" onmouseout="this.style.borderColor=\'#e5e7eb\';this.style.color=\'#374151\'">💰 Cost</button>',
      '<button onclick="toastySend(\'Unde se țin ședințele?\')" style="all:unset;border:1.5px solid #e5e7eb;border-radius:999px;padding:8px 15px;font-size:13px;color:#374151;cursor:pointer;font-weight:500;transition:border-color .15s,color .15s;" onmouseover="this.style.borderColor=\'#772432\';this.style.color=\'#772432\'" onmouseout="this.style.borderColor=\'#e5e7eb\';this.style.color=\'#374151\'">📍 Locație</button>',
    '</div>',
    // Input
    '<div style="padding:12px 16px 20px;border-top:1px solid #f0f0f0;display:flex;gap:10px;align-items:center;flex-shrink:0;background:#fff;">',
      '<input id="toasty-input" type="text" placeholder="Scrie un mesaj…" style="flex:1;border:1.5px solid #e5e7eb;border-radius:12px;padding:12px 16px;font-size:14px;outline:none;font-family:Inter,sans-serif;color:#111827;background:#fafafa;transition:border-color .15s,background .15s;" onfocus="this.style.borderColor=\'#772432\';this.style.background=\'#fff\'" onblur="this.style.borderColor=\'#e5e7eb\';this.style.background=\'#fafafa\'" onkeydown="if(event.key===\'Enter\'){event.preventDefault();toastySendInput();}">',
      '<button onclick="toastySendInput()" aria-label="Trimite mesaj" style="all:unset;width:42px;height:42px;border-radius:12px;background:#772432;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;box-shadow:0 2px 8px rgba(119,36,50,.3);transition:transform .15s,box-shadow .15s;" onmouseover="this.style.transform=\'scale(1.06)\';this.style.boxShadow=\'0 4px 16px rgba(119,36,50,.4)\'" onmouseout="this.style.transform=\'\';this.style.boxShadow=\'0 2px 8px rgba(119,36,50,.3)\'">',
        '<svg width="18" height="18" fill="none" stroke="white" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>',
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
      setTimeout(function () { document.getElementById('toasty-input').focus(); }, 380);
    } else {
      window.toastyClose();
    }
  });

  overlay.addEventListener('click', window.toastyClose);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen) window.toastyClose();
  });

  /* ── iOS keyboard ── */
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

  /* ── Mesaje ── */
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
      ? '<div style="width:32px;height:32px;border-radius:10px;background:#772432;display:flex;align-items:center;justify-content:center;flex-shrink:0;"><svg width="16" height="16" viewBox="0 0 28 28" fill="none"><path d="M4 6C4 4.89543 4.89543 4 6 4H22C23.1046 4 24 4.89543 24 6V18C24 19.1046 23.1046 20 22 20H15L9 24V20H6C4.89543 20 4 19.1046 4 18V6Z" fill="white" fill-opacity=".95"/><circle cx="10" cy="12" r="1.5" fill="#772432"/><circle cx="14" cy="12" r="1.5" fill="#772432"/><circle cx="18" cy="12" r="1.5" fill="#772432"/></svg></div>'
      : '';
    var bg, clr, br;
    if (role === 'user') {
      bg  = '#772432';
      clr = '#fff';
      br  = '18px 18px 4px 18px';
    } else {
      bg  = '#f3f4f6';
      clr = '#111827';
      br  = '18px 18px 18px 4px';
    }
    row.innerHTML = avatar + '<div style="background:' + bg + ';color:' + clr + ';border-radius:' + br + ';padding:12px 16px;max-width:78%;font-size:14px;line-height:1.6;">' + esc(text) + '</div>';
    msgs.appendChild(row);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function addLoading() {
    var msgs = document.getElementById('toasty-msgs');
    var id   = 'tld' + Date.now();
    var row  = document.createElement('div');
    row.id   = id;
    row.style.cssText = 'display:flex;gap:10px;align-items:flex-end;';
    row.innerHTML = '<div style="width:32px;height:32px;border-radius:10px;background:#772432;display:flex;align-items:center;justify-content:center;flex-shrink:0;"><svg width="16" height="16" viewBox="0 0 28 28" fill="none"><path d="M4 6C4 4.89543 4.89543 4 6 4H22C23.1046 4 24 4.89543 24 6V18C24 19.1046 23.1046 20 22 20H15L9 24V20H6C4.89543 20 4 19.1046 4 18V6Z" fill="white" fill-opacity=".95"/><circle cx="10" cy="12" r="1.5" fill="#772432"/><circle cx="14" cy="12" r="1.5" fill="#772432"/><circle cx="18" cy="12" r="1.5" fill="#772432"/></svg></div><div style="background:#f3f4f6;border-radius:18px 18px 18px 4px;padding:14px 16px;display:flex;gap:5px;align-items:center;"><span style="width:7px;height:7px;background:#9ca3af;border-radius:50%;animation:toastyDot 1.2s infinite"></span><span style="width:7px;height:7px;background:#9ca3af;border-radius:50%;animation:toastyDot 1.2s infinite .2s"></span><span style="width:7px;height:7px;background:#9ca3af;border-radius:50%;animation:toastyDot 1.2s infinite .4s"></span></div>';
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
