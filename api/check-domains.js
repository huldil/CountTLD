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
        if (!searchData.results) throw new Error('Invalid API response: No results');

        // Step 2: Check domain statuses in batches
        const domains = searchData.results.map(d => d.domain);

        // Define batch size (e.g., 10 domains per request)
        const batchSize = 10;
        const domainBatches = [];
        for (let i = 0; i < domains.length; i += batchSize) {
            domainBatches.push(domains.slice(i, i + batchSize));
        }

        // Step 3: Process each batch and collect results
        const allResults = [];
        for (const batch of domainBatches) {
            const statusUrl = `https://domainr.p.rapidapi.com/v2/status?domain=${batch.join(',')}`;
            const statusResponse = await fetch(statusUrl, {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                    'X-RapidAPI-Host': 'domainr.p.rapidapi.com'
                }
            });

            const statusData = await statusResponse.json();
            console.log("API Response (Status):", statusData);

            if (statusData.status) {
                const results = statusData.status.map(item => ({
                    domain: item.domain,
                    available: item.status.includes("undelegated"),  // "undelegated" means available
                    registerURL: `https://www.namecheap.com/domains/registration/results/?domain=${item.domain}`
                }));
                allResults.push(...results);
            }
        }

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json(allResults);
    } catch (error) {
        console.error(error);  // Log the error for debugging
        res.status(500).json({ error: error.message });
    }
}
