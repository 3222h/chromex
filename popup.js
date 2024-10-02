// Get current proxy status and IP address
chrome.storage.local.get(['proxyEnabled'], function(result) {
  let statusText = result.proxyEnabled ? "Enabled" : "Disabled";
  document.getElementById('status').innerText = "Status: " + statusText;

  if (result.proxyEnabled) {
    fetchIPAddress(function(ip) {
      document.getElementById('ip-address').innerText = "IP: " + ip;
    });
  } else {
    document.getElementById('ip-address').innerText = "IP: Not available";
  }
});

function fetchIPAddress(callback) {
  fetch("http://ipinfo.io/json")
    .then(response => response.json())
    .then(data => callback(data.ip))
    .catch(err => console.log('Error fetching IP:', err));
}
