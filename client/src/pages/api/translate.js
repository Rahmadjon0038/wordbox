// pages/api/translate.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { text, target = 'uz' } = req.body;

  // Google Cloud API key (add to .env.local)
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Google Translate API key not set' });
  }

  const response = await fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        target,
        format: 'text',
      }),
    }
  );

  const data = await response.json();
  if (data.error) {
    return res.status(500).json({ error: data.error.message });
  }
  res.status(200).json({ translation: data.data.translations[0].translatedText });
}
