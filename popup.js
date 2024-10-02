// Get current proxy status and IP address
chrome.storage.local.get(['proxyEnabled'], function(result) {
  let statusText = result.proxyEnabled ? "Enabled" : "Disabled";
  let statusElement = document.getElementById('status-text');
  let iconElement = document.getElementById('status-icon');

  if (result.proxyEnabled) {
    iconElement.classList.remove('disabled');
    iconElement.classList.add('enabled');
    iconElement.innerText = "ON";
    statusElement.innerText = "Proxy is enabled";
    fetchIPAddress(function(ip) {
      document.getElementById('ip-address').innerText = "IP: " + ip;
    });
  } else {
    iconElement.classList.remove('enabled');
    iconElement.classList.add('disabled');
    iconElement.innerText = "OFF";
    statusElement.innerText = "Proxy is disabled";
    document.getElementById('ip-address').innerText = "IP: Not available";
  }
});

function fetchIPAddress(callback) {
  fetch("http://ipinfo.io/json")
    .then(response => response.json())
    .then(data => callback(data.ip))
    .catch(err => console.log('Error fetching IP:', err));
}
