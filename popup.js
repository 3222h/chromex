// Update proxy status and IP address in the popup
function updatePopup() {
  chrome.storage.local.get(['proxyEnabled'], function(result) {
    let statusElement = document.getElementById('status');
    let enableButton = document.getElementById('enable');
    let disableButton = document.getElementById('disable');
    let ipElement = document.getElementById('ip-address');

    if (result.proxyEnabled) {
      statusElement.innerText = "Proxy is enabled";
      fetchIPAddress(function(ip) {
        ipElement.innerText = "IP: " + ip;
      });
      enableButton.disabled = true;
      disableButton.disabled = false;
    } else {
      statusElement.innerText = "Proxy is disabled";
      ipElement.innerText = "IP: Not available";
      enableButton.disabled = false;
      disableButton.disabled = true;
    }
  });
}

// Enable proxy
document.getElementById('enable').addEventListener('click', function() {
  chrome.storage.local.set({ proxyEnabled: true }, function() {
    chrome.proxy.settings.set({
      value: {
        mode: "fixed_servers",
        rules: {
          singleProxy: {
            scheme: "socks5",
            host: "127.0.0.1",
            port: 9050
          }
        }
      }
    }, function() {
      console.log("Proxy enabled");
      updatePopup();
    });
  });
});

// Disable proxy
document.getElementById('disable').addEventListener('click', function() {
  chrome.storage.local.set({ proxyEnabled: false }, function() {
    chrome.proxy.settings.clear({}, function() {
      console.log("Proxy disabled");
      updatePopup();
    });
  });
});

// Fetch current IP address
function fetchIPAddress(callback) {
  fetch("http://ipinfo.io/json")
    .then(response => response.json())
    .then(data => callback(data.ip))
    .catch(err => console.log('Error fetching IP:', err));
}

// Update the popup when opened
updatePopup();
