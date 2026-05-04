// -------------------- INIT STORAGE --------------------
chrome.runtime.onInstalled.addListener(async () => {
  const data = await chrome.storage.local.get("sessions");
  if (!data.sessions) {
    await chrome.storage.local.set({ sessions: {} });
  }

  // 🔥 Inject content scripts into already open tabs
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    if (tab.id && tab.url?.startsWith("http")) {
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["content.js"] // 👈 your content script file
        });
      } catch (err) {
        console.warn("Injection failed:", tab.url);
      }
    }
  }
});


// -------------------- MESSAGE HANDLER --------------------
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (!request?.from || !request?.session) {
    sendResponse({ status: "error", message: "Invalid request" });
    return;
  }

  handleSession(request)
    .then(() => sendResponse({ status: "ok" }))
    .catch(() => sendResponse({ status: "error" }));

  return true; // 🔥 Required for async response
});


// -------------------- SESSION HANDLER --------------------
async function handleSession(request) {
  const data = await chrome.storage.local.get("sessions");
  const sessions = data.sessions || {};

  if (!sessions[request.from]) {
    sessions[request.from] = { sessions: [] };
  }

  sessions[request.from].sessions.push(request.session);

  await chrome.storage.local.set({ sessions });
}
