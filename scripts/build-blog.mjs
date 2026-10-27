// Generează blogul din content/blog/*.md:
//   blog/<slug>.html   pagina fiecărui articol (șablon: blog.html, zona BLOG:MAIN)
//   blog-posts.json    lista citită de /blog
//   sitemap-blog.xml   URL-urile articolelor, pentru motoarele de căutare
// Rulează la fiecare deploy (npm run build). `--drafts` include și articolele cu draft: true.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { marked } from 'marked';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'content', 'blog');
const OUT = path.join(ROOT, 'blog');
const SITE = 'https://timisoaratoastmasters.ro';
const CLD = 'https://res.cloudinary.com/dnxcej0q5/image/upload/';
const WITH_DRAFTS = process.argv.includes('--drafts');

const CATS = {
  ghiduri: 'Ghiduri & tehnici',
  povesti: 'Povești de membri',
  evenimente: 'Evenimente & concursuri',
  club: 'Despre club',
};

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slugify = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
// Coperta poate fi un URL complet, o cale din site (/Images/blog/...) sau un ID Cloudinary.
const imgUrl = (src, w) => !src ? '' : /^https?:/.test(src) ? src : src.startsWith('/') ? src : CLD + `w_${w},q_auto,f_auto/` + src;
const absUrl = u => !u ? '' : /^https?:/.test(u) ? u : SITE + (u.startsWith('/') ? u : '/' + u);
const isoDate = d => (d instanceof Date ? d : new Date(d)).toISOString().slice(0, 10);
const roDate = d => (d instanceof Date ? d : new Date(d)).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

function readPosts() {
  if (!fs.existsSync(SRC)) return [];
  return fs.readdirSync(SRC).filter(f => f.endsWith('.md')).map(f => {
    const { data, content } = matter(fs.readFileSync(path.join(SRC, f), 'utf8'));
    for (const k of ['title', 'date', 'category']) {
      if (!data[k]) throw new Error(`${f}: lipsește câmpul obligatoriu "${k}"`);
    }
    if (!CATS[data.category]) throw new Error(`${f}: categorie necunoscută "${data.category}" (${Object.keys(CATS).join(', ')})`);
    const words = content.split(/\s+/).filter(Boolean).length;
    return {
      file: f,
      slug: slugify(path.basename(f, '.md')),
      title: String(data.title),
      title_en: data.title_en ? String(data.title_en) : '',
      excerpt: data.excerpt ? String(data.excerpt) : '',
      excerpt_en: data.excerpt_en ? String(data.excerpt_en) : '',
      date: data.date,
      category: data.category,
      author: data.author ? String(data.author) : '',
      cover: data.cover ? String(data.cover) : '',
      featured: !!data.featured,
      draft: !!data.draft,
      minutes: Math.max(1, Math.round(words / 200)),
      html: marked.parse(content),
    };
  }).filter(p => WITH_DRAFTS || !p.draft)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

const PROSE_CSS = `
    .tm-prose { color:#374151; font-size:1.0625rem; line-height:1.8; }
    .tm-prose > * + * { margin-top:1.15em; }
    .tm-prose h2 { font-family:'Plus Jakarta Sans',sans-serif; font-weight:800; color:#002d47; font-size:1.55rem; line-height:1.25; margin-top:2em; }
    .tm-prose h3 { font-family:'Plus Jakarta Sans',sans-serif; font-weight:700; color:#002d47; font-size:1.2rem; line-height:1.3; margin-top:1.6em; }
    .tm-prose a { color:#772432; font-weight:600; text-decoration:underline; text-underline-offset:3px; }
    .tm-prose strong { color:#111827; }
    .tm-prose ul { list-style:disc; padding-left:1.4em; }
    .tm-prose ol { list-style:decimal; padding-left:1.4em; }
    .tm-prose li + li { margin-top:.4em; }
    .tm-prose blockquote { border-left:4px solid #F2DF74; padding:.25em 0 .25em 1em; color:#4b5563; font-style:italic; }
    .tm-prose img { border-radius:1rem; width:100%; height:auto; }
    .tm-prose hr { border:0; border-top:1px solid #e5e7eb; margin:2.5em 0; }
    .tm-prose code { background:#f3f4f6; padding:.1em .35em; border-radius:.3em; font-size:.9em; }`;

// Dark header (same backdrop as /blog and /galerie), article text on white for reading.
function articleMain(p) {
  const cover = imgUrl(p.cover, 1400);
  return `<!-- BLOG:MAIN:START -->
<main id="main-content" tabindex="-1" class="bg-white">
  <header class="relative overflow-hidden pt-24 lg:pt-28 ${cover ? 'pb-28 sm:pb-40 lg:pb-48' : 'pb-12 lg:pb-16'}" style="background:#00151f">
    <div class="tm-backdrop" aria-hidden="true">
      <div class="absolute top-[-140px] right-[-120px] w-[520px] h-[520px] rounded-full border border-gold/10"></div>
      <div class="absolute top-[-60px] right-[-40px] w-[360px] h-[360px] rounded-full border border-white/5"></div>
      <div class="absolute top-[260px] left-[-180px] w-[440px] h-[440px] rounded-full border border-gold/5"></div>
    </div>
    <div class="relative max-w-3xl mx-auto px-5 lg:px-8">
      <a href="/blog" class="inline-flex items-center gap-1.5 text-sm font-semibold text-white/60 hover:text-white transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M19 12H5m6 6l-6-6 6-6"/></svg>
        <span data-i18n="blog-back">Toate articolele</span>
      </a>
      <div class="mt-6 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold">
        <span>${esc(CATS[p.category])}</span><span class="text-white/25">•</span><span class="text-white/55">${p.minutes} min lectură</span>
      </div>
      <h1 class="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mt-3">${esc(p.title)}</h1>
      ${p.excerpt ? `<p class="text-white/70 text-lg leading-relaxed mt-4">${esc(p.excerpt)}</p>` : ''}
      <div class="mt-6 flex items-center gap-3">
        <span class="w-10 h-10 rounded-full overflow-hidden bg-white/10 text-white/40 flex-shrink-0" aria-hidden="true"><svg class="w-full h-full" viewBox="0 0 44 44" fill="currentColor"><circle cx="22" cy="17" r="8"/><path d="M6 44c0-9.4 7.2-15 16-15s16 5.6 16 15z"/></svg></span>
        <span>
          <span class="block text-sm font-semibold text-white">${esc(p.author || 'Echipa clubului')}</span>
          <time class="block text-xs text-white/55" datetime="${isoDate(p.date)}">${roDate(p.date)}</time>
        </span>
      </div>
    </div>
  </header>

  <article class="max-w-3xl mx-auto px-5 lg:px-8 pb-14 lg:pb-20 ${cover ? '' : 'pt-10'}">
    ${cover ? `<figure class="relative -mt-20 sm:-mt-32 lg:-mt-40 rounded-2xl overflow-hidden bg-[#0b2a40] shadow-2xl shadow-black/30 ring-1 ring-black/5" style="aspect-ratio:16/9"><img src="${esc(cover)}" alt="" class="w-full h-full object-cover" decoding="async" /></figure>` : ''}
    <div class="tm-prose mt-8">
${p.html}
    </div>

    <div class="mt-12 relative overflow-hidden rounded-3xl px-6 py-8 sm:px-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 text-center sm:text-left" style="background:linear-gradient(135deg,#001c2d 0%,#00253a 100%)">
      <div class="absolute top-[-120px] right-[-60px] w-80 h-80 rounded-full border border-gold/10 pointer-events-none"></div>
      <div class="relative">
        <p class="font-heading font-bold text-white text-xl sm:text-2xl" data-i18n="blog-cta-title">Cel mai bine înveți <span class="text-gold">exersând</span></p>
        <p class="text-white/70 text-sm mt-1" data-i18n="blog-cta-text">Vino ca invitat la o ședință, miercuri seara. Participarea e gratuită.</p>
      </div>
      <a href="/contact" class="relative shrink-0 inline-flex items-center justify-center gap-2.5 rounded-xl border border-gold/60 hover:border-gold bg-[#123a5e]/35 hover:bg-[#123a5e]/55 text-white font-bold text-sm px-5 py-3 shadow-[0_0_24px_rgba(242,223,116,.15)] transition-colors whitespace-nowrap">
        <span data-i18n="blog-cta-btn">Alege o ședință</span>
        <svg class="w-[18px] h-[18px] text-gold" fill="none" stroke="currentColor" stroke-width="4" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-6-6l6 6-6 6"/></svg>
      </a>
    </div>
  </article>
</main>
<!-- BLOG:MAIN:END -->`;
}

function articlePage(tpl, p) {
  const url = `${SITE}/blog/${p.slug}`;
  const title = `${p.title} | Timișoara Toastmasters`;
  const desc = p.excerpt || p.title;
  const image = absUrl(imgUrl(p.cover, 1200)) || `${SITE}/Images/background-hero.webp`;
  const ld = {
    '@context': 'https://schema.org', '@type': 'BlogPosting',
    headline: p.title, description: desc, image, datePublished: isoDate(p.date),
    author: { '@type': p.author ? 'Person' : 'Organization', name: p.author || 'Timișoara Toastmasters' },
    publisher: { '@type': 'Organization', name: 'Timișoara Toastmasters', logo: { '@type': 'ImageObject', url: `${SITE}/logo.png` } },
    mainEntityOfPage: url,
  };

  let h = tpl;
  const a = h.indexOf('<!-- BLOG:MAIN:START'), b = h.indexOf('<!-- BLOG:MAIN:END -->');
  if (a < 0 || b < 0) throw new Error('blog.html: lipsesc markerii BLOG:MAIN:START / BLOG:MAIN:END');
  h = h.slice(0, a) + articleMain(p) + h.slice(b + '<!-- BLOG:MAIN:END -->'.length);

  const meta = (attr, key, val) => {
    const re = new RegExp(`(<meta ${attr}="${key}" content=")[^"]*(")`);
    h = re.test(h) ? h.replace(re, `$1${esc(val)}$2`) : h;
  };
  h = h.replace(/<title[^>]*>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
  h = h.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`);
  meta('name', 'description', desc);
  meta('name', 'robots', 'index, follow');
  meta('property', 'og:type', 'article');
  meta('property', 'og:url', url);
  meta('property', 'og:title', title);
  meta('property', 'og:description', desc);
  meta('property', 'og:image', image);
  meta('property', 'og:image:alt', p.title);
  meta('name', 'twitter:title', title);
  meta('name', 'twitter:description', desc);
  meta('name', 'twitter:image', image);
  meta('name', 'twitter:image:alt', p.title);
  h = h.replace(/\s*<meta property="og:image:(width|height)" content="[^"]*" \/>/g, '');
  h = h.replace('</head>', `  <style>${PROSE_CSS}\n  </style>\n  <script type="application/ld+json">${JSON.stringify(ld)}</script>\n</head>`);

  // Pagina stă la /blog/<slug>: căile relative din șablon devin absolute.
  h = h.replace(/(\s(?:href|src))="(?![a-z][a-z0-9+.-]*:|\/|#|\$\{)([^"]*)"/gi, '$1="/$2"');
  return h;
}

function main() {
  const posts = readPosts();
  const tpl = fs.readFileSync(path.join(ROOT, 'blog.html'), 'utf8');

  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  for (const p of posts) fs.writeFileSync(path.join(OUT, `${p.slug}.html`), articlePage(tpl, p));

  const list = posts.map(p => ({
    slug: p.slug, cat: p.category, date: isoDate(p.date), min: p.minutes,
    cover: p.cover, featured: p.featured, author: p.author,
    ro: { t: p.title, x: p.excerpt },
    en: p.title_en ? { t: p.title_en, x: p.excerpt_en || p.excerpt } : null,
  }));
  fs.writeFileSync(path.join(ROOT, 'blog-posts.json'), JSON.stringify(list, null, 1));

  const urls = [`  <url><loc>${SITE}/blog</loc><changefreq>weekly</changefreq><priority>0.6</priority></url>`]
    .concat(posts.map(p => `  <url><loc>${SITE}/blog/${p.slug}</loc><lastmod>${isoDate(p.date)}</lastmod><priority>0.6</priority></url>`));
  fs.writeFileSync(path.join(ROOT, 'sitemap-blog.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);

  console.log(`blog: ${posts.length} articol(e)${WITH_DRAFTS ? ' (cu ciorne)' : ''}`);
}

main();
