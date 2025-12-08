(function() {
    // *** STEP 1: Define the raw source URL ***
    const RAW_HTML_URL = 'https://cdn.jsdelivr.net/gh/th3nu8/eagler@refs/heads/main/EaglercraftX_1.8_u53_Offline_Signed.html'; // Example: 'https://raw.githubusercontent.com/user/repo/branch/index.html'
    
    // *** STEP 2: Fetch the HTML content ***
    fetch(RAW_HTML_URL)
        .then(response => {
            // Check if the network request was successful (status 200-299)
            if (!response.ok) {
                throw new Error('Failed to fetch HTML: ' + response.statusText);
            }
            return response.text();
        })
        .then(htmlText => {
            // *** STEP 3: Open a new about:blank window ***
            const newWindow = window.open('about:blank', '_blank');

            if (!newWindow) {
                // This usually happens if the browser blocks the popup
                alert("Popup blocked. Please allow popups for this site and try again.");
                return;
            }

            // *** STEP 4: Write the fetched HTML into the new window ***
            newWindow.document.write(htmlText);
            newWindow.document.close(); // Close the document stream to ensure content is rendered
        })
        .catch(e => {
            console.error("Error loading external HTML:", e);
            alert("Could not load HTML file. Check the console for details and ensure the URL is correct.");
        });
})();
