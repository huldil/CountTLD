const https = require('https');

export default function handler(req, res) {
  const domain = req.query.query;

  if (!domain) {
    res.status(400).json({ error: 'Domain query is required' });
    return;
  }

  const options = {
    method: 'GET',
    hostname: 'domainr.p.rapidapi.com',
    port: null,
    path: `/v2/search?query=${domain}`, // This dynamically inserts the domain query
    headers: {
      'x-rapidapi-key': 'b59542b91dmsh72d665487c3ab36p1863fajsn31653f5c463e',
      'x-rapidapi-host': 'domainr.p.rapidapi.com'
    }
  };

  const request = https.request(options, function (response) {
    const chunks = [];

    response.on('data', function (chunk) {
      chunks.push(chunk);
    });

    response.on('end', function () {
      const body = Buffer.concat(chunks);
      const result = JSON.parse(body.toString());

      if (result.results) {
        res.status(200).json({ count: result.results.length });
      } else {
        res.status(500).json({ error: 'Error fetching domain data' });
      }
    });
  });

  request.on('error', function (error) {
    res.status(500).json({ error: 'Request failed', details: error.message });
  });

  request.end();
}
