export default async function handler(req, res) {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    const response = await fetch(
      `https://cdn.syndication.twimg.com/widgets/followbutton/info.json?screen_names=${username}`,
      { headers: { 'User-Agent': 'Mozilla/5.0' } }
    );

    if (!response.ok) {
      throw new Error(`Twitter API error: ${response.status}`);
    }

    const data = await response.json();
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data[0]);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to fetch Twitter data' });
  }
}
