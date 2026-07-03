/* ════════════════════════════════════════════════
   i18n — RO / EN language switcher
   ════════════════════════════════════════════════ */
(function () {

  /* ── Inject CSS for lang buttons ── */
  var css = document.createElement('style');
  css.textContent =
    '.lang-btn{padding:3px;border-radius:50%;transition:all .2s ease;cursor:pointer;' +
    'background:transparent;border:2px solid transparent;opacity:0.5;line-height:0;' +
    'display:inline-flex;align-items:center;justify-content:center;}' +
    '.lang-btn:hover{opacity:0.85;}' +
    '.lang-btn.active{border-color:rgba(255,255,255,.9);opacity:1;box-shadow:0 0 0 1px rgba(255,255,255,.2);}' +
    '.footer-link:hover,.footer-link:active{color:#F2DF74!important;}';
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
    'footer-desc':           'Timișoara Toastmasters Club, a safe space for practice, feedback and growth in communication and public speaking, part of the global Toastmasters International network.',
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
    'idx-dece-p':       'Effective communication is not an innate talent, it\'s a skill that can be learned and practiced.',
    'idx-card1-title':  'Communication & Impact',
    'idx-card1-body':   'At every meeting you give or listen to a speech. You don\'t read about communication, you practice it.',
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
    'idx-panel0-body':  'You attend a meeting, observe how everything works, and speak with members. Zero pressure, attending as a guest is completely free, with no commitment.',
    'idx-panel1-step':  'Step 2',
    'idx-panel1-title': 'Become an official member',
    'idx-panel1-body':  'You officially become a member of the club and Toastmasters International network, with full access to the Pathways platform and all development resources.',
    'idx-panel2-step':  'Step 3',
    'idx-panel2-title': 'Gradual involvement',
    'idx-panel2-body':  'You take on small roles at meetings: timer, grammar evaluator, filler-word counter, at your own pace, without pressure.',
    'idx-panel3-step':  'Step 4',
    'idx-panel3-title': 'Pathways + Mentoring',
    'idx-panel3-body':  'You follow a personalized curriculum of speeches and leadership projects, guided by an experienced mentor who helps you advance with confidence.',
    'idx-panel4-step':  'Step 5',
    'idx-panel4-title': 'Performance & Leadership',
    'idx-panel4-body':  'You compete in public speaking contests, lead teams, and inspire others. You become a role model for new members and contribute to the club\'s growth.',

    /* ─ Index: Gallery teaser ─ */
    'idx-gal-badge':  'Photo gallery',
    'idx-gal-h2':     'Moments from club life',
    'idx-gal-p':      'Meetings, events, and socializing, captured in images.',
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
    'gal-h1':         'Photo Gallery',
    'gal-p':          'Meetings, competitions, events and socializing, captured in images.',

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
    'hero-h1':          '17 Years of Public Speaking <span class="text-gold">in Timișoara</span>',
    'hero-d1':          'Wednesday, 19:30–21:00',
    'hero-d2':          'Cowork The Office, Timișoara',
    'hero-d3':          'Free entry',
    'mission-h2':       'What Is the Mission of a Toastmasters Club?',
    'mission-text':     '“The mission of a Toastmasters club is to provide a learning experience in a positive, mutually supportive environment where every member has the opportunity to develop communication and leadership skills, leading to greater self-confidence and personal and professional growth.”',
    'mission-source':   'Toastmasters International',
    'val-h2':           'What Are the Club\'s Values?',
    'val-v1-title':     'Integrity',
    'val-v1-body':      'We match our actions with our words, communicate with sincerity and honesty, acknowledge our mistakes, and always strive to do the right thing.',
    'val-v2-title':     'Respect',
    'val-v2-body':      'We treat all with dignity, welcome diverse perspectives, acknowledge all contributions, and critique but never demean.',
    'val-v3-title':     'Service',
    'val-v3-body':      'We strive to provide high-value, exceptional support by being responsive, attentive, and passionate in fulfilling our duties.',
    'val-v4-title':     'Excellence',
    'val-v4-body':      'We consistently strive to exceed expectations by upholding the Toastmasters Promise, innovating and optimizing quality to produce superior service.',
    'achiev-h2':        'The First Toastmasters Club in Romania',
    'achiev-p1':        'Timișoara Toastmasters is the first Toastmasters club founded in Romania. It started with a group of people who believed effective speaking can be learned, and that the best way is practice, not theory.',
    'achiev-p2':        '17 years later, over 200 members have come through the club. Some gave their first public speech here. Others went on to lead teams, present at conferences, or become trainers.',
    'achiev-p3':        'Whether you\'re giving your first speech or have years of experience, <strong class="text-primary">your place is here.</strong>',
    'achiev-s1':        'Years Active',
    'achiev-s1-short':  'years',
    'achiev-s2':        'Members Over Time',
    'achiev-s2-short':  'members',
    'achiev-s3':        'Speeches Delivered',
    'achiev-s3-short':  'speeches',
    'achiev-s4':        'Awards of Excellence',
    'achiev-s4-short':  'awards',
    'eve-h2':           'What Does a Meeting at<br/>Timișoara Toastmasters Look Like?',
    'ben-h2':           'Why Do Our Members Benefit?',
    'ben-p':            'A proven system 100+ years in the making, applied weekly. Here\'s what you concretely develop as a Timișoara Toastmasters member.',
    'ben-c1-tag':       'Core Skill',
    'ben-c1-title':     'Public Speaking',
    'ben-c1-desc':      '<li class="flex items-start gap-1"><span class="text-white/60 flex-shrink-0">·</span>Safe space to practice</li><li class="flex items-start gap-1"><span class="text-white/60 flex-shrink-0">·</span>Weekly speeches</li><li class="flex items-start gap-1"><span class="text-white/60 flex-shrink-0">·</span>Cheered on by peers</li>',
    'ben-c2-tag':       'Real Experience',
    'ben-c2-title':     'Leadership',
    'ben-c2-desc':      '<li class="flex items-start gap-1"><span class="text-white/60 flex-shrink-0">·</span>Moderate, evaluate, timekeep</li><li class="flex items-start gap-1"><span class="text-white/60 flex-shrink-0">·</span>Real roles every meeting</li><li class="flex items-start gap-1"><span class="text-white/60 flex-shrink-0">·</span>Directly applicable skills</li>',
    'ben-c3-tag':       'Accelerated Growth',
    'ben-c3-title':     'Constructive Feedback',
    'ben-c3-desc':      '<li class="flex items-start gap-1"><span class="text-white/60 flex-shrink-0">·</span>Evaluation after every speech</li><li class="flex items-start gap-1"><span class="text-white/60 flex-shrink-0">·</span>What worked, what to improve</li><li class="flex items-start gap-1"><span class="text-white/60 flex-shrink-0">·</span>Visible, fast progress</li>',
    'ben-c4-tag':       '8 Educational Paths',
    'ben-c4-title':     'Pathways',
    'ben-c4-desc':      '<li class="flex items-start gap-1"><span class="text-white/60 flex-shrink-0">·</span>8 educational tracks</li><li class="flex items-start gap-1"><span class="text-white/60 flex-shrink-0">·</span>Projects with clear objectives</li><li class="flex items-start gap-1"><span class="text-white/60 flex-shrink-0">·</span>Management, leadership, communication</li>',
    'ben-c5-tag':       'Transformation',
    'ben-c5-title':     'Self-Confidence',
    'ben-c5-desc':      '<li class="flex items-start gap-1"><span class="text-white/60 flex-shrink-0">·</span>Nervousness becomes energy</li><li class="flex items-start gap-1"><span class="text-white/60 flex-shrink-0">·</span>Presence and authority on stage</li><li class="flex items-start gap-1"><span class="text-white/60 flex-shrink-0">·</span>Real, visible transformation</li>',
    'ben-c6-tag':       'Real Connections',
    'ben-c6-title':     'Networking',
    'ben-c6-desc':      '<li class="flex items-start gap-1"><span class="text-white/60 flex-shrink-0">·</span>People from diverse fields</li><li class="flex items-start gap-1"><span class="text-white/60 flex-shrink-0">·</span>United by desire to grow</li><li class="flex items-start gap-1"><span class="text-white/60 flex-shrink-0">·</span>Authentic, lasting network</li>',
    'ben-c7-tag':       'Challenge',
    'ben-c7-title':     'Competitions',
    'ben-c7-desc':      '<li class="flex items-start gap-1"><span class="text-white/60 flex-shrink-0">·</span>From club to international</li><li class="flex items-start gap-1"><span class="text-white/60 flex-shrink-0">·</span>Test your limits under pressure</li><li class="flex items-start gap-1"><span class="text-white/60 flex-shrink-0">·</span>A transformative experience</li>',
    'ben-c8-tag':       'Own Curriculum',
    'ben-c8-title':     'Personal Growth',
    'ben-c8-desc':      '<li class="flex items-start gap-1"><span class="text-white/60 flex-shrink-0">·</span>Track tailored to your goals</li><li class="flex items-start gap-1"><span class="text-white/60 flex-shrink-0">·</span>At your own pace, weekly</li><li class="flex items-start gap-1"><span class="text-white/60 flex-shrink-0">·</span>An investment in yourself</li>',
    'cta-btn1':         'Reserve Your Spot →',
    'cta-btn2':         'View Meeting Schedule',
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

  function initLang() {
    applyLang(localStorage.getItem(LANG_KEY) || 'ro');
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLang);
  } else {
    initLang();
  }

})();
