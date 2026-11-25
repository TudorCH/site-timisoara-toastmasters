// Club data shared by /admin/agenda and /admin/ecusoane: the starting members list (names only)
// and the board. Both pages prefer the copy saved in the database (club settings) when there is one;
// these are the defaults for a fresh start.
window.TM_CLUB = {
  members: [
    'Adriana Stamatin', 'Anca Kovacs-Cziczeri', 'Andrada Roman', 'Andrei Hleba', 'Bianca Teliban', 'Casian Pera',
    'Corina Thorsnes', 'Daniel Roseti', 'David Duca', 'Florin Valcu', 'George Olteanu', 'Ionuț Cornean',
    'Isabela Boncila', 'Lavinia Borza', 'Loredana Velica', 'Lucian Corcodel', 'Mihaela Bobei', 'Mihaela Stroia',
    'Nadejda Silosieva', 'Olga Lancea', 'Ovidiu Diatlov', 'Petrica Gavril Tihulca', 'Raul Nistor', 'Rebeca Peca',
    'Robert Cernea', 'Serban Blidariu', 'Sergiu Foca', 'Sergiu Spătar', 'Sorin Săliștean', 'Tudor Chiu', 'Valentin Deleanu'
  ],
  club: {
    officers: { pres: 'Robert Cernea', vpe: 'Olga Lancea', vpm: 'Ionuț Cornean', vppr: 'Lavinia Borza', treas: 'Mihaela Stroia', saa: 'Sergiu Spătar', sec: 'Tudor Chiu', ipp: 'Adriana Stamatin' },
    venue: 'Zbor Hub, etaj 2', address: 'Str. Vasile Alecsandri 1', qr: 'https://timisoaratoastmasters.ro/'
  },
  // Board order (used for the agenda's officers list and the board badges)
  officerKeys: ['pres', 'vpe', 'vpm', 'vppr', 'treas', 'saa', 'sec', 'ipp']
};
