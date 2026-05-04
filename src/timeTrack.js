let hostname = window.location.hostname;

// Normalize hostname (better than only stripping "www.")
hostname = hostname.replace(/^www\./, "");

// Current session state
let currentSession = createSession();


function createSession() {
  return {
    start: Date.now(),
    end: null,
    duration: 0
  };
}


// -------------------- VISIBILITY TRACKING --------------------
document.addEventListener("visibilitychange", () => {
  try {
    if (document.visibilityState === "visible") {
      currentSession = createSession();
      return;
    }

    if (document.visibilityState === "hidden") {
      currentSession.end = Date.now();
      currentSession.duration = currentSession.end - currentSession.start;

      chrome.runtime.sendMessage(
        {
          from: hostname,
          session: currentSession
        },
        (response) => {
          if (chrome.runtime.lastError) {
            console.warn("Message failed:", chrome.runtime.lastError.message);
            return;
          }

          console.log("Session sent:", response);
        }
      );

      currentSession = createSession();
    }
  } catch (err) {
    console.error("Visibility handler error:", err);
  }
});


// -------------------- SAFETY: TAB CLOSE FALLBACK --------------------
window.addEventListener("beforeunload", () => {
  try {
    currentSession.end = Date.now();
    currentSession.duration = currentSession.end - currentSession.start;

    chrome.runtime.sendMessage({
      from: hostname,
      session: currentSession
    });
  } catch (e) {
    console.warn("beforeunload send failed");
  }
});
