export default async function handler(req, res) {
    const { name } = req.query;

    if (!name) {
        return res.status(400).json({ error: 'Missing name parameter' });
    }

    try {
        // Step 1: Get domain suggestions
        const searchUrl = `https://domainr.p.rapidapi.com/v2/search?query=${name}`;
        const searchResponse = await fetch(searchUrl, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'domainr.p.rapidapi.com'
            }
        });

        const searchData = await searchResponse.json();
        if (!searchData.results) throw new Error('Invalid API response');

        // Step 2: Check domain statuses
        const domains = searchData.results.map(d => d.domain);
        const statusUrl = `https://domainr.p.rapidapi.com/v2/status?domain=${domains.join(',')}`;
        const statusResponse = await fetch(statusUrl, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'domainr.p.rapidapi.com'
            }
        });

        const statusData = await statusResponse.json();
        console.log("API Response (Status):", statusData);

        // Step 3: Process results correctly
        const results = statusData.status.map(item => ({
            domain: item.domain,
            available: item.status.includes("undelegated"),  // "undelegated" means available
            registerURL: `https://www.namecheap.com/domains/registration/results/?domain=${item.domain}`
        }));

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
