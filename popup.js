// Update proxy status and IP address in the popup
function updatePopup() {
  chrome.storage.local.get(['proxyEnabled'], function(result) {
    let statusElement = document.getElementById('status');
    let enableButton = document.getElementById('enable');
    let disableButton = document.getElementById('disable');
    let ipElement = document.getElementById('ip-address');
    let ipTypeElement = document.getElementById('ip-type');

    if (result.proxyEnabled) {
      statusElement.innerText = "Proxy is enabled";
      fetchIPAddress(function(ip, type) {
        ipElement.innerText = "IP: " + ip;
        ipTypeElement.innerText = "IP Type: " + type;
      });
      enableButton.disabled = true;
      disableButton.disabled = false;
    } else {
      statusElement.innerText = "Proxy is disabled";
      ipElement.innerText = "IP: Not available";
      ipTypeElement.innerText = "IP Type: Unknown";
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

// Fetch current IP address and its type
function fetchIPAddress(callback) {
  fetch("http://ipinfo.io/json")
    .then(response => response.json())
    .then(data => {
      let ip = data.ip;
      let type = classifyIPType(data.org);
      callback(ip, type);
    })
    .catch(err => console.log('Error fetching IP:', err));
}

// Function to classify the IP type (datacenter, residential, etc.)
function classifyIPType(organization) {
  if (organization.includes("AS")) {
    if (organization.toLowerCase().includes("mobile")) return "Mobile";
    if (organization.toLowerCase().includes("residential")) return "Residential";
    if (organization.toLowerCase().includes("vpn")) return "VPN";
    if (organization.toLowerCase().includes("datacenter") || organization.toLowerCase().includes("cloud")) return "Datacenter";
  }
  return "Business";
}

// Update the popup when opened
updatePopup();
