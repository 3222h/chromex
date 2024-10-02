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

// Set the proxy by default to on
chrome.proxy.settings.set(
  { value: proxyConfig, scope: 'regular' },
  function() { console.log('Proxy enabled by default.'); }
);

// Function to disable the proxy
function disableProxy() {
  chrome.proxy.settings.clear({ scope: 'regular' }, function() {
    console.log('Proxy disabled.');
  });
}

// Listener for on/off toggle
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "enableProxy") {
    chrome.proxy.settings.set({ value: proxyConfig, scope: 'regular' }, function() {
      sendResponse({ status: "Proxy enabled" });
    });
  } else if (request.action === "disableProxy") {
    disableProxy();
    sendResponse({ status: "Proxy disabled" });
  }
  return true; // Ensures async response
});
