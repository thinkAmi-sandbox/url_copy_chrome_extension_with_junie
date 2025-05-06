
# Chrome Extension Design: Markdown URL Formatter

Based on the guidelines, I'll design a Chrome extension that automatically formats the current page's URL and title into markdown format and copies it to the clipboard.

## Extension Structure

```
markdown-url-formatter/
├── manifest.json         # Extension configuration
├── background.js         # Background script for handling keyboard shortcuts
├── content.js            # Content script for accessing page title and showing notifications
├── popup.html            # Simple popup UI (optional)
├── popup.js              # Popup logic (optional)
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md             # Documentation
```

## Key Components

### 1. manifest.json
```json
{
  "manifest_version": 3,
  "name": "Markdown URL Formatter",
  "version": "1.0",
  "description": "Copy the current page URL and title in markdown format with a keyboard shortcut",
  "permissions": ["activeTab", "clipboardWrite", "commands"],
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  "commands": {
    "copy-markdown-url": {
      "suggested_key": {
        "default": "Ctrl+I",
        "mac": "Command+I"
      },
      "description": "Copy current page URL in markdown format"
    }
  },
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"]
    }
  ],
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  }
}
```

### 2. background.js
```javascript
// Listen for the keyboard shortcut
chrome.commands.onCommand.addListener((command) => {
  if (command === "copy-markdown-url") {
    // Get the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      
      // Execute content script to get the title and format the URL
      chrome.tabs.sendMessage(activeTab.id, { 
        action: "copyMarkdownUrl",
        url: activeTab.url
      });
    });
  }
});
```

### 3. content.js
```javascript
// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "copyMarkdownUrl") {
    const pageTitle = document.title;
    const pageUrl = request.url;
    
    // Format the URL in markdown format
    const markdownUrl = `[${pageTitle}](${pageUrl})`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(markdownUrl)
      .then(() => {
        // Show notification
        showNotification("Markdown URL copied to clipboard!");
      })
      .catch(err => {
        showNotification("Failed to copy: " + err);
      });
  }
});

// Function to show notification
function showNotification(message) {
  // Create notification element
  const notification = document.createElement("div");
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #4CAF50;
    color: white;
    padding: 16px;
    border-radius: 4px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    z-index: 10000;
    font-family: Arial, sans-serif;
    font-size: 16px;
  `;
  
  // Add to page
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.5s';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 500);
  }, 3000);
}
```

### 4. popup.html (Optional)
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      width: 300px;
      padding: 10px;
      font-family: Arial, sans-serif;
    }
    button {
      width: 100%;
      padding: 8px;
      margin-top: 10px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:hover {
      background-color: #45a049;
    }
  </style>
</head>
<body>
  <h2>Markdown URL Formatter</h2>
  <p>Press <b>Ctrl+I</b> (Windows) or <b>Cmd+I</b> (Mac) to copy the current page URL in markdown format.</p>
  <button id="copyButton">Copy Markdown URL</button>
  <script src="popup.js"></script>
</body>
</html>
```

### 5. popup.js (Optional)
```javascript
document.getElementById('copyButton').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, { 
      action: "copyMarkdownUrl",
      url: activeTab.url
    });
  });
});
```

## How It Works

1. When the user presses the keyboard shortcut (Ctrl+I on Windows or Cmd+I on macOS), the background script is triggered.
2. The background script gets the active tab's information and sends a message to the content script.
3. The content script retrieves the page title, formats it with the URL in markdown format, and copies it to the clipboard.
4. A notification appears on the page to confirm the successful copy.
5. Optionally, the user can also click a button in the popup to perform the same action.

## Implementation Notes

1. The extension uses Manifest V3, which is the current recommended format for Chrome extensions.
2. The keyboard shortcut is registered in the manifest.json file.
3. The clipboard API is used to copy the formatted text.
4. A temporary notification is created and displayed on the page to provide feedback.
5. The extension requires minimal permissions: only activeTab (to access the current tab's URL and title) and clipboardWrite (to copy to clipboard).

This design fulfills all the requirements specified in the guidelines document and provides a simple, efficient solution for the problem.