(function () {
  var KEY = 'tm-cookie-consent';
  if (localStorage.getItem(KEY)) return;

  var css = document.createElement('style');
  css.textContent = `
    #tm-cookie-overlay {
      position: fixed; inset: 0; z-index: 99999;
      background: rgba(0,0,0,.55);
      backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center;
      padding: 16px;
      opacity: 0; transition: opacity .35s ease;
    }
    #tm-cookie-overlay.visible { opacity: 1; }

    #tm-cookie-modal {
      background: #fff;
      border-radius: 24px;
      box-shadow: 0 24px 80px rgba(0,0,0,.25);
      max-width: 460px; width: 100%;
      padding: 36px 32px 28px;
      transform: translateY(28px) scale(.97);
      transition: transform .35s cubic-bezier(.34,1.56,.64,1);
      font-family: Inter, sans-serif;
    }
    #tm-cookie-overlay.visible #tm-cookie-modal {
      transform: translateY(0) scale(1);
    }

    #tm-cookie-modal .tm-cookie-icon {
      width: 56px; height: 56px; border-radius: 16px;
      background: linear-gradient(135deg,#002d47,#004165);
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 20px;
    }
    #tm-cookie-modal h2 {
      font-family: 'Plus Jakarta Sans', Inter, sans-serif;
      font-size: 1.35rem; font-weight: 800; color: #004165;
      margin: 0 0 10px;
    }
    #tm-cookie-modal p {
      font-size: .9rem; line-height: 1.65; color: #6b7280;
      margin: 0 0 24px;
    }
    #tm-cookie-modal p a {
      color: #004165; font-weight: 600; text-decoration: underline;
    }

    #tm-cookie-modal .tm-btns {
      display: flex; flex-direction: column; gap: 10px;
    }
    #tm-cb-accept-all {
      background: #772432; color: #fff;
      border: none; border-radius: 999px;
      padding: 14px 24px; font-size: .95rem; font-weight: 700;
      cursor: pointer; font-family: inherit; width: 100%;
      transition: background .2s, transform .15s;
    }
    #tm-cb-accept-all:hover { background: #8c2b3b; transform: scale(1.02); }

    #tm-cb-essential {
      background: transparent; color: #004165;
      border: 2px solid #004165; border-radius: 999px;
      padding: 12px 24px; font-size: .9rem; font-weight: 600;
      cursor: pointer; font-family: inherit; width: 100%;
      transition: background .2s, color .2s;
    }
    #tm-cb-essential:hover { background: #004165; color: #fff; }

    #tm-cookie-modal .tm-cookie-note {
      text-align: center; margin-top: 16px;
      font-size: .78rem; color: #9ca3af;
    }
    #tm-cookie-modal .tm-cookie-note a {
      color: #9ca3af; text-decoration: underline;
    }

    @media (max-width: 480px) {
      #tm-cookie-modal { padding: 28px 20px 22px; border-radius: 20px; }
      #tm-cookie-modal h2 { font-size: 1.2rem; }
    }
  `;
  document.head.appendChild(css);

  var overlay = document.createElement('div');
  overlay.id = 'tm-cookie-overlay';
  overlay.innerHTML = `
    <div id="tm-cookie-modal" role="dialog" aria-modal="true" aria-labelledby="tm-cookie-title">
      <div class="tm-cookie-icon">
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="rgba(242,223,116,.15)" stroke="#F2DF74" stroke-width="1.5"/>
          <circle cx="8.5"  cy="9"    r="1.2" fill="#F2DF74"/>
          <circle cx="14.5" cy="8"    r="1.2" fill="#F2DF74"/>
          <circle cx="10"   cy="13.5" r="1.2" fill="#F2DF74"/>
          <circle cx="15"   cy="13"   r="1"   fill="#F2DF74"/>
          <circle cx="8.5"  cy="14.5" r=".8"  fill="#F2DF74"/>
        </svg>
      </div>
      <h2 id="tm-cookie-title">Respectăm confidențialitatea ta 🍪</h2>
      <p>Folosim cookie-uri esențiale pentru a asigura funcționarea corectă a site-ului și pentru a reține preferințele tale. Nu urmărim activitatea ta și nu partajăm date cu terți în scopuri publicitare.</p>
      <div class="tm-btns">
        <button id="tm-cb-accept-all">Acceptă toate cookie-urile</button>
        <button id="tm-cb-essential">Doar esențiale</button>
      </div>
      <p class="tm-cookie-note">
        <a href="cookies.html">Politică cookies</a> &nbsp;·&nbsp; poți modifica oricând preferințele din browser
      </p>
    </div>
  `;
  document.body.appendChild(overlay);

  // Animate in
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { overlay.classList.add('visible'); });
  });

  function dismiss(value) {
    localStorage.setItem(KEY, value);
    overlay.style.opacity = '0';
    setTimeout(function () { overlay.remove(); }, 350);
  }

  document.getElementById('tm-cb-accept-all').addEventListener('click', function () { dismiss('all'); });
  document.getElementById('tm-cb-essential').addEventListener('click',  function () { dismiss('essential'); });

  // Close on backdrop click
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) dismiss('essential');
  });
})();
