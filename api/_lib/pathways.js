// Reads the "Credentials" column of the Toastmasters club export (e.g. "PI1", "DL4", "CC", "EH5, PM3").
// A Pathways code is <path initials><highest level completed>; older education-program titles
// (CC, ACB, DTM...) are kept as titles.
const PATHS = {
  DL: { name: 'Dynamic Leadership', current: true },
  EH: { name: 'Engaging Humor', current: true },
  MS: { name: 'Motivational Strategies', current: true },
  PI: { name: 'Persuasive Influence', current: true },
  PM: { name: 'Presentation Mastery', current: true },
  VC: { name: 'Visionary Communication', current: true },
  EC: { name: 'Effective Coaching', current: false },
  IP: { name: 'Innovative Planning', current: false },
  LD: { name: 'Leadership Development', current: false },
  SR: { name: 'Strategic Relationships', current: false },
  TC: { name: 'Team Collaboration', current: false },
};
const TITLES = {
  CC: 'Competent Communicator', ACB: 'Advanced Communicator Bronze', ACS: 'Advanced Communicator Silver',
  ACG: 'Advanced Communicator Gold', CL: 'Competent Leader', ALB: 'Advanced Leader Bronze',
  ALS: 'Advanced Leader Silver', DTM: 'Distinguished Toastmaster',
};
// Path names as people write them in the club's own sheet ("Engaging Humour", "Visual Comunication"...)
const ALIASES = [
  [/dynamic\s*lead/i, 'DL'], [/humou?r/i, 'EH'], [/motivat/i, 'MS'], [/persuas/i, 'PI'], [/presentation/i, 'PM'],
  [/vision|visual\s*com/i, 'VC'], [/coach/i, 'EC'], [/innovat/i, 'IP'], [/leadership\s*dev/i, 'LD'],
  [/strategic\s*rel/i, 'SR'], [/team\s*collab/i, 'TC'],
];

// "PI1, CC" -> { paths: [{ code, name, current, completed }], titles: ['Competent Communicator'] }
function parseCredentials(raw) {
  const paths = [], titles = [];
  String(raw || '').toUpperCase().split(/[\s,;/]+/).filter(Boolean).forEach((tok) => {
    const m = /^([A-Z]{2})([1-5])$/.exec(tok);
    if (m && PATHS[m[1]]) {
      const prev = paths.find((p) => p.code === m[1]);
      if (prev) prev.completed = Math.max(prev.completed, +m[2]);
      else paths.push({ code: m[1], name: PATHS[m[1]].name, current: PATHS[m[1]].current, completed: +m[2] });
    } else if (TITLES[tok]) titles.push(TITLES[tok]);
  });
  return { paths, titles };
}

// "Engaging Humour\nPresentation Mastery" -> ['EH', 'PM']
function pathCodesFromText(text) {
  const out = [];
  String(text || '').split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean).forEach((s) => {
    const hit = ALIASES.find(([re]) => re.test(s));
    if (hit && !out.includes(hit[1])) out.push(hit[1]);
  });
  return out;
}

// Merges the export's completed levels with the paths the club sheet says the member follows.
function pathwaysFor(credentials, enrolledText) {
  const { paths, titles } = parseCredentials(credentials);
  pathCodesFromText(enrolledText).forEach((code) => {
    if (!paths.some((p) => p.code === code)) paths.push({ code, name: PATHS[code].name, current: PATHS[code].current, completed: 0 });
  });
  return { paths, titles };
}

module.exports = { PATHS, TITLES, parseCredentials, pathCodesFromText, pathwaysFor };
