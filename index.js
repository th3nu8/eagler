// This entire function will run immediately when loaded by the bookmarklet.
(function() {
    // Exit if run from an environment without a window (like a worker)
    if (typeof window === 'undefined') return;

    const originalTitle = document.title;
    let content = '';

    // --- 1. Get Selected Content or URL ---
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
        const selectedPlainText = selection.toString().trim();

        // Simple regex to check if the selected text looks like a URL
        // It looks for patterns like: example.com, www.example.org, or https://...
        const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;

        if (urlRegex.test(selectedPlainText)) {
             // If it looks like a URL, open it directly and exit.
             // Prepend 'https://' if it's missing for reliable browsing.
             const finalUrl = selectedPlainText.startsWith('http') ? selectedPlainText : 'https://' + selectedPlainText;
             window.open(finalUrl, '_blank');
             return; // Stop the script here!
        }

        // If it's not a URL, get the HTML content of the selection
        const range = selection.getRangeAt(0);
        const container = document.createElement('div');
        container.appendChild(range.cloneContents());
        content = container.innerHTML;
    }

    // --- 2. Fallback to entire body HTML if nothing was selected ---
    if (!content.trim()) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = document.body.innerHTML;
        
        // Remove all script tags for a cleaner and safer isolation
        tempDiv.querySelectorAll('script').forEach(script => script.remove());
        content = tempDiv.innerHTML;
        
        console.log("Bookmarklet: No text selected. Injecting entire page body content (scripts removed).");
    }

    // --- 3. Construct the HTML for the new about:blank tab ---
    const newHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Isolated View: ${originalTitle}</title>
            <!-- Clean, simple styling for the isolated content -->
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    line-height: 1.6;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f0f3f5;
                    color: #2c3e50;
                }
                h1 {
                    color: #3498db;
                    border-bottom: 2px solid #ecf0f1;
                    padding-bottom: 10px;
                    margin-bottom: 20px;
                }
                .content-box {
                    padding: 20px;
                    border: 1px solid #c7dbe6;
                    border-radius: 12px;
                    background-color: #ffffff;
                    box-shadow: 0 8px 16px rgba(0,0,0,0.05);
                }
            </style>
        </head>
        <body>
            <h1>Isolated Content from: ${originalTitle}</h1>
            <div class="content-box">
                <!-- Inject the scraped content here -->
                ${content}
            </div>
        </body>
        </html>
    `;

    // --- 4. Open and write to the new window ---
    const newWindow = window.open('about:blank', '_blank');

    if (newWindow) {
        newWindow.document.write(newHtml);
        newWindow.document.close();
    } else {
        // Pop-up block handler
        console.error("Bookmarklet: Could not open new window. Check pop-up settings.");
    }
})();
