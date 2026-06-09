const ALLOWED_ORIGIN = 'https://timisoaratoastmasters.ro';

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

module.exports = async function handler(req, res) {
  const origin = req.headers.origin || '';
  const allowedOrigin = origin === ALLOWED_ORIGIN ? ALLOWED_ORIGIN : ALLOWED_ORIGIN;
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { prenume, nume, email, telefon, sedinta, mesaj } = req.body || {};

  if (!prenume || !prenume.trim()) {
    return res.status(400).json({ error: 'Prenumele este obligatoriu.' });
  }
  if (!email || !email.trim() || !isValidEmail(email.trim())) {
    return res.status(400).json({ error: 'Adresă de email invalidă.' });
  }

  const apiKey    = process.env.RESEND_API_KEY;
  const clubEmail = process.env.CLUB_EMAIL;
  const fromEmail = process.env.FROM_EMAIL || 'Timișoara Toastmasters <noreply@timisoaratoastmasters.ro>';

  if (!apiKey || !clubEmail) {
    console.error('Missing RESEND_API_KEY or CLUB_EMAIL env vars');
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  const numeComplet  = [prenume.trim(), (nume || '').trim()].filter(Boolean).join(' ');
  const dataTrimisat = new Date().toLocaleString('ro-RO', { timeZone: 'Europe/Bucharest' });

  const row = (label, value) => value
    ? `<tr>
        <td style="padding:8px 12px;background:#f8f9fa;font-weight:600;width:150px;vertical-align:top;">${escapeHtml(label)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e9ecef;">${escapeHtml(value)}</td>
       </tr>`
    : '';

  const mesajHtml = escapeHtml(mesaj || '').replace(/\n/g, '<br>');

  const html = `
<!DOCTYPE html>
<html lang="ro">
<head><meta charset="UTF-8"/></head>
<body style="font-family:Inter,Arial,sans-serif;background:#f4f6f8;margin:0;padding:24px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08);">
    <div style="background:#004165;padding:20px 24px;">
      <div style="color:#fff;font-size:17px;font-weight:700;">Timișoara Toastmasters</div>
      <div style="color:#F2DF74;font-size:12px;margin-top:2px;">Cerere nouă de vizită</div>
    </div>
    <div style="padding:24px;">
      <p style="margin:0 0 16px;color:#374151;font-size:15px;">
        <strong>${escapeHtml(numeComplet)}</strong> vrea să vină la o ședință.
      </p>
      <table style="border-collapse:collapse;width:100%;font-size:14px;color:#374151;">
        ${row('Nume', numeComplet)}
        ${row('Email', email.trim())}
        ${row('Telefon', telefon)}
        ${row('Ședința dorită', sedinta)}
        ${mesaj ? `<tr><td style="padding:8px 12px;background:#f8f9fa;font-weight:600;width:150px;vertical-align:top;">Mesaj</td><td style="padding:8px 12px;border-bottom:1px solid #e9ecef;">${mesajHtml}</td></tr>` : ''}
      </table>
      <div style="margin-top:20px;padding:12px 16px;background:#f0f7ff;border-left:3px solid #004165;border-radius:4px;font-size:13px;color:#374151;">
        Răspunde direct la acest email — reply-to e setat la adresa vizitatorului.
      </div>
    </div>
    <div style="padding:12px 24px;background:#f8f9fa;font-size:11px;color:#9ca3af;text-align:center;">
      timisoaratoastmasters.ro · ${dataTrimisat}
    </div>
  </div>
</body>
</html>`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method:  'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        from:     fromEmail,
        to:       [clubEmail],
        reply_to: email.trim(),
        subject:  `Cerere vizită: ${numeComplet}${sedinta ? ' · ' + sedinta : ''}`,
        html,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Resend error:', err);
      return res.status(500).json({ error: 'Email error', detail: err });
    }

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error('Register handler error:', err);
    return res.status(500).json({ error: 'Server error', detail: err.message });
  }
};
