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
      }, (response) => {
        // Check for any error that might have occurred
        if (chrome.runtime.lastError) {
          // Try to inject the content script manually and retry
          chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            files: ['content.js']
          }, () => {
            // Retry sending the message after injecting the content script
            chrome.tabs.sendMessage(activeTab.id, { 
              action: "copyMarkdownUrl",
              url: activeTab.url
            });
          });
        }
      });
    });
  }
});
