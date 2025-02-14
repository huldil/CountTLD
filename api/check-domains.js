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
        if (!searchData.results || !Array.isArray(searchData.results)) {
            throw new Error('Invalid API response or no results found');
        }

        // Step 2: Extract domain names
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

        // Step 3: Check if statusData.status exists and is an array
        if (!statusData || !statusData.status || !Array.isArray(statusData.status)) {
            throw new Error('Invalid status data or missing status field');
        }

        // Count taken domains (where status is "active" or "active zone tld")
        const takenDomainsCount = statusData.status.filter(item => 
            item.status === "active" || item.status === "active zone tld"
        ).length;

        // Return just the number of taken domains
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json({ takenDomainsCount });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    }
}
