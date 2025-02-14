async function checkDomains() {
    const name = document.getElementById('domainInput').value.trim();
    const resultsDiv = document.getElementById('results');
    
    if (!name) {
        resultsDiv.innerHTML = '<p>Please enter a name to check</p>';
        return;
    }

    resultsDiv.innerHTML = '<p>Searching...</p>';

    try {
        const response = await fetch(`/api/check-domains?name=${encodeURIComponent(name)}`);
        
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
        const isTaken = domain.status && domain.status.includes('active');
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
    html += `<div class="summary">Out of ${domains.length} TLDs checked, ${takenCount} are taken</div>`;
    
    resultsDiv.innerHTML = html;
}
