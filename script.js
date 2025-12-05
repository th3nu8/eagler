<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>External Content Loader</title>
    <!-- Load Tailwind CSS for modern styling -->
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        /* Custom styles to ensure the page looks good */
        body {
            font-family: 'Inter', sans-serif;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #f3f4f6;
        }
    </style>
</head>
<body>

    <div class="p-8 bg-white shadow-2xl rounded-xl max-w-lg w-full">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">External Code Loader</h1>
        <p class="text-sm text-gray-600 mb-6">
            This script fetches HTML content from the specified JSDelivr link and executes it in a new window.
            <strong class="text-red-600">Warning:</strong> Always ensure the source of the code is trustworthy before running external content.
        </p>

        <label for="repoUrl" class="block text-sm font-medium text-gray-700 mb-2">JSDelivr Repository URL (HTML File)</label>
        <input
            type="text"
            id="repoUrl"
            value="https://cdn.jsdelivr.net/gh/donket-donk/EaglercraftX_1.8_u37_Offline_Signed@refs/heads/main/EaglercraftX_1.8_u37_Offline_Signed.html"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 mb-6 text-sm"
            readonly
        />

        <button
            id="runButton"
            class="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md hover:shadow-lg"
            onclick="loadAndRunContent()"
        >
            Load & Run Content in New Tab
        </button>

        <div id="messageBox" class="mt-6 p-3 text-sm text-yellow-800 bg-yellow-100 rounded-lg hidden" role="alert">
            <!-- Messages will appear here -->
        </div>
    </div>

    <script>
        // Global utility to show messages
        const messageBox = document.getElementById('messageBox');
        function showMessage(text, isError = false) {
            messageBox.textContent = text;
            messageBox.classList.remove('hidden');
            if (isError) {
                messageBox.classList.remove('bg-yellow-100', 'text-yellow-800');
                messageBox.classList.add('bg-red-100', 'text-red-800');
            } else {
                messageBox.classList.remove('bg-red-100', 'text-red-800');
                messageBox.classList.add('bg-yellow-100', 'text-yellow-800');
            }
        }

        /**
         * Fetches HTML content from the URL and writes it to a new, blank window.
         */
        async function loadAndRunContent() {
            const urlInput = document.getElementById('repoUrl');
            const url = urlInput.value.trim();

            if (!url) {
                showMessage("Please enter a URL.", true);
                return;
            }

            showMessage("Fetching content... Please wait.");
            
            try {
                // 1. Fetch the content from the remote URL
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const htmlContent = await response.text();
                
                // 2. Open a new window (defaults to about:blank)
                // We use a specific name to ensure it reuses the same window if clicked multiple times
                const newWindow = window.open('', 'ExternalContentRunner', 'width=800,height=600');

                if (!newWindow) {
                    showMessage("Popup blocked! Please allow popups for this site.", true);
                    return;
                }

                // 3. Write the fetched HTML content into the new window's document
                newWindow.document.write(htmlContent);

                // 4. Close the document stream to finish loading the content
                newWindow.document.close();
                
                showMessage("Content successfully loaded and running in the new tab!");

            } catch (error) {
                console.error("Error loading content:", error);
                showMessage(`Failed to load content: ${error.message}`, true);
            }
        }
    </script>
</body>
</html>
