document.getElementById('searchButton').addEventListener('click', function() {
  const domain = document.getElementById('searchBox').value;
  if (domain) {
    fetchDomainResults(domain);
  }
});

function fetchDomainResults(domain) {
  const clientId = 'mashape-mustafaaras91';
  const apiUrl = `https://api.domainr.com/v2/status?client_id=${clientId}&domain=${domain}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      displayResults(data.results);
    })
    .catch(error => console.error('Error fetching data:', error));
}

function displayResults(results) {
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = ''; // Clear previous results

  if (results.length === 0) {
    resultsContainer.innerHTML = 'No domains found.';
    return;
  }

  results.forEach(result => {
    const domainElement = document.createElement('div');
    domainElement.classList.add('domain-result');
    
    // Create the domain link
    const domainLink = document.createElement('a');
    domainLink.href = result.registerURL;
    domainLink.target = '_blank';
    domainLink.textContent = result.domain;

    // Optionally, add more info (like the zone)
    const zoneElement = document.createElement('span');
    zoneElement.textContent = ` (${result.zone})`;
    domainElement.appendChild(domainLink);
    domainElement.appendChild(zoneElement);

    // Append to the results container
    resultsContainer.appendChild(domainElement);
  });
}
