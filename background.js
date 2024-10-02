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
  updateIcon(true);
}

// Disable proxy
function disableProxy() {
  chrome.proxy.settings.clear({ scope: 'regular' }, function() {
    console.log('Proxy disabled.');
  });
  updateIcon(false);
}

// Update icon based on proxy status
function updateIcon(isEnabled) {
  let iconPath = isEnabled ? 'icon-enabled.png' : 'icon-disabled.png';
  chrome.browserAction.setIcon({ path: iconPath });
}

// Toggle proxy status on icon click
chrome.browserAction.onClicked.addListener(function() {
  chrome.storage.local.get(['proxyEnabled'], function(result) {
    let proxyEnabled = result.proxyEnabled || false;

    if (proxyEnabled) {
      disableProxy();
      chrome.storage.local.set({ proxyEnabled: false });
    } else {
      enableProxy();
      chrome.storage.local.set({ proxyEnabled: true });
    }
  });
});

// Apply saved proxy settings when the extension is started
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
