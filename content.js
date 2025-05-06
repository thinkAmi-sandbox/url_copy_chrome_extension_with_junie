// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "copyMarkdownUrl") {
    // Send response immediately to acknowledge receipt of the message
    sendResponse({ status: "received" });
    const pageTitle = document.title;
    const pageUrl = request.url;

    // Format the URL in markdown format
    const markdownUrl = `[${pageTitle}](${pageUrl})`;

    // Copy to clipboard
    try {
      // Try using the Clipboard API
      navigator.clipboard.writeText(markdownUrl)
        .then(() => {
          // Show notification
          showNotification(`Markdown URL copied to clipboard: ${markdownUrl}`);
        })
        .catch(err => {
          // Fallback to execCommand method
          fallbackCopyToClipboard(markdownUrl);
        });
    } catch (error) {
      // Fallback to execCommand method
      fallbackCopyToClipboard(markdownUrl);
    }
  }
  // Return true to indicate that the response will be sent asynchronously
  return true;
});

// Fallback method for copying to clipboard using execCommand
function fallbackCopyToClipboard(text) {
  try {
    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = text;

    // Make the textarea out of viewport
    textarea.style.position = 'fixed';
    textarea.style.left = '-999999px';
    textarea.style.top = '-999999px';

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    // Execute the copy command
    const successful = document.execCommand('copy');

    // Remove the temporary element
    document.body.removeChild(textarea);

    if (successful) {
      showNotification(`Markdown URL copied to clipboard: ${text}`);
    } else {
      showNotification("Failed to copy to clipboard. Please try again.");
    }
  } catch (err) {
    showNotification("Failed to copy: " + err);
  }
}

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
