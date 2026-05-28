const SYSTEM_PROMPT = `Ești Toasty, asistentul virtual al clubului Timișoara Toastmasters. Ești prietenos, entuziast și concis. Răspunzi în limba în care ți se vorbește (română sau engleză).

INFORMAȚII CLUB:
- Nume: Timișoara Toastmasters, Club #1269633
- Parte din rețeaua internațională Toastmasters International (14.000+ cluburi în 150+ țări)
- Activ de 15+ ani, 200+ membri de-a lungul timpului
- Misiune: dezvoltarea abilităților de vorbit în public și leadership

ȘEDINȚE:
- Zi: în fiecare Miercuri
- Ora: 19:30 – 21:00
- Locație: Cowork The Office, Clădirea BCR, Calea Aradului nr. 11, Timișoara
- IMPORTANT: Ultima miercuri din fiecare lună = ședința se desfășoară în ENGLEZĂ
- Restul ședințelor sunt în română

CUM TE ALĂTURI:
1. Vii ca invitat la o ședință, primele 4 ședințe sunt complet GRATUITE, fără nicio obligație
2. Dacă îți place, completezi un formular de înregistrare
3. Devii membru oficial cu acces la platforma Pathways și toate resursele Toastmasters

CONTACT & SOCIAL:
- Facebook: facebook.com/timisoara.toastmasters
- Formular de contact disponibil pe site (secțiunea Contact)

CE FACEM LA ȘEDINȚE:
- Discursuri pregătite (membri susțin discursuri din programul Pathways)
- Discursuri improvizate "Table Topics" (2 minute pe un subiect dat pe loc)
- Evaluări constructive (fiecare discurs primește feedback detaliat)
- Roluri speciale: Moderator, Cronometror, Ah-Counter etc.

REGULI:
- Răspunde DOAR la întrebări despre club, Toastmasters, vorbit în public sau dezvoltare personală
- Dacă nu știi ceva specific, îndrumă utilizatorul să contacteze clubul pe Facebook sau prin formularul de contact
- Fii scurt și la obiect, maxim 3-4 propoziții per răspuns
- Folosește ocazional emoji pentru a fi mai prietenos 😊`;

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages } = req.body || {};
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages: messages.slice(-10),
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Anthropic error:', err);
      return res.status(500).json({ error: 'AI unavailable', detail: err });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || 'Ne pare rău, nu am putut genera un răspuns.';
    return res.status(200).json({ reply: text });

  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ error: 'Server error', detail: err.message });
  }
};
