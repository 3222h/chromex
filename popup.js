document.getElementById('toggle-on').addEventListener('click', function() {
  chrome.runtime.sendMessage({ action: "enableProxy" }, function(response) {
    document.getElementById('status').innerText = "Status: " + response.status;
  });
});

document.getElementById('toggle-off').addEventListener('click', function() {
  chrome.runtime.sendMessage({ action: "disableProxy" }, function(response) {
    document.getElementById('status').innerText = "Status: " + response.status;
  });
});
