(function() {
    // --- Configuration: HTML Files and Image URLs ---

    const LAUNCH_FILES = [
        {
            name:"Eaglercraft 1.12",
            url:"https://cdn.jsdelivr.net/gh/th3nu8/eagler@main/1.12.html"
        },
        {
            name: "Eaglercraft 1.8",
            url: "https://cdn.jsdelivr.net/gh/th3nu8/eagler@refs/heads/main/EaglercraftX_1.8_u53_Offline_Signed.html"
        },
        {
            name:"Eaglercraft 1.5.2",
            url:"https://cdn.jsdelivr.net/gh/th3nu8/eagler@main/1.5.2.html"
        },
        {
            name:"Eaglercraft Beta 1.7.3",
            url:"https://cdn.jsdelivr.net/gh/th3nu8/eagler@main/1.7.3.html"
        }
    ];

    const BACKGROUND_IMAGE_URL = 'https://raw.githubusercontent.com/th3nu8/eagler/main/IMG_0018.jpeg';
    // This image is used for the header bar AND the button backgrounds.
    const TEXTURE_IMAGE_URL = 'https://raw.githubusercontent.com/th3nu8/eagler/main/IMG_0019.jpeg';
    const HEADER_TEXT = "Eaglercraft Bookmark Launcher";

    // --- Core Functions ---

    /**
     * Fetches the content of a remote HTML file and opens it in a new about:blank window.
     * @param {string} rawHtmlUrl The URL of the HTML file to fetch.
     */
    function launchHtmlInNewWindow(rawHtmlUrl) {
        fetch(rawHtmlUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch HTML: ' + response.statusText);
                }
                return response.text();
            })
            .then(htmlText => {
                const newWindow = window.open('about:blank', '_blank');

                if (!newWindow) {
                    alert("Popup blocked. Please allow popups for this site and try again.");
                    return;
                }

                newWindow.document.write(htmlText);
                newWindow.document.close();
            })
            .catch(e => {
                console.error("Error loading external HTML:", e);
                alert(`Could not load HTML file from ${rawHtmlUrl}. Check the console for details.`);
            });
    }

    /**
     * Creates and injects the UI element onto the current page using a Shadow DOM.
     */
    function createLauncherUI() {
        // 1. Create the container for the Shadow DOM
        const hostElement = document.createElement('div');
        hostElement.id = 'launcher-host';
        document.body.appendChild(hostElement);

        // 2. Attach the Shadow DOM to isolate styles
        const shadowRoot = hostElement.attachShadow({ mode: 'open' });

        // 3. Create the necessary CSS styles (scoped to the Shadow DOM)
        const style = document.createElement('style');
        style.textContent = `
            /* Container for the entire centered UI */
            .launcher-container {
                position: fixed;
                top: 50%; /* Center vertically */
                left: 50%; /* Center horizontally */
                transform: translate(-50%, -50%); /* Fine-tune centering */
                width: 90%;
                max-width: 400px;
                border: 4px solid #333;
                border-radius: 10px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.7);
                z-index: 10000;
                overflow: hidden;
                background: url(${BACKGROUND_IMAGE_URL}) no-repeat center center/cover;
                color: white;
                font-family: Arial, sans-serif;
                backdrop-filter: blur(3px);
                box-sizing: border-box; /* Crucial for isolated sizing */
            }

            /* Header texture at the top of the UI window */
            .launcher-header {
                width: 100%;
                height: 50px;
                background: url(${TEXTURE_IMAGE_URL}) repeat-x center center/auto 100%;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0 10px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
                border-bottom: 2px solid #555;
            }

            .header-title {
                margin: 0;
                font-size: 1.2em;
                font-weight: bold;
                text-shadow: 2px 2px 4px #000;
                text-align: center;
            }

            /* Content area for buttons */
            .button-content {
                padding: 20px;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            
            /* Button styles: NOW using the texture image as background */
            .launch-button {
                padding: 10px 15px;
                border: 2px solid white;
                border-radius: 5px;
                background: url(${TEXTURE_IMAGE_URL}) repeat center center/auto 100%; /* Use the texture image */
                color: white;
                font-size: 1em;
                cursor: pointer;
                transition: opacity 0.3s ease;
                font-weight: bold;
                text-shadow: 1px 1px 2px #000; /* Add text shadow for visibility */
            }
            .launch-button:hover {
                opacity: 0.85; /* Simple visual feedback on hover */
            }
        `;
        shadowRoot.appendChild(style);

        // 4. Create the main launcher container
        const launcherContainer = document.createElement('div');
        launcherContainer.className = 'launcher-container';

        // 5. Create Header Bar (Image + Text)
        const header = document.createElement('div');
        header.className = 'launcher-header';
        
        const title = document.createElement('h1');
        title.className = 'header-title';
        title.textContent = HEADER_TEXT;
        header.appendChild(title);
        
        launcherContainer.appendChild(header);

        // 6. Create Button Content Area
        const buttonContent = document.createElement('div');
        buttonContent.className = 'button-content';

        // 7. Create and add a button for each file
        LAUNCH_FILES.forEach(file => {
            const button = document.createElement('button');
            button.className = 'launch-button';
            button.textContent = file.name;
            
            // Attach the click event to launch the game
            button.addEventListener('click', () => launchHtmlInNewWindow(file.url));

            buttonContent.appendChild(button);
        });

        launcherContainer.appendChild(buttonContent);

        // 8. Append the launcher UI to the Shadow DOM root
        shadowRoot.appendChild(launcherContainer);
    }

    // --- Initialization ---

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createLauncherUI);
    } else {
        createLauncherUI();
    }
})();
