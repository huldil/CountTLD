// domainr.js

export async function getDomainData(domain) {
  const apiKey = 'b59542b91dmsh72d665487c3ab36p1863fajsn31653f5c463e'; // Your actual API key
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
      return data.results.length; // Return the count of registered domains
    } else {
      throw new Error('No results found');
    }
  } catch (error) {
    console.error('Error fetching domain data:', error);
    return null; // Return null if there was an error
  }
}
