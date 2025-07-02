export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.AIRTABLE_TOKEN;
  const baseId = 'appNEwC9kmw1NTshd';
  const table = 'Submissions';

  const {
    name,
    type,
    location,
    description,
    link,
    tips,
    eventDate,
    startTime,
    endTime,
    recurring,
    frequency,
    registrationRequired,
    created,
    photos,
    photoFilePaths,
  } = req.body;

  try {
    const airtableResponse = await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          'Event name': name,
          'Type': type,
          'Location': location,
          'Description': description,
          'Link': link,
          'Parent tips': tips,
          'Event Date': eventDate,
          'Start time': startTime,
          'End time': endTime,
          'Recurring': recurring,
          'Frequency': frequency,
          'Registration required': registrationRequired,
          'Created': created,
          'Photos': photos || [],
          'Photos file paths': photoFilePaths || [],
        },
      }),
    });

    const result = await airtableResponse.json();

    if (!airtableResponse.ok) {
      throw new Error(result.error?.message || 'Airtable error');
    }

    res.status(200).json({ success: true, id: result.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
