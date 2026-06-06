/* ════════════════════════════════════════════════
   i18n — RO / EN language switcher
   ════════════════════════════════════════════════ */
(function () {

  /* ── Inject CSS for lang buttons ── */
  var css = document.createElement('style');
  css.textContent =
    '.lang-btn{padding:3px 10px;border-radius:999px;font-size:11px;font-weight:600;' +
    'color:rgba(255,255,255,.5);transition:all .2s ease;cursor:pointer;' +
    'background:transparent;border:none;line-height:1.4;}' +
    '.lang-btn:hover{color:rgba(255,255,255,.85);}' +
    '.lang-btn.active{background:white;color:#004165;font-weight:700;}';
  document.head.appendChild(css);

  /* ── English translations (RO is already in the HTML) ── */
  var T = {
    /* ─ Nav / shared ─ */
    'nav-home':        'Home',
    'nav-about':       'About us',
    'nav-gallery':     'Gallery',
    'nav-contact':     'Contact',
    'nav-cta':         'Join a meeting',
    'nav-util-label':  'Language:',
    'skip-link':       'Skip to content',

    /* ─ Footer ─ */
    'footer-nav-title':      'Useful pages',
    'footer-nav-home':       'Home',
    'footer-nav-about':      'About us',
    'footer-nav-gallery':    'Gallery',
    'footer-nav-contact':    'Contact',
    'footer-legal-title':    'Legal',
    'footer-legal-cookies':  'Cookie policy',
    'footer-legal-privacy':  'Privacy policy',
    'footer-legal-gdpr':     'GDPR',
    'footer-desc':           'Timișoara Toastmasters Club — a safe space for practice, feedback and growth in communication and public speaking, part of the global Toastmasters International network.',
    'footer-desc-mobile':    'A public speaking club in Timișoara, part of the global Toastmasters network.',
    'footer-copyright':      '© 2026 Timișoara Toastmasters Club. All rights reserved.',
    'footer-network':        'Part of the global network',
    'footer-disclaimer':     'The information on this site is intended solely for Toastmasters members, for Toastmasters activities. It may not be used for non-Toastmasters solicitations or distribution of materials and information.',

    /* ─ Index: Hero ─ */
    'idx-hero-line1':  'Public Speaking',
    'idx-hero-line2':  'in Timișoara',
    'idx-hero-desc':   'Every Wednesday evening, people from Timișoara gather to speak, receive honest feedback, and grow. Attendance as a guest is free.',
    'idx-cta1':        'Join a meeting!',
    'idx-cta2':        'See how it works',
    'idx-proof1':      'Member since 2008',
    'idx-proof2':      '#1 Club in Romania',
    'idx-stat1':       'years active',
    'idx-stat2':       'excellence awards',
    'idx-stat3':       'clubs worldwide',

    /* ─ Index: De ce noi ─ */
    'idx-dece-badge':   'Why us?',
    'idx-dece-h2':      'Why Timișoara Toastmasters?',
    'idx-dece-p':       'Effective communication is not an innate talent — it is a skill that can be learned and practiced.',
    'idx-card1-title':  'Communication & Impact',
    'idx-card1-body':   'At every meeting you give or listen to a speech. You don\'t read about communication — you practice it.',
    'idx-card2-title':  'Managing Nerves',
    'idx-card2-body':   'Speaking in front of a group is a skill. Members who were shaking at their first speech now speak confidently in any context.',
    'idx-card3-title':  'Personal Development',
    'idx-card3-body':   'You take on small and big roles at your own pace. Every meeting adds a concrete skill.',
    'idx-card4-title':  'Leadership & Networking',
    'idx-card4-body':   'You meet people who work, build, and learn. Real relationships built over time, not just LinkedIn connections.',

    /* ─ Index: Journey ─ */
    'idx-jrn-badge':    'Your Journey',
    'idx-jrn-h2':       'What your Toastmasters journey looks like',
    'idx-jrn-p':        'From your first meeting as a guest to recognized leader, every step is supported by the community.',
    'idx-jrn0-mob':     'Guest',
    'idx-jrn0-full':    'Come as<br>a guest',
    'idx-jrn1-mob':     'Member',
    'idx-jrn1-full':    'Become<br>a member',
    'idx-jrn2-mob':     'Roles',
    'idx-jrn2-full':    'First<br>roles',
    'idx-jrn4-mob':     'Leader',
    'idx-jrn4-full':    'Performance<br>& Leadership',
    'idx-panel0-step':  'Step 1',
    'idx-panel0-title': 'Come as a guest',
    'idx-panel0-body':  'You attend a meeting, observe how everything works and speak with members. Zero pressure — attending as a guest is completely free, with no commitment.',
    'idx-panel1-step':  'Step 2',
    'idx-panel1-title': 'Become an official member',
    'idx-panel1-body':  'You officially become a member of the club and Toastmasters International network, with full access to the Pathways platform and all development resources.',
    'idx-panel2-step':  'Step 3',
    'idx-panel2-title': 'Gradual involvement',
    'idx-panel2-body':  'You take on small roles at meetings — timer, grammar evaluator, filler-word counter — at your own pace, without pressure.',
    'idx-panel3-step':  'Step 4',
    'idx-panel3-title': 'Pathways + Mentoring',
    'idx-panel3-body':  'You follow a personalized curriculum of speeches and leadership projects, guided by an experienced mentor who helps you advance with confidence.',
    'idx-panel4-step':  'Step 5',
    'idx-panel4-title': 'Performance & Leadership',
    'idx-panel4-body':  'You compete in public speaking contests, lead teams, and inspire others. You become a role model for new members and contribute to the club\'s growth.',

    /* ─ Index: Gallery teaser ─ */
    'idx-gal-badge':  'Photo gallery',
    'idx-gal-h2':     'Moments from club life',
    'idx-gal-p':      'Meetings, competitions, and socializing — captured in images.',
    'idx-gal-cta':    'View full gallery',

    /* ─ Index: Reviews ─ */
    'idx-rev-badge':   'Reviews',
    'idx-rev-h2':      'What do people who visited us say?',
    'idx-rev-fb-cta':  'See all reviews on Facebook',
    'idx-rev-g-cta':   'See all reviews on Google',

    /* ─ Index: Contact section ─ */
    'idx-ct-badge':   'Schedule & Registration',
    'idx-ct-h2':      'Come to a meeting!',
    'idx-ct-p':       'Choose a date from the calendar and fill in the form. We\'ll contact you with all the details.',
    'idx-form-h3':    'Register as a guest',
    'idx-prenume':    'First name',
    'idx-nome':       'Last name',
    'idx-email':      'Email',
    'idx-tel':        'Phone',
    'idx-optional':   '(optional)',
    'idx-sedinta':    'Preferred meeting',
    'idx-mesaj':      'Message',
    'idx-submit':     'Send request',
    'idx-ok-h':       'Thank you!',
    'idx-ok-p':       'Someone from our team will contact you within 24–48 hours with all the details.',
    'idx-cal-default':'Select a date first',
    'idx-maps':       'Open Maps',
    'idx-privacy-pre':'By submitting you accept our',
    'idx-privacy-lnk':'Privacy Policy',

    /* ─ Index: FAQ ─ */
    'idx-faq-badge':  'FAQ',
    'idx-faq-h2':     'Have a question?',
    'idx-faq-q1':     'How much does the first meeting cost?',
    'idx-faq-a1':     'The first meeting is completely free. You come as a guest, with no commitment. If you choose to become a member, the fee is paid every six months and covers all meetings in the season.',
    'idx-faq-q2':     'Where and when do meetings take place?',
    'idx-faq-a2':     'Wednesday evenings, 19:30–21:00, at Cowork The Office, 2nd floor, BCR Building, Calea Aradului no. 11, Timișoara. Meetings alternate between Romanian and English.',
    'idx-faq-q3':     'Do I need experience in public speaking?',
    'idx-faq-a3':     'Not at all. The club is open to everyone, regardless of experience. Many members came to their first meeting having never spoken in front of an audience. Progress is gradual and supported by the community.',
    'idx-faq-q4':     'How many people attend a meeting?',
    'idx-faq-a4':     'Usually 20–30 people. A meeting lasts 90 minutes and includes prepared speeches, impromptu speaking (Table Topics), and structured feedback from members.',
    'idx-faq-q5':     'Do I need to register in advance?',
    'idx-faq-a5':     'Not required, but recommended. Filling in the contact form helps us welcome you properly and reserve your spot. It takes under 2 minutes.',

    /* ─ Gallery page ─ */
    'gal-badge':      'Photo gallery',
    'gal-h1':         'All club moments',
    'gal-p':          'Meetings, competitions, and social events — over 17 years of memories.',
    'gal-cta-badge':  'Come too',
    'gal-cta-h2':     'Want to be part of our next memory?',
    'gal-cta-p':      'Come as a guest — free, no commitment.',
    'gal-cta-btn':    'Register for a meeting',
    'gal-stat1':      'years of activity',
    'gal-stat2':      'meetings / year',
    'gal-stat3':      'photos in gallery',
    'gal-stat4':      'events captured',

    /* ─ Contact page ─ */
    'ct-hero-badge':  'Schedule & Registration',
    'ct-hero-h1':     'The first meeting is free',
    'ct-hero-p':      'Choose a date from the calendar and fill in the form. We\'ll contact you within 24 hours with all the details.',
    'ct-form-h3':     'Register as a guest',
    'ct-prenume':     'First name',
    'ct-nome':        'Last name',
    'ct-email':       'Email',
    'ct-tel':         'Phone',
    'ct-optional':    '(optional)',
    'ct-sedinta':     'Preferred meeting',
    'ct-mesaj':       'Message',
    'ct-submit':      'Send request',
    'ct-ok-h':        'Thank you!',
    'ct-ok-p':        'Someone from our team will contact you within 24–48 hours with all the details.',
    'ct-maps':        'Open Maps',
    'ct-cal-default': 'Select a date first',

    /* ─ Despre noi page ─ */
    'hero-badge':       'Toastmasters International affiliated club',
    'hero-h1':          '17 Years of Public Speaking <span class="text-gold">in Timișoara</span>',
    'hero-p':           '17 years of weekly meetings in Timișoara. A place where you come for the first time as a guest, leave with concrete feedback, and come back.',
    'hero-pill':        '<span class="text-gold font-bold">Wednesday, 19:30–21:00</span><span class="hidden sm:inline">&nbsp;·&nbsp;</span><br class="sm:hidden"/>Cowork The Office, Timișoara<span class="hidden sm:inline">&nbsp;·&nbsp;</span><br class="sm:hidden"/><span class="text-white/70">free entry for visitors</span>',
    'mission-badge':    'Our mission',
    'mission-h2':       'The mission of a Toastmasters club',
    'mission-text':     'The mission of a Toastmasters club is to provide a learning experience in a positive and mutually supportive environment, through which each member can develop their communication and leadership skills, leading to personal and professional development and increased self-confidence.',
    'mission-source':   'Toastmasters International',
    'val-badge':        'What defines us',
    'val-h2':           'Our club values',
    'val-v1-title':     'Integrity',
    'val-v1-body':      'We speak honestly, give honest feedback and keep our word to colleagues and to ourselves.',
    'val-v2-title':     'Respect',
    'val-v2-body':      'Every voice matters here, whether you\'re giving your first speech or your fiftieth.',
    'val-v3-title':     'Service',
    'val-v3-body':      'We engage in the club not just for ourselves. A better club means growth for everyone.',
    'val-v4-title':     'Excellence',
    'val-v4-body':      'At every meeting we aim to be a little better than last time.',
    'achiev-badge':     'Our story',
    'achiev-h2':        'The first Toastmasters club in Romania',
    'achiev-p1':        'Timișoara Toastmasters is the first Toastmasters club established in Romania. It started with a group of people who believed that the ability to speak clearly and persuasively can be learned, and the best way is practice, not theory.',
    'achiev-p2':        '17 years later, over 200 members have passed through the club. Some spoke in public for the first time here. Others went on to lead teams, present at conferences, or become successful trainers.',
    'achiev-p3':        'Whether you\'re giving your first speech or have years of experience, <strong class="text-primary">your place is here.</strong>',
    'achiev-s1':        'Years of activity',
    'achiev-s2':        'Members over the years',
    'achiev-s3':        'Speeches delivered',
    'achiev-s4':        'Excellence awards',
    'eve-badge':        'A typical evening',
    'eve-h2':           'What does a Timișoara Toastmasters<br/>meeting look like?',
    'eve-p':            'Here\'s what to expect when you come for the first time.',
    'ben-badge':        'What you gain',
    'ben-h2':           'Member benefits',
    'ben-p':            'A proven system of 100+ years, applied weekly. Here\'s what you develop as a Timișoara Toastmasters member.',
    'ben-c1-tag':       'Core skill',
    'ben-c1-title':     'Public Speaking',
    'ben-c1-desc':      '<li class="flex items-start gap-1"><span class="text-gold flex-shrink-0">·</span>Safe space to practice</li><li class="flex items-start gap-1"><span class="text-gold flex-shrink-0">·</span>Weekly speeches</li><li class="flex items-start gap-1"><span class="text-gold flex-shrink-0">·</span>Applauded and encouraged by peers</li>',
    'ben-c2-tag':       'Real experience',
    'ben-c2-title':     'Leadership',
    'ben-c2-desc':      '<li class="flex items-start gap-1"><span class="text-gold flex-shrink-0">·</span>Moderate, evaluate, time meetings</li><li class="flex items-start gap-1"><span class="text-gold flex-shrink-0">·</span>Real roles at every meeting</li><li class="flex items-start gap-1"><span class="text-gold flex-shrink-0">·</span>Directly applicable skills</li>',
    'ben-c3-tag':       'Accelerated progress',
    'ben-c3-title':     'Constructive feedback',
    'ben-c3-desc':      '<li class="flex items-start gap-1"><span class="text-gold flex-shrink-0">·</span>Evaluation after every speech</li><li class="flex items-start gap-1"><span class="text-gold flex-shrink-0">·</span>What worked and what to improve</li><li class="flex items-start gap-1"><span class="text-gold flex-shrink-0">·</span>Visible and rapid progress</li>',
    'ben-c4-tag':       '8 educational paths',
    'ben-c4-title':     'Pathways',
    'ben-c4-desc':      '<li class="flex items-start gap-1"><span class="text-gold flex-shrink-0">·</span>8 educational tracks</li><li class="flex items-start gap-1"><span class="text-gold flex-shrink-0">·</span>Projects with clear objectives</li><li class="flex items-start gap-1"><span class="text-gold flex-shrink-0">·</span>Management, leadership, communication</li>',
    'ben-c5-tag':       'Transformation',
    'ben-c5-title':     'Self-confidence',
    'ben-c5-desc':      '<li class="flex items-start gap-1"><span class="text-gold flex-shrink-0">·</span>Nerves become energy</li><li class="flex items-start gap-1"><span class="text-gold flex-shrink-0">·</span>Presence and authority on stage</li><li class="flex items-start gap-1"><span class="text-gold flex-shrink-0">·</span>Real, visible transformation</li>',
    'ben-c6-tag':       'Real connections',
    'ben-c6-title':     'Networking',
    'ben-c6-desc':      '<li class="flex items-start gap-1"><span class="text-gold flex-shrink-0">·</span>People from diverse fields</li><li class="flex items-start gap-1"><span class="text-gold flex-shrink-0">·</span>United by the desire to grow</li><li class="flex items-start gap-1"><span class="text-gold flex-shrink-0">·</span>Authentic and lasting network</li>',
    'ben-c7-tag':       'Challenge',
    'ben-c7-title':     'Competitions',
    'ben-c7-desc':      '<li class="flex items-start gap-1"><span class="text-gold flex-shrink-0">·</span>From club to international level</li><li class="flex items-start gap-1"><span class="text-gold flex-shrink-0">·</span>Test your limits under pressure</li><li class="flex items-start gap-1"><span class="text-gold flex-shrink-0">·</span>Transformative experience</li>',
    'ben-c8-tag':       'Your own curriculum',
    'ben-c8-title':     'Personal growth',
    'ben-c8-desc':      '<li class="flex items-start gap-1"><span class="text-gold flex-shrink-0">·</span>Path tailored to your goals</li><li class="flex items-start gap-1"><span class="text-gold flex-shrink-0">·</span>At your pace, every week</li><li class="flex items-start gap-1"><span class="text-gold flex-shrink-0">·</span>An investment in yourself</li>',
    'cta-h2':           'Ready to speak with confidence?',
    'cta-p':            'The first meeting is free, without obligation. Come and see.',
    'cta-btn1':         'Register for a meeting',
    'cta-btn2':         'Learn more',
    'cta-chip1':        'Free first meeting',
    'cta-chip2':        'No commitment',
    'cta-chip3':        'Wednesday evenings',
  };

  /* ── Engine ── */
  var LANG_KEY = 'tmt_lang';

  function applyLang(lang) {
    document.documentElement.setAttribute('lang', lang === 'en' ? 'en' : 'ro');

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      /* Capture original innerHTML once */
      if (!el.hasAttribute('data-orig')) {
        el.setAttribute('data-orig', el.innerHTML);
      }
      if (lang === 'en') {
        var val = T[el.dataset.i18n];
        if (val !== undefined) {
          /* Use innerHTML when translation contains HTML tags */
          if (/<[a-zA-Z]/.test(val)) el.innerHTML = val;
          else el.textContent = val;
        }
      } else {
        el.innerHTML = el.getAttribute('data-orig');
      }
    });

    /* Placeholders */
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
      if (!el.hasAttribute('data-orig-ph')) {
        el.setAttribute('data-orig-ph', el.placeholder);
      }
      el.placeholder = lang === 'en'
        ? (T[el.dataset.i18nPh] || el.getAttribute('data-orig-ph'))
        : el.getAttribute('data-orig-ph');
    });

    /* Aria-labels */
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      if (!el.hasAttribute('data-orig-aria')) {
        el.setAttribute('data-orig-aria', el.getAttribute('aria-label') || '');
      }
      el.setAttribute('aria-label', lang === 'en'
        ? (T[el.dataset.i18nAria] || el.getAttribute('data-orig-aria'))
        : el.getAttribute('data-orig-aria'));
    });

    /* Lang button active state */
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      var active = btn.dataset.lang === lang;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
  }

  window.setLang = function (lang) {
    localStorage.setItem(LANG_KEY, lang);
    applyLang(lang);
  };

  document.addEventListener('DOMContentLoaded', function () {
    var saved = localStorage.getItem(LANG_KEY) || 'ro';
    applyLang(saved);
  });

})();
