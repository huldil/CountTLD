export default async function handler(req, res) {
  const domain = req.query.domain; // Get domain from query parameter

  if (!domain) {
    return res.status(400).json({ error: 'Domain name is required' });
  }

  const apiKey = process.env.DOMAINR_API_KEY; // Get API key from environment variables
  const apiUrl = `https://api.domainr.com/v2/search?mashape-key=${apiKey}&query=${domain}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.results) {
      const count = data.results.length;
      return res.status(200).json({ domain, count });
    } else {
      return res.status(400).json({ error: 'Error fetching data' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching data from API' });
  }
}
