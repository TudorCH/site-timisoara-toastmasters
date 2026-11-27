// Club data shared by /admin/agenda, /admin/ecusoane and /admin/membri: the starting members list
// (names as the club uses them) and the board. The pages prefer the copy saved in the database when
// there is one; these are the defaults for a fresh start.
window.TM_CLUB = {
  members: [
    'Adriana Stamatin', 'Anca Bac', 'Andrada Roman', 'Andrei Hleba', 'Bianca Teliban', 'Casian Pera',
    'Corina Thorsnes', 'Daniel Roseti', 'David Duca', 'Florin Valcu', 'George Olteanu', 'Ionuț Cornean',
    'Isabela Boncila', 'Lavinia Borza', 'Loredana Velica', 'Lucian Corcodel', 'Mihaela Bobei', 'Mihaela Cristina',
    'Mihaela Stroia', 'Nadejda Silosieva', 'Olga Lancea', 'Ovidiu Diatlov', 'Raul Nistor', 'Rebeca Peca',
    'Robert Cernea', 'Serban Blidariu', 'Sergiu Foca', 'Sergiu Spătar', 'Sorin Săliștean', 'Tudor Chiu', 'Valentin Deleanu'
  ],
  club: {
    officers: { pres: 'Robert Cernea', vpe: 'Olga Lancea', vpm: 'Ionuț Cornean', vppr: 'Lavinia Borza', treas: 'Mihaela Stroia', saa: 'Sergiu Spătar', sec: 'Tudor Chiu', ipp: 'Adriana Stamatin' },
    venue: 'Zbor Hub, etaj 2', address: 'Str. Vasile Alecsandri 1', qr: 'https://timisoaratoastmasters.ro/links'
  },
  // Board order (used for the agenda's officers list and the board badges)
  officerKeys: ['pres', 'vpe', 'vpm', 'vppr', 'treas', 'saa', 'sec', 'ipp'],
  // Roster import (/admin/membri): members known in the club by another name than the one in the
  // Toastmasters export, and people to leave out. Keyed by a fingerprint of the export name, so the
  // official names are not written here: sha256('tm-name:' + nameKey(name)).slice(0, 16).
  importAliases: { 'ae5dc78f1527267e': 'Rebeca Peca', '733a05654d0b23b9': 'Bianca Teliban', '2a1cf8bcd18b7177': 'Anca Bac' },
  importExclude: ['624fc98130d593d1', 'a007ea162b8068ee']
};
