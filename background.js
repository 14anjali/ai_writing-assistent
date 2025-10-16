chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === 'rewrite_request') {
    const userText = message.text;
    const site = message.site;

    try {
      // Call the local backend instead of Gemini API directly
      const response = await fetch('http://localhost:3000/ai/suggest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: userText, site: site })
      });

      const data = await response.json();
      const suggestion = data.suggestion || 'Could not generate suggestion';

      sendResponse({ suggestion });
    } catch (err) {
      console.error('Error fetching from backend:', err);
      sendResponse({ suggestion: 'Error generating suggestion' });
    }
  }

  // Keep the message channel open for async response
  return true;
});
