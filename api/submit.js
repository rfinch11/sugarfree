export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://sugar-free.family');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Access-Control-Allow-Origin', 'https://sugar-free.family');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fields, captchaToken } = req.body;

  // 🔐 reCAPTCHA verification
  const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET;
  const captchaVerify = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${RECAPTCHA_SECRET}&response=${captchaToken}`
  });

  const captchaResult = await captchaVerify.json();
  if (!captchaResult.success) {
    res.setHeader('Access-Control-Allow-Origin', 'https://sugar-free.family');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(403).json({ error: 'reCAPTCHA verification failed' });
  }

  const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
  const BASE_ID = 'appNEwC9kmw1NTshd';
  const TABLE_NAME = 'Submissions';
  const airtableUrl = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}`;

  try {
    const airtableRes = await fetch(airtableUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fields })
    });

    const data = await airtableRes.json();
    if (!airtableRes.ok) {
      res.setHeader('Access-Control-Allow-Origin', 'https://sugar-free.family');
      res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      return res.status(airtableRes.status).json({ error: data.error });
    }

    res.setHeader('Access-Control-Allow-Origin', 'https://sugar-free.family');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).json({ success: true, data });
  } catch (err) {
    res.setHeader('Access-Control-Allow-Origin', 'https://sugar-free.family');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
}
