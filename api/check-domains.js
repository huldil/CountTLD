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

        // Step 2: Count the number of TLDs that are "taken"
        const domains = searchData.results.map(d => d.domain);

        // Make a request to check the status of these domains
        const statusUrl = `https://domainr.p.rapidapi.com/v2/status?domain=${domains.join(',')}`;
        const statusResponse = await fetch(statusUrl, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'domainr.p.rapidapi.com'
            }
        });

        const statusData = await statusResponse.json();

        if (statusData.status) {
            // Count the number of domains that are not available (status includes "undelegated" means available)
            const takenCount = statusData.status.filter(item => !item.status.includes("undelegated")).length;

            // Return the result
            res.status(200).json({ message: `${name} has taken in ${takenCount} TLDs` });
        } else {
            throw new Error('No status data received');
        }
    } catch (error) {
        console.error(error);  // Log the error for debugging
        res.status(500).json({ error: error.message });
    }
}
