document.getElementById('searchButton').addEventListener('click', function() {
  const domain = document.getElementById('searchBox').value;
  if (domain) {
    fetchDomainResults(domain);
  }
});

function fetchDomainResults(domain) {
  // Simulating the domain results you showed earlier.
  const results = [
    {
      domain: 'harrybolz.com',
      zone: 'com',
      registerURL: 'https://api.domainr.com/v2/register?client_id=mashape-mustafaaras91&domain=harrybolz.com&gl=US%2Cashburn%2CUS-VA&registrar=&source='
    },
    {
      domain: 'harrybolz.net',
      zone: 'net',
      registerURL: 'https://api.domainr.com/v2/register?client_id=mashape-mustafaaras91&domain=harrybolz.net&gl=US%2Cashburn%2CUS-VA&registrar=&source='
    },
    {
      domain: 'harrybolz.org',
      zone: 'org',
      registerURL: 'https://api.domainr.com/v2/register?client_id=mashape-mustafaaras91&domain=harrybolz.org&gl=US%2Cashburn%2CUS-VA&registrar=&source='
    },
    {
      domain: 'harrybolz.us',
      zone: 'us',
      registerURL: 'https://api.domainr.com/v2/register?client_id=mashape-mustafaaras91&domain=harrybolz.us&gl=US%2Cashburn%2CUS-VA&registrar=&source='
    }
  ];

  displayResults(results);
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
