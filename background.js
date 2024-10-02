// Default proxy configuration (SOCKS5 proxy on localhost:9050)
let proxyConfig = {
  mode: "fixed_servers",
  rules: {
    singleProxy: {
      scheme: "socks5",
      host: "127.0.0.1",
      port: 9050
    }
  }
};

// Enable proxy
function enableProxy() {
  chrome.proxy.settings.set({ value: proxyConfig, scope: 'regular' }, function() {
    console.log('Proxy enabled.');
  });
}

// Disable proxy
function disableProxy() {
  chrome.proxy.settings.clear({ scope: 'regular' }, function() {
    console.log('Proxy disabled.');
  });
}

// Apply saved proxy settings when the extension starts
function applySavedProxyState() {
  chrome.storage.local.get(['proxyEnabled'], function(result) {
    if (result.proxyEnabled) {
      enableProxy();
    } else {
      disableProxy();
    }
  });
}

chrome.runtime.onStartup.addListener(applySavedProxyState);
chrome.runtime.onInstalled.addListener(applySavedProxyState);
