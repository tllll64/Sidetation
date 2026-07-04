// Sidetation extension: click the toolbar icon to inject / toggle the editor.
// Only activeTab is requested — the extension can touch a page exclusively
// when the user clicks the icon on that page.

const INJECTABLE = /^(https?|file):/;

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id || !INJECTABLE.test(tab.url ?? '')) return;
  const target = { tabId: tab.id };
  try {
    // 1. make sure the bundle is present (idempotent: UMD just re-assigns the global)
    await chrome.scripting.executeScript({ target, files: ['sidetation.js'] });
    // 2. init on first click, toggle on subsequent clicks; returns the new state
    const [{ result: active }] = await chrome.scripting.executeScript({
      target,
      func: () => {
        const g = globalThis;
        if (!g.__sidetation || !document.querySelector('[data-sidetation]')) {
          g.__sidetation = g.Sidetation.init({ autoStart: true });
          return true;
        }
        const inst = g.__sidetation;
        if (inst.isActive) {
          inst.deactivate();
          return false;
        }
        inst.activate();
        return true;
      },
    });
    await chrome.action.setBadgeText({ tabId: tab.id, text: active ? 'ON' : '' });
    await chrome.action.setBadgeBackgroundColor({ tabId: tab.id, color: '#3b6ef6' });
  } catch (err) {
    console.error('[sidetation] injection failed:', err);
  }
});
