export default async function handler(req, res) {
    const { name } = req.query;

    if (!name) {
        return res.status(400).json({ error: 'Missing name parameter' });
    }

    try {
        const apiUrl = new URL('https://domainr.p.rapidapi.com/v2/search');
        apiUrl.searchParams.set('query', name);
        apiUrl.searchParams.set('defaults', 'club,coffee');
        apiUrl.searchParams.set('registrar', 'dnsimple.com');
        apiUrl.searchParams.set('location', 'de');

        const response = await fetch(apiUrl.toString(), {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'domainr.p.rapidapi.com'
            }
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
