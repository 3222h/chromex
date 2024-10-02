// Update proxy status and IP address in the popup
function updatePopup() {
  chrome.storage.local.get(['proxyEnabled'], function(result) {
    let statusElement = document.getElementById('status');
    let enableButton = document.getElementById('enable');
    let disableButton = document.getElementById('disable');
    let ipElement = document.getElementById('ip-address');
    let ipTypeElement = document.getElementById('ip-type');
    let countryElement = document.getElementById('country');
    let adjustedTimeElement = document.getElementById('adjusted-time');

    fetchIPAddress(function(ip, type, country, timezone) {
      ipElement.innerText = "IP: " + ip;
      ipTypeElement.innerText = "IP Type: " + type;
      countryElement.innerText = "Country: " + country;

      // Update the adjusted time in the popup
      if (timezone) {
        const adjustedTime = getAdjustedTime(timezone);
        adjustedTimeElement.innerText = "Time: " + adjustedTime;
      }
      
      // Update browser date and time if the proxy is enabled
      if (result.proxyEnabled) {
        setBrowserDateTime(timezone);
      }
    });

    if (result.proxyEnabled) {
      statusElement.innerText = "Proxy is enabled";
      enableButton.disabled = true;
      disableButton.disabled = false;
    } else {
      statusElement.innerText = "Proxy is disabled";
      enableButton.disabled = false;
      disableButton.disabled = true;
      adjustedTimeElement.innerText = "Time: Not available"; // Reset time when disabled
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

// Fetch current IP address, its type, country, and timezone
function fetchIPAddress(callback) {
  fetch("http://ipinfo.io/json")
    .then(response => response.json())
    .then(data => {
      let ip = data.ip;
      let type = classifyIPType(data.org);
      let country = data.country || "Unknown";
      let timezone = data.timezone || "UTC";

      callback(ip, type, country, timezone);
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

// Get the adjusted time based on the IP's timezone
function getAdjustedTime(timezone) {
  const options = { timeZone: timezone, hour: '2-digit', minute: '2-digit', second: '2-digit', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Intl.DateTimeFormat('en-US', options).format(new Date());
}

// Update the popup when opened
updatePopup();
