// Update proxy status and IP address in the popup
function updatePopup() {
  chrome.storage.local.get(['proxyEnabled', 'youtubeSettingsEnabled'], function(result) {
    let statusElement = document.getElementById('status');
    let enableButton = document.getElementById('enable');
    let disableButton = document.getElementById('disable');
    let ipElement = document.getElementById('ip-address');
    let ipTypeElement = document.getElementById('ip-type');
    let countryElement = document.getElementById('country');
    let adjustedTimeElement = document.getElementById('adjusted-time');
    let youtubeStatusElement = document.getElementById('youtube-status');
    let toggleYoutubeButton = document.getElementById('toggle-youtube');

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

    // Update proxy status
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

    // Update YouTube settings status
    if (result.youtubeSettingsEnabled) {
      youtubeStatusElement.innerText = "YouTube Settings are enabled";
      toggleYoutubeButton.innerText = "Disable YouTube Settings";
    } else {
      youtubeStatusElement.innerText = "YouTube Settings are off";
      toggleYoutubeButton.innerText = "Enable YouTube Settings";
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

// Toggle YouTube settings
document.getElementById('toggle-youtube').addEventListener('click', function() {
  chrome.storage.local.get(['youtubeSettingsEnabled'], function(result) {
    let newState = !result.youtubeSettingsEnabled;
    chrome.storage.local.set({ youtubeSettingsEnabled: newState }, function() {
      if (newState) {
        enableYouTubeSettings();
      } else {
        disableYouTubeSettings();
      }
      updatePopup();
    });
  });
});

// Enable YouTube playback settings
function enableYouTubeSettings() {
  chrome.tabs.query({ url: "*://www.youtube.com/*" }, function(tabs) {
    for (let tab of tabs) {
      chrome.tabs.executeScript(tab.id, {
        code: `
          const video = document.querySelector('video');
          if (video) {
            video.playbackRate = 0.25;
            video.setVideoQuality('small'); // 144p quality
          }
        `
      });
      console.log("YouTube settings enabled.");
    }
  });
}

// Disable YouTube playback settings
function disableYouTubeSettings() {
  chrome.tabs.query({ url: "*://www.youtube.com/*" }, function(tabs) {
    for (let tab of tabs) {
      chrome.tabs.executeScript(tab.id, {
        code: `
          const video = document.querySelector('video');
          if (video) {
            video.playbackRate = 1.0; // Reset to normal speed
            video.setVideoQuality('hd720'); // Reset to default quality (you can adjust this)
          }
        `
      });
      console.log("YouTube settings disabled.");
    }
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
    .catch(err => console.log('Error fetching IP:',
