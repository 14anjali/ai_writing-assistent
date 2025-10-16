(function () {
  "use strict";
  function safeQuery(selector) {
    try {
      return document.querySelector(selector);
    } catch (e) {
      console.error("safeQuery failed for selector:", selector, e);
      return null;
    }
  }
   function findComposer() {
    const gmail = safeQuery(
      'div[aria-label="Message Body"], div[aria-label="Write a message…"], div[role="textbox"][aria-label*="Message"]'
    );
    if (gmail) return { site: "gmail", el: gmail };

    const twitter = safeQuery(
      'div[role="textbox"][data-testid*="tweetTextarea"], div[aria-label="Tweet text"]'
    );
    if (twitter) return { site: "twitter", el: twitter };

    const linkedin = safeQuery(
      'div[role="textbox"][aria-label*="Create a post"], div[role="textbox"][aria-label*="Start a post"]'
    );
    if (linkedin) return { site: "linkedin", el: linkedin };

    return null;
  }
  function addSuggestButton(composerData) {
    const button = document.createElement("button");
    button.textContent = "Suggest";
    button.style.marginLeft = "8px";

button.addEventListener("click", () => {
  const text = composerData.el.innerText || composerData.el.value;
  const originalText = text;

button.disabled=true
  composerData.el.innerText = "Generating...";

  chrome.runtime.sendMessage(
    { action: "rewrite_request", text, site: composerData.site },
    (response) => {
      // Replace with AI suggestion or fallback to original text
      composerData.el.innerText = response?.suggestion || originalText;
      button.disabled=false
    }
  );
});


    composerData.el.parentNode.appendChild(button);
  }

   const intervalId = setInterval(() => {
    const composerData = findComposer();
    if (composerData) {
      addSuggestButton(composerData);
      clearInterval(intervalId); // stop polling after button is added
    }
  }, 1000);
})();
