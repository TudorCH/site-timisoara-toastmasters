// Accessibility panel: a tab on the left edge of every page that opens display and reading settings.
// Dark mode (tm-theme) and the other settings (tm-a11y: text size, contrast, readable font, spacing,
// underlined links, no animations) are applied as classes on <html>. The inline script in each
// page's <head> applies the saved ones before the page paints; this file builds the panel.
(function () {
  var root = document.documentElement;
  var KEY = 'tm-a11y';
  var FONT_URL = 'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&display=swap';
  var T = function (ro, en) { return window.tmtStr ? window.tmtStr(ro, en) : ro; };

  var state = {};
  try { state = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) {}
  var save = function () { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} };

  // ── applying settings ──
  function loadFont() {
    if (document.getElementById('a11y-font-css')) return;
    var l = document.createElement('link');
    l.id = 'a11y-font-css'; l.rel = 'stylesheet'; l.href = FONT_URL;
    document.head.appendChild(l);
  }
  function apply() {
    root.classList.remove('a11y-text-1', 'a11y-text-2');
    if (state.text) root.classList.add('a11y-text-' + state.text);
    ['contrast', 'font', 'spacing', 'links', 'motion'].forEach(function (k) { root.classList.toggle('a11y-' + k, !!state[k]); });
    if (state.font) loadFont();
    sync();
  }
  function setTheme(dark) {
    root.classList.toggle('theme-dark', dark);
    try { localStorage.setItem('tm-theme', dark ? 'dark' : 'light'); } catch (e) {}
    sync();
  }
  window.tmToggleTheme = function () { setTheme(!root.classList.contains('theme-dark')); };

  // ── panel ──
  var ICON = {
    a11y: '<circle cx="12" cy="4.5" r="2"/><path d="M5 8.5l7 1.5 7-1.5M12 10v4.5M12 14.5l-3 6M12 14.5l3 6"/>',
    theme: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
    tts: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"/>',
    text: '<path d="M4 7V5h11v2M9.5 5v14M7 19h5M14 13v-1.5h7V13M17.5 11.5V19M16 19h3"/>',
    contrast: '<circle cx="12" cy="12" r="9"/><path d="M12 3v18a9 9 0 0 0 0-18z" fill="currentColor"/>',
    font: '<path d="M4 20l6-16h1l6 16M6.5 14h9"/><path d="M19 20v-6"/>',
    spacing: '<path d="M4 6h16M4 12h16M4 18h16"/><path d="M2 9l2-3 2 3M2 15l2 3 2-3"/>',
    links: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/><path d="M4 22h16"/>',
    motion: '<circle cx="12" cy="12" r="9"/><path d="M10 9v6M14 9v6"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>',
    moon: '<path d="M20 13.5A8 8 0 1 1 10.5 4a6.2 6.2 0 0 0 9.5 9.5z"/><path d="M17 3.5v3M15.5 5h3M20.5 8.5v2M19.5 9.5h2"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    reset: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
  };
  var svg = function (k, cls) { return '<svg class="' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON[k] + '</svg>'; };
  // Glide switch: the round knob carries the icon (sun → moon for the theme, a tick for the rest).
  var glide = function (key) {
    var knob = key === 'theme' ? svg('sun', 'ic-off') + svg('moon', 'ic-on') : svg('check', 'ic-on');
    return '<span class="tm-glide' + (key === 'theme' ? ' tm-glide-theme' : '') + '"><span class="tm-glide-knob">' + knob + '</span></span>';
  };
  var sw = function (key, ico, title, sub) {
    return '<button type="button" role="switch" aria-checked="false" class="a11y-row" data-a11y="' + key + '">' + svg(ico, 'a11y-ico') +
      '<span class="a11y-txt"><b>' + title + '</b>' + (sub ? '<small>' + sub + '</small>' : '') + '</span>' + glide(key) + '</button>';
  };

  var tab, panel;
  function render() {
    panel.innerHTML =
      '<div class="a11y-head"><h2 id="a11y-title">' + T('Accesibilitate', 'Accessibility') + '</h2>' +
        '<button type="button" class="a11y-x" data-a11y-close aria-label="' + T('Închide', 'Close') + '">' + svg('close') + '</button></div>' +
      '<div class="a11y-body">' +
        '<p class="a11y-group">' + T('Afișare', 'Display') + '</p>' +
        sw('theme', 'theme', T('Mod întunecat', 'Dark mode')) +
        '<div class="a11y-row a11y-static">' + svg('text', 'a11y-ico') + '<span class="a11y-txt"><b>' + T('Mărime text', 'Text size') + '</b></span>' +
          '<span class="a11y-seg" role="group" aria-label="' + T('Mărime text', 'Text size') + '">' +
            '<button type="button" data-text="0" aria-label="' + T('Normal', 'Normal') + '">A</button>' +
            '<button type="button" data-text="1" aria-label="' + T('Mare', 'Large') + '">A+</button>' +
            '<button type="button" data-text="2" aria-label="' + T('Foarte mare', 'Extra large') + '">A++</button></span></div>' +
        sw('contrast', 'contrast', T('Contrast mare', 'High contrast'), T('Text și margini mai clare', 'Sharper text and borders')) +
        '<p class="a11y-group">' + T('Citire', 'Reading') + '</p>' +
        '<button type="button" class="a11y-row" data-tts-btn data-a11y-tts>' + svg('tts', 'a11y-ico') +
          '<span class="a11y-txt"><b>' + T('Citește pagina cu voce', 'Read the page aloud') + '</b><small>' + T('Scurtătură: Alt + T', 'Shortcut: Alt + T') + '</small></span>' +
          '<span class="a11y-go" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span></button>' +
        sw('font', 'font', T('Font ușor de citit', 'Easy-to-read font'), T('Litere mai distincte', 'More distinct letters')) +
        sw('spacing', 'spacing', T('Spațiere mai mare', 'More spacing'), T('Între rânduri și litere', 'Between lines and letters')) +
        sw('links', 'links', T('Subliniază linkurile', 'Underline links')) +
        '<p class="a11y-group">' + T('Mișcare', 'Motion') + '</p>' +
        sw('motion', 'motion', T('Oprește animațiile', 'Stop animations'), T('Fără slider automat și efecte', 'No auto slider or effects')) +
      '</div>' +
      '<div class="a11y-foot"><button type="button" class="a11y-reset" data-a11y-reset>' + svg('reset') + T('Resetează setările', 'Reset settings') + '</button></div>';
    tab.setAttribute('aria-label', T('Accesibilitate', 'Accessibility'));
    tab.title = T('Accesibilitate', 'Accessibility');
    sync();
  }

  function sync() {
    if (!panel) return;
    var dark = root.classList.contains('theme-dark');
    panel.querySelectorAll('[data-a11y]').forEach(function (b) {
      var k = b.getAttribute('data-a11y');
      b.setAttribute('aria-checked', String(k === 'theme' ? dark : !!state[k]));
    });
    panel.querySelectorAll('[data-text]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(Number(b.getAttribute('data-text')) === (state.text || 0)));
    });
  }

  function open() {
    panel.hidden = false;
    tab.setAttribute('aria-expanded', 'true');
    root.classList.add('a11y-open');
    setTimeout(function () { panel.focus(); }, 0);   // the dialog itself, so no button looks pressed
  }
  function close(focusTab) {
    panel.hidden = true;
    tab.setAttribute('aria-expanded', 'false');
    root.classList.remove('a11y-open');
    if (focusTab) tab.focus();
  }

  function build() {
    tab = document.createElement('button');
    tab.type = 'button';
    tab.id = 'a11y-tab';
    tab.setAttribute('aria-expanded', 'false');
    tab.setAttribute('aria-controls', 'a11y-panel');
    tab.innerHTML = svg('a11y');
    panel = document.createElement('div');
    panel.id = 'a11y-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-labelledby', 'a11y-title');
    panel.tabIndex = -1;
    panel.hidden = true;
    document.body.appendChild(tab);
    document.body.appendChild(panel);
    render();

    tab.addEventListener('click', function () { panel.hidden ? open() : close(); });
    panel.addEventListener('click', function (e) {
      var t = e.target.closest('button'); if (!t) return;
      if (t.hasAttribute('data-a11y-close')) return close(true);
      if (t.hasAttribute('data-a11y-reset')) { state = {}; save(); apply(); setTheme(false); return; }
      if (t.hasAttribute('data-a11y-tts')) return close();   // tts.js handles the click itself
      if (t.hasAttribute('data-text')) { state.text = Number(t.getAttribute('data-text')) || 0; save(); return apply(); }
      var k = t.getAttribute('data-a11y'); if (!k) return;
      if (k === 'theme') return window.tmToggleTheme();
      state[k] = !state[k]; save(); apply();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) close(true); });
    document.addEventListener('click', function (e) {
      if (!panel.hidden && !panel.contains(e.target) && !tab.contains(e.target)) close();
    });

    // relabel when the language changes
    var prev = window.setLang;
    if (typeof prev === 'function') window.setLang = function (l) { prev(l); render(); };
  }

  apply();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
