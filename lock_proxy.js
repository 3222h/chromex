/* lock_proxy.js */
chrome.proxy.settings.onChange.addListener(details => {
  if (details.value !== proxyConfig) {
    setProxy();
  }
});
