/* ════════════════════════════════════════════════
   TOASTY — Chatbot flotant Timișoara Toastmasters
   Ascunde butonul când footer-ul e vizibil.
   ════════════════════════════════════════════════ */
(function () {

  /* ── CSS ── */
  var css = document.createElement('style');
  css.textContent = [
    '@keyframes toastyDot{0%,80%,100%{transform:scale(.6);opacity:.4}40%{transform:scale(1);opacity:1}}',
    '#toasty-btn{all:unset;position:fixed!important;bottom:20px!important;right:16px!important;z-index:2147483647!important;width:56px;height:56px;border-radius:50%;cursor:pointer;background:linear-gradient(135deg,#004165,#00537f);box-shadow:0 4px 20px rgba(0,65,101,.45);display:flex!important;align-items:center;justify-content:center;transition:background .25s,transform .2s,box-shadow .2s,opacity .3s,visibility .3s;}',
    '#toasty-btn:hover{transform:scale(1.1);box-shadow:0 6px 28px rgba(0,65,101,.55);}',
    '#toasty-btn.open{background:#F2DF74!important;box-shadow:0 4px 20px rgba(242,223,116,.5)!important;}',
    '#toasty-btn.hidden-by-footer{opacity:0!important;visibility:hidden!important;pointer-events:none!important;}',
    '#toasty-win{position:fixed!important;bottom:88px!important;right:16px!important;z-index:2147483646!important;width:calc(100vw - 32px);max-width:320px;background:#fff;border-radius:20px;box-shadow:0 8px 40px rgba(0,0,0,.18);display:none;flex-direction:column;overflow:hidden;font-family:Inter,sans-serif;transition:opacity .25s,transform .25s;}',
    '@media(min-width:640px){#toasty-btn{bottom:28px!important;right:28px!important;width:64px;height:64px;}#toasty-win{bottom:108px!important;right:28px!important;max-width:360px;}#toasty-msgs{max-height:300px!important;min-height:180px!important;}}'
  ].join('');
  document.head.appendChild(css);

  /* ── HTML ── */
  var iconBot = '<svg id="ti-chat" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5V20.7929C3 21.2383 3.53857 21.4614 3.85355 21.1464L7.70711 17.2929C7.89464 17.1054 8.149 17 8.41421 17H19C20.1046 17 21 16.1046 21 15V5C21 3.89543 20.1046 3 19 3H5C3.89543 3 3 3.89543 3 5Z"/><path d="M15 12C14.2005 12.6224 13.1502 13 12 13C10.8498 13 9.79952 12.6224 9 12"/><path d="M9 8.01953V8"/><path d="M15 8.01953V8"/></svg>';
  var iconX   = '<svg id="ti-x" width="22" height="22" fill="none" stroke="#004165" stroke-width="2.5" viewBox="0 0 24 24" style="display:none"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>';

  var btn = document.createElement('button');
  btn.id    = 'toasty-btn';
  btn.title = 'Întreabă-l pe Toasty';
  btn.innerHTML = iconBot + iconX;
  document.body.appendChild(btn);

  var win = document.createElement('div');
  win.id = 'toasty-win';
  win.innerHTML = [
    '<div style="background:linear-gradient(135deg,#004165,#00537f);padding:14px 16px;display:flex;align-items:center;gap:10px;">',
      '<div style="width:36px;height:36px;border-radius:50%;background:rgba(242,223,116,.2);border:2px solid rgba(242,223,116,.4);display:flex;align-items:center;justify-content:center;flex-shrink:0;">',
        '<svg width="18" height="18" fill="none" stroke="#F2DF74" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>',
      '</div>',
      '<div><div style="color:#fff;font-weight:700;font-size:15px;">Toasty</div><div style="color:rgba(242,223,116,.85);font-size:11px;">Asistentul Timișoara Toastmasters</div></div>',
      '<div style="margin-left:auto;display:flex;align-items:center;gap:5px;"><span style="width:8px;height:8px;background:#4ade80;border-radius:50%;display:block;"></span><span style="color:rgba(255,255,255,.55);font-size:11px;">Online</span></div>',
    '</div>',
    '<div id="toasty-msgs" style="overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px;max-height:220px;min-height:120px;">',
      '<div style="display:flex;gap:8px;align-items:flex-end;">',
        '<div style="width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,#004165,#00537f);display:flex;align-items:center;justify-content:center;flex-shrink:0;"><svg width="13" height="13" fill="none" stroke="#F2DF74" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg></div>',
        '<div style="background:#f3f4f6;border-radius:16px 16px 16px 4px;padding:10px 13px;max-width:82%;font-size:13.5px;line-height:1.5;color:#1f2937;">Bună! 👋 Sunt <b>Toasty</b>, asistentul Timișoara Toastmasters.<br>Cu ce te pot ajuta?</div>',
      '</div>',
    '</div>',
    '<div id="toasty-chips" style="padding:0 12px 10px;display:flex;flex-wrap:wrap;gap:6px;">',
      '<button onclick="toastySend(\'Când sunt ședințele?\')" style="all:unset;background:#f0f4f8;border:1px solid #e2e8f0;border-radius:999px;padding:5px 11px;font-size:12px;color:#004165;cursor:pointer;">📅 Ședințe</button>',
      '<button onclick="toastySend(\'Cum mă pot înscrie?\')" style="all:unset;background:#f0f4f8;border:1px solid #e2e8f0;border-radius:999px;padding:5px 11px;font-size:12px;color:#004165;cursor:pointer;">✍️ Înscriere</button>',
      '<button onclick="toastySend(\'Este prima ședință gratuită?\')" style="all:unset;background:#f0f4f8;border:1px solid #e2e8f0;border-radius:999px;padding:5px 11px;font-size:12px;color:#004165;cursor:pointer;">💰 Cost</button>',
      '<button onclick="toastySend(\'Unde se țin ședințele?\')" style="all:unset;background:#f0f4f8;border:1px solid #e2e8f0;border-radius:999px;padding:5px 11px;font-size:12px;color:#004165;cursor:pointer;">📍 Locație</button>',
    '</div>',
    '<div style="padding:10px 12px;border-top:1px solid #f0f0f0;display:flex;gap:8px;align-items:center;">',
      '<input id="toasty-input" type="text" placeholder="Scrie un mesaj…" style="flex:1;border:1px solid #e5e7eb;border-radius:999px;padding:8px 15px;font-size:13.5px;outline:none;font-family:Inter,sans-serif;color:#1f2937;" onkeydown="if(event.key===\'Enter\'){event.preventDefault();toastySendInput();}">',
      '<button onclick="toastySendInput()" style="all:unset;width:34px;height:34px;border-radius:50%;background:#004165;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;"><svg width="15" height="15" fill="none" stroke="white" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg></button>',
    '</div>'
  ].join('');
  document.body.appendChild(win);

  /* ── Logică toggle ── */
  var isOpen = false, isLoading = false, chatHistory = [];

  function closeChat() {
    isOpen = false;
    btn.classList.remove('open');
    document.getElementById('ti-chat').style.display = 'block';
    document.getElementById('ti-x').style.display    = 'none';
    win.style.opacity   = '0';
    win.style.transform = 'translateY(12px)';
    setTimeout(function () { win.style.display = 'none'; }, 250);
  }

  btn.addEventListener('click', function () {
    isOpen = !isOpen;
    btn.classList.toggle('open', isOpen);
    document.getElementById('ti-chat').style.display = isOpen ? 'none' : 'block';
    document.getElementById('ti-x').style.display    = isOpen ? 'block' : 'none';
    if (isOpen) {
      win.style.display   = 'flex';
      win.style.opacity   = '0';
      win.style.transform = 'translateY(12px)';
      setTimeout(function () { win.style.opacity = '1'; win.style.transform = 'translateY(0)'; }, 10);
      document.getElementById('toasty-input').focus();
    } else {
      closeChat();
    }
  });

  /* ── Ascunde când footer-ul e vizibil ── */
  var footer = document.querySelector('footer');
  if (footer && 'IntersectionObserver' in window) {
    var footerObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          btn.classList.add('hidden-by-footer');
          if (isOpen) closeChat();
        } else {
          btn.classList.remove('hidden-by-footer');
        }
      });
    }, { threshold: 0.05 });
    footerObs.observe(footer);
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
    var msgs   = document.getElementById('toasty-msgs');
    var row    = document.createElement('div');
    row.style.cssText = 'display:flex;gap:8px;align-items:flex-end;' + (role === 'user' ? 'flex-direction:row-reverse;' : '');
    var avatar = role === 'bot' ? '<div style="width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,#004165,#00537f);display:flex;align-items:center;justify-content:center;flex-shrink:0;"><svg width="13" height="13" fill="none" stroke="#F2DF74" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg></div>' : '';
    var bg  = role === 'user' ? '#004165' : '#f3f4f6';
    var clr = role === 'user' ? 'white'   : '#1f2937';
    var br  = role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px';
    row.innerHTML = avatar + '<div style="background:' + bg + ';color:' + clr + ';border-radius:' + br + ';padding:10px 13px;max-width:82%;font-size:13.5px;line-height:1.5;">' + esc(text) + '</div>';
    msgs.appendChild(row);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function addLoading() {
    var msgs = document.getElementById('toasty-msgs');
    var id   = 'tld' + Date.now();
    var row  = document.createElement('div');
    row.id   = id;
    row.style.cssText = 'display:flex;gap:8px;align-items:flex-end;';
    row.innerHTML = '<div style="width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,#004165,#00537f);display:flex;align-items:center;justify-content:center;flex-shrink:0;"><svg width="13" height="13" fill="none" stroke="#F2DF74" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg></div><div style="background:#f3f4f6;border-radius:16px 16px 16px 4px;padding:12px 14px;display:flex;gap:4px;align-items:center;"><span style="width:7px;height:7px;background:#9ca3af;border-radius:50%;animation:toastyDot 1.2s infinite"></span><span style="width:7px;height:7px;background:#9ca3af;border-radius:50%;animation:toastyDot 1.2s infinite .2s"></span><span style="width:7px;height:7px;background:#9ca3af;border-radius:50%;animation:toastyDot 1.2s infinite .4s"></span></div>';
    msgs.appendChild(row);
    msgs.scrollTop = msgs.scrollHeight;
    return id;
  }

  function rmLoading(id) { var el = document.getElementById(id); if (el) el.remove(); }
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>'); }

})();
