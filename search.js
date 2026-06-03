// ═══════════════════════════════════════════════
//  Shared site-wide search  (all pages)
// ═══════════════════════════════════════════════
(function () {

  // Static cross-page index
  const STATIC = [
    { label: 'Acasă',                  url: 'index.html',                  q: 'acasa toastmasters timisoara club discursuri public speaking vorbit' },
    { label: 'De ce Toastmasters',     url: 'index.html#de-ce',            q: 'de ce comunicare vorbit public impact emotii leadership networking beneficii' },
    { label: 'Parcursul tău',          url: 'index.html#journey-section',  q: 'calatorie cum functioneaza pathways roluri discurs evaluare progres invitat membru pasi' },
    { label: 'Galerie Foto',           url: 'galerie.html',                q: 'galerie foto poze fotografii sedinte concursuri' },
    { label: 'Testimoniale & Recenzii',url: 'index.html#testimoniale',     q: 'recenzii opinii testimoniale feedback membri pareri facebook google' },
    { label: 'Program & Înscriere',    url: 'contact.html',                q: 'sedinte program calendar orar agenda urmatoarea sedinta miercuri inscriere formular' },
    { label: 'Despre noi',             url: 'despre-noi.html',             q: 'despre noi toastmasters misiune viziune poveste valori integritate respect serviciu excelenta' },
    { label: 'O seară tipică',         url: 'despre-noi.html#section-eve', q: 'sedinta seara discursuri improvizate table topics feedback roluri toastmaster cum arata' },
    { label: 'Conducere & Echipă',     url: 'despre-noi.html#conducere',   q: 'conducere echipa board presedinte secretar vice lider trezorier sergent' },
    { label: 'Contact',                url: 'contact.html',                q: 'contact adresa harta locatie directii cowork office calea aradului' },
  ];

  let idx = STATIC.map(e => ({ label: e.label, url: e.url, text: e.q }));

  function buildIndex() {
    const page = (window.location.pathname.split('/').pop() || 'index.html');

    const labelMap = {
      'de-ce':           'De ce Toastmasters',
      'journey-section': 'Parcursul tău',
      'galerie':         'Galerie Foto',
      'testimoniale':    'Testimoniale & Recenzii',
      'contact':         'Program & Înscriere',
      'section-eve':     'O seară tipică',
      'conducere':       'Conducere & Echipă',
    };

    document.querySelectorAll('section[id], div[id]').forEach(sec => {
      const anchor = '#' + sec.id;
      const url    = page + anchor;
      if (idx.some(i => i.url === url)) return;
      const heading = sec.querySelector('h1,h2,h3');
      const label   = labelMap[sec.id] || (heading ? heading.textContent.trim() : sec.id);
      const text    = (sec.textContent || '').toLowerCase().replace(/\s+/g, ' ');
      if (text.length > 10) idx.push({ label, url, text });
    });

    // Index board member cards
    document.querySelectorAll('#conducere .leader-card').forEach(card => {
      const name = card.querySelector('.font-semibold')?.textContent?.trim() || '';
      const role = card.querySelector('.text-maroon')?.textContent?.trim() || '';
      if (name) idx.push({
        label: name + (role ? ' · ' + role : ''),
        url:   page + '#conducere',
        text:  (name + ' ' + role).toLowerCase()
      });
    });
  }

  // ── Search logic ────────────────────────────────────

  function liveSearch(q, source) {
    source = source || 'desktop';
    const ddId = source === 'mobile' ? 'mobile-search-dropdown' : 'search-dropdown';
    const dd = document.getElementById(ddId);
    if (!dd) return;
    q = q.trim().toLowerCase();
    if (q.length < 2) { dd.classList.add('hidden'); return; }

    const words = q.split(/\s+/).filter(w => w.length >= 2);
    const scored = idx.map(item => {
      const ll = item.label.toLowerCase();
      let score = 0;
      words.forEach(w => { if (ll.includes(w)) score += 4; if (item.text.includes(w)) score += 1; });
      return { ...item, score };
    }).filter(i => i.score > 0);

    const best = new Map();
    scored.forEach(i => { if (!best.has(i.url) || i.score > best.get(i.url).score) best.set(i.url, i); });
    const hits = Array.from(best.values()).sort((a, b) => b.score - a.score).slice(0, 7);

    if (!hits.length) {
      dd.innerHTML = '<div class="px-4 py-3 text-sm text-gray-400">Niciun rezultat găsit.</div>';
    } else {
      dd.innerHTML = hits.map(h => `
        <button onclick="siteGoTo('${h.url}','${source}')"
          class="w-full text-left px-4 py-3 hover:bg-primary/5 flex items-center gap-3 border-b border-gray-50 last:border-0 transition-colors">
          <svg class="w-4 h-4 text-maroon flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
          <span class="text-sm text-gray-700 font-medium">${h.label}</span>
        </button>`).join('');
    }
    dd.classList.remove('hidden');
  }

  function siteGoTo(url, source) {
    closeSearch();
    ['search-input', 'mobile-search-input'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    if (source === 'mobile') {
      const ms = document.getElementById('mobile-search');
      if (ms) ms.classList.add('hidden');
    }

    const page       = window.location.pathname.split('/').pop() || 'index.html';
    const parts      = url.split('#');
    const targetPage = parts[0] || 'index.html';
    const hash       = parts[1];

    if (page === targetPage || (page === '' && targetPage === 'index.html')) {
      if (hash) {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      window.location.href = url;
    }
  }

  function closeSearch() {
    ['search-dropdown', 'mobile-search-dropdown'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });
  }

  document.addEventListener('click', e => {
    if (!e.target.closest('#search-input') && !e.target.closest('#search-dropdown') &&
        !e.target.closest('#mobile-search-input') && !e.target.closest('#mobile-search-dropdown')) {
      closeSearch();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSearch();
  });

  window.liveSearch  = liveSearch;
  window.closeSearch = closeSearch;
  window.siteGoTo    = siteGoTo;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildIndex);
  } else {
    buildIndex();
  }
})();
