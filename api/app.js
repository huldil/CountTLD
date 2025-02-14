async function checkDomains() {
    const name = document.getElementById('domainInput').value.trim();
    const resultsDiv = document.getElementById('results');
    
    if (!name) {
        resultsDiv.innerHTML = '<p>Please enter a name to check</p>';
        return;
    }

    resultsDiv.innerHTML = '<p>Searching...</p>';

    try {
        const response = await fetch(`https://domainr.p.rapidapi.com/v2/search?query=${encodeURIComponent(name)}&defaults=com,net,org,io,co,ai,dev,app,xyz,info`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'b59542b91dmsh72d665487c3ab36p1863fajsn31653f5c463e',
                'X-RapidAPI-Host': 'domainr.p.rapidapi.com'
            }
        });

        if (!response.ok) throw new Error('API request failed');
        
        const data = await response.json();
        displayResults(data.results, name);
    } catch (error) {
        resultsDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    }
}

function displayResults(domains, searchTerm) {
    const resultsDiv = document.getElementById('results');
    let takenCount = 0;
    
    let html = '<div class="domain-list">';
    
    domains.forEach(domain => {
        const isTaken = domain.status.includes('active');
        if (isTaken) takenCount++;
        
        html += `
            <div class="domain-status">
                <span>${domain.domain}</span>
                <span class="${isTaken ? 'taken' : 'available'}">
                    ${isTaken ? 'Taken' : 'Available'}
                </span>
            </div>
        `;
    });

    html += '</div>';
    html += `<div class="summary">Out of ${domains.length} common TLDs checked, ${takenCount} are taken</div>`;
    
    resultsDiv.innerHTML = html;
}
