/* background.js */
const proxyConfig = {
  mode: "fixed_servers",
  rules: {
    singleProxy: {
      scheme: "socks5",
      host: "127.0.0.1",
      port: 9050
    },
    bypassList: ["localhost"]
  }
};

function setProxy() {
  chrome.proxy.settings.set({
    value: proxyConfig,
    scope: "regular"
  }, () => {
    console.log("SOCKS5 proxy set to 127.0.0.1:9050");
  });
}

chrome.runtime.onInstalled.addListener(setProxy);
chrome.runtime.onStartup.addListener(setProxy);
