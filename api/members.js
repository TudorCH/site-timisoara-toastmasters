// Club members for the member dashboard (/membri) and the roster import (/admin/membri).
//   GET  ?action=roster               the stored roster, with Pathways read from the credentials
//   POST ?action=import { members, leftOut, syncAgenda }   replaces the roster (board only)
//   GET  ?action=profile&id=<id>      one member: profile, Pathways, roles from saved agendas
// Only these fields are stored: name, emails, credentials, club position, membership dates and status,
// mentor, birthday (day.month) and the paths the club sheet lists. Phones and addresses never reach the
// server (the import page drops them in the browser).
// Until members can log in, everything here needs the board session (tm_admin cookie).
const { configured, pipeline, k, day } = require('./_lib/store');
const { isAuthed, sameOrigin, parseBody } = require('./_lib/auth');
const { pathwaysFor } = require('./_lib/pathways');

const ROSTER = 'members:roster';
const MAX_MEMBERS = 200;
// Club positions in the export → officer keys of the agenda ("Immediate Past President" is not in the export)
const POSITIONS = [
  [/president/i, 'pres'], [/education/i, 'vpe'], [/membership/i, 'vpm'], [/public relations|\bpr\b/i, 'vppr'],
  [/treasurer/i, 'treas'], [/secretary/i, 'sec'], [/sergeant/i, 'saa'],
];

const str = (v, max = 120) => (typeof v === 'string' ? v.trim().replace(/\s+/g, ' ').slice(0, max) : '');
const isoDate = (v) => (/^\d{4}-\d{2}-\d{2}$/.test(v || '') ? v : '');
const parseJson = (s) => { try { return s ? JSON.parse(s) : null; } catch { return null; } };
// Name key that ignores diacritics, case, initials and word order ("Cornean Ionut" = "Ionuț Cornean")
const nameKey = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  .replace(/[^a-z\s-]/g, ' ').split(/\s+/).filter((w) => w.length > 1).sort().join(' ');
const slug = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);

function cleanMember(m) {
  if (!m || typeof m !== 'object') return null;
  const name = str(m.name, 60);
  if (!name) return null;
  const emails = (Array.isArray(m.emails) ? m.emails : []).map((e) => str(e, 120).toLowerCase())
    .filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
  return {
    id: slug(name), name, fullName: str(m.fullName, 80), emails: [...new Set(emails)].slice(0, 4),
    credentials: str(m.credentials, 60), position: str(m.position, 60), futurePosition: str(m.futurePosition, 60),
    memberSince: isoDate(m.memberSince), joined: isoDate(m.joined), paidUntil: isoDate(m.paidUntil),
    status: str(m.status, 30), mentor: str(m.mentor, 60), enrolled: str(m.enrolled, 200),
    birthday: /^\d{2}\.\d{2}$/.test(m.birthday || '') ? m.birthday : '',
  };
}
const withPathways = (m) => Object.assign({}, m, { pathways: pathwaysFor(m.credentials, m.enrolled) });

async function readRoster() {
  const [raw] = await pipeline([['GET', k(ROSTER)]]);
  return parseJson(raw) || { updated: 0, members: [] };
}

// Every role a member had in the saved agendas: past ones as history, today and later as upcoming.
async function rolesFor(member) {
  const [dates] = await pipeline([['ZRANGE', k('agenda:index'), 0, -1]]);
  if (!dates || !dates.length) return { history: [], upcoming: [] };
  const [raws] = await pipeline([['MGET', ...dates.map((d) => k('agenda:' + d))]]);
  const keys = new Set([member.name, member.fullName].filter(Boolean).map(nameKey));
  const me = (n) => !!n && keys.has(nameKey(n));
  const today = day();
  const history = [], upcoming = [];
  (raws || []).forEach((raw) => {
    const a = parseJson(raw);
    if (!a || !a.date) return;
    const items = [];
    Object.entries(a.roles || {}).forEach(([role, n]) => { if (me(n)) items.push({ role }); });
    (a.speeches || []).forEach((s, i) => {
      if (!s) return;
      if (me(s.speaker)) items.push({ role: 'speaker', title: str(s.title), path: str(s.path), level: +s.level || null, project: str(s.project) });
      if (me(s.evaluator)) items.push({ role: 'evaluator', n: i + 1, of: str(s.speaker, 60) });
    });
    if (a.vote && a.vote.on && me(a.vote.name)) items.push({ role: 'vote' });
    items.forEach((it) => (a.date >= today ? upcoming : history).push(Object.assign({ date: a.date, lang: a.lang || 'ro' }, it)));
  });
  history.sort((x, y) => (x.date < y.date ? 1 : -1));
  upcoming.sort((x, y) => (x.date > y.date ? 1 : -1));
  return { history, upcoming };
}

async function importRoster(req, res) {
  const body = parseBody(req);
  const list = (Array.isArray(body.members) ? body.members : []).slice(0, MAX_MEMBERS).map(cleanMember).filter(Boolean);
  if (!list.length) return res.status(400).json({ error: 'Lista de membri e goală.' });
  // Two people can't share an id; a second "Ana Pop" becomes "ana-pop-2"
  const seen = {};
  list.forEach((m) => { seen[m.id] = (seen[m.id] || 0) + 1; if (seen[m.id] > 1) m.id += '-' + seen[m.id]; });
  list.sort((a, b) => a.name.localeCompare(b.name, 'ro'));
  // Export names the board left out, so the next import starts with them unticked (name keys only)
  const leftOut = (Array.isArray(body.leftOut) ? body.leftOut : []).filter((x) => typeof x === 'string' && /^[a-z -]{2,80}$/.test(x)).slice(0, MAX_MEMBERS);
  const roster = { updated: Date.now(), members: list, leftOut };
  const cmds = [['SET', k(ROSTER), JSON.stringify(roster)]];

  // Keep the agenda builder's members list and board in step with the roster
  let officers = null;
  if (body.syncAgenda) {
    const [rawSettings] = await pipeline([['GET', k('agenda:settings')]]);
    const settings = parseJson(rawSettings) || {};
    const club = Object.assign({}, settings.club || {});
    officers = Object.assign({}, club.officers || {});
    list.forEach((m) => { const hit = POSITIONS.find(([re]) => re.test(m.position)); if (hit) officers[hit[1]] = m.name; });
    club.officers = officers;
    cmds.push(['SET', k('agenda:settings'), JSON.stringify(Object.assign({}, settings, { members: list.map((m) => m.name), club }))]);
  }
  await pipeline(cmds);
  return res.status(200).json({ ok: true, count: list.length, officers });
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex');
  const action = req.query.action;
  try {
    if (req.method === 'POST' && !sameOrigin(req)) return res.status(403).json({ error: 'Origine invalidă.' });
    if (!isAuthed(req)) return res.status(401).json({ error: 'Neautentificat.' });
    if (!configured()) return res.status(503).json({ error: 'Baza de date nu e conectată.' });

    if (action === 'roster' && req.method === 'GET') {
      const r = await readRoster();
      return res.status(200).json({ updated: r.updated, members: r.members.map(withPathways), leftOut: r.leftOut || [] });
    }
    if (action === 'import' && req.method === 'POST') return await importRoster(req, res);
    if (action === 'profile' && req.method === 'GET') {
      const r = await readRoster();
      const m = r.members.find((x) => x.id === String(req.query.id || ''));
      if (!m) return res.status(404).json({ error: 'Membrul nu există.' });
      const roles = await rolesFor(m);
      return res.status(200).json({ member: withPathways(m), history: roles.history, upcoming: roles.upcoming });
    }
    return res.status(400).json({ error: 'Acțiune necunoscută.' });
  } catch (err) {
    console.error('members:', err);
    return res.status(500).json({ error: 'Eroare server: ' + err.message });
  }
};
