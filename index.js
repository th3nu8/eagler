// Bookmarklet function wrapped in an IIFE
(async function() {
    // -------------------------------------------------------------------------
    // !!! IMPORTANT !!!
    // REPLACE THIS PLACEHOLDER URL with the RAW link to your GitHub HTML file.
    // A raw link starts with: https://raw.githubusercontent.com/...
    // -------------------------------------------------------------------------
    const githubUrl = 'https://cdn.jsdelivr.net/gh/donket-donk/EaglercraftX_1.8_u37_Offline_Signed@refs/heads/main/EaglercraftX_1.8_u37_Offline_Signed.html';

    let htmlContent = '';

    try {
        // 1. Fetch the raw HTML file content from GitHub
        const response = await fetch(githubUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        htmlContent = await response.text();

    } catch (error) {
        // If fetch fails (e.g., bad URL, CORS issue, file not found)
        const errorMessage = `
            <h1>Failed to Load GitHub Content</h1>
            <p>Could not load HTML from the specified URL.</p>
            <p><strong>Error:</strong> ${error.message}</p>
            <p>Please ensure the URL in your bookmarklet code is the <strong>RAW</strong> link to the HTML file.</p>
        `;
        htmlContent = errorMessage;
    }

    // 2. Open a new window and write the content
    const newWindow = window.open('about:blank', '_blank');

    if (newWindow) {
        newWindow.document.write(htmlContent);
        newWindow.document.close();
    } else {
        // Handle pop-up blocker
        console.error("Pop-up blocked. Please allow pop-ups for this site to run the bookmarklet.");
    }
})();
