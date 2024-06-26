window.onload = function () {
  // Fetch IPv4 Address
  fetch("https://api.ipify.org?format=json")
    .then((response) => response.json())
    .then((ipv4Data) => {
      const ipv4Address = ipv4Data.ip;
      document.getElementById("ipv4-address").innerText = ipv4Address;

      // Fetch IPv6 Address
      fetch("https://api64.ipify.org?format=json")
        .then((response) => response.json())
        .then((ipv6Data) => {
          let ipv6Address = ipv6Data.ip;
          if (!ipv6Address || ipv6Address === ipv4Address) {
            ipv6Address = "Not registered";
          }
          document.getElementById("ipv6-address").innerText = ipv6Address;

          // Fetch Location Data using ipinfo.io API
          fetch(`https://ipinfo.io/${ipv4Address}/json`)
            .then((response) => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
            })
            .then((locationData) => {
              const locationString = `${locationData.city}, ${locationData.region}, ${locationData.country}`;
              document.getElementById("location").innerText = locationString;

              // Fetch ISP Data
              const ispInfo = locationData.org;
              document.getElementById("isp").innerText = ispInfo;

              // Show Map with User's Location
              initMap(
                locationData.loc.split(",")[0],
                locationData.loc.split(",")[1]
              );
            })
            .catch((error) => {
              console.error("Error fetching location data:", error);
              if (error.message === "Failed to fetch") {
                console.error(
                  "This could be due to a network error, or the request being blocked by an extension or firewall."
                );
              }
            });
        })
        .catch((error) => {
          console.error("Error fetching IPv6 address:", error);
        });
    })
    .catch((error) => {
      console.error("Error fetching IPv4 address:", error);
    });

  console.log("Page loaded");
  showCookiesModalIfNeeded();
};

// Initialize Map
function initMap(latitude, longitude) {
  const map = L.map("map").setView([latitude, longitude], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
  L.marker([latitude, longitude])
    .addTo(map)
    .bindPopup("Your Location")
    .openPopup();
}

// Function to set a cookie
function setCookie(name, value, days) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie =
    name +
    "=" +
    encodeURIComponent(value) +
    ";expires=" +
    expires.toUTCString();
}

// Function to get a cookie value by name
function getCookie(name) {
  const keyValue = document.cookie.match("(^|;) ?" + name + "=([^;]*)(;|$)");
  return keyValue ? keyValue[2] : null;
}

// Function to accept cookies
function acceptCookies() {
  setCookie("cookiesAccepted", "true", 365);
  console.log("Cookie accepted:", getCookie("cookiesAccepted"));
  hideCookiesModal();
}

// Function to decline cookies
function declineCookies() {
  setCookie("cookiesAccepted", "false", 365);
  console.log("Cookie declined:", getCookie("cookiesAccepted"));
  hideCookiesModal();
}

// Function to hide cookies modal
function hideCookiesModal() {
  console.log("Hiding cookies modal");
  document.getElementById("cookies-modal").style.display = "none";
}

// Function to check if cookies have been accepted
function checkCookiesAccepted() {
  const accepted = getCookie("cookiesAccepted") === "true";
  console.log("Cookies accepted:", accepted);
  return accepted;
}

// Function to show cookies modal if not accepted
function showCookiesModalIfNeeded() {
  console.log("Checking cookies acceptance");
  if (!checkCookiesAccepted()) {
    console.log("Cookies not accepted, showing modal");
    document.getElementById("cookies-modal").style.display = "block";
  } else {
    console.log("Cookies accepted, not showing modal");
    document.getElementById("cookies-modal").style.display = "none";
  }
}
