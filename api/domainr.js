document.getElementById('searchButton').addEventListener('click', function() {
    var query = document.getElementById('query').value;
    if (!query) {
        alert("Please enter a search query");
        return;
    }

    var apiUrl = `https://domainr.p.rapidapi.com/v2/search?defaults=club%2Ccoffee&query=${encodeURIComponent(query)}&registrar=dnsimple.com&location=de`;

    fetch(apiUrl, {
        method: 'GET',
        headers: {
            "X-Rapidapi-Key": "b59542b91dmsh72d665487c3ab36p1863fajsn31653f5c463e",
            "X-Rapidapi-Host": "domainr.p.rapidapi.com",
            "Host": "domainr.p.rapidapi.com"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data); // Check the API response in the browser console
        document.getElementById('results').textContent = JSON.stringify(data, null, 2);
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('results').textContent = 'Error: ' + error.message;
    });
});
