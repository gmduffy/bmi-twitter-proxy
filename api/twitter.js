export default async function handler(req, res) {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    const twitterRes = await fetch(
      `https://api.twitter.com/2/users/by/username/${username}?user.fields=profile_image_url,name,username`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        },
      }
    );

    if (!twitterRes.ok) {
      throw new Error(`Twitter API error: ${twitterRes.status}`);
    }

    const { data } = await twitterRes.json();

    if (!data) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to fetch Twitter data' });
  }
}
