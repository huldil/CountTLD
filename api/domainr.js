// api/domainr.js

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const domain = req.query.domain; // Get the domain from the query string
    const apiKey = 'b59542b91dmsh72d665487c3ab36p1863fajsn31653f5c463e'; // Your API key
    const apiUrl = `https://domainr.p.rapidapi.com/v2/search?mashape-key=${apiKey}&query=${domain}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'domainr.p.rapidapi.com'
        }
      });

      const data = await response.json();

      if (data.results) {
        res.status(200).json({ count: data.results.length });
      } else {
        res.status(400).json({ error: 'No results found' });
      }
    } catch (error) {
      console.error('Error fetching domain data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
