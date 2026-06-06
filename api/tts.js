module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { text, lang } = req.body || {};
  if (!text || typeof text !== 'string' || !text.trim())
    return res.status(400).json({ error: 'text required' });

  const key    = process.env.AZURE_SPEECH_KEY;
  const region = process.env.AZURE_SPEECH_REGION || 'westeurope';

  if (!key) return res.status(500).json({ error: 'TTS not configured' });

  const isEn  = lang === 'en';
  const xmlLang = isEn ? 'en-US' : 'ro-RO';
  const voice   = isEn ? 'en-US-JennyNeural' : 'ro-RO-AlinaNeural';

  const safe = text.slice(0, 9000)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='${xmlLang}'><voice name='${voice}'>${safe}</voice></speak>`;

  try {
    const azRes = await fetch(
      `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`,
      {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': key,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-24khz-96kbitrate-mono-mp3',
          'User-Agent': 'TimisoaraToastmasters/1.0',
        },
        body: ssml,
      }
    );

    if (!azRes.ok) {
      const detail = await azRes.text().catch(() => '');
      return res.status(502).json({ error: 'Azure TTS error', status: azRes.status, detail });
    }

    const buf = await azRes.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-store');
    res.send(Buffer.from(buf));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
