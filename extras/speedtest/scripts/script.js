const startButton = document.getElementById("start-button");
const resultsElement = document.getElementById("result");

startButton.addEventListener("click", async () => {
  try {
    const downloadSpeed = await getDownloadSpeed();
    let uploadSpeed;
    try {
      uploadSpeed = await getUploadSpeed();
    } catch (error) {
      console.error("Error getting upload speed:", error);
    }
    const ping = await getPing();

    const localIPAddresses = await getLocalIPAddress();
    const ipv4Addresses =
      localIPAddresses.ipv4.length > 0
        ? localIPAddresses.ipv4.join(", ")
        : "None";
    const ipv6Addresses =
      localIPAddresses.ipv6.length > 0
        ? localIPAddresses.ipv6.join(", ")
        : "None";
    const localIPAddress = `IPv4: ${ipv4Addresses}, IPv6: ${ipv6Addresses}`;

    const location = await getLocationFromCoordinates();

    resultsElement.innerHTML = `
      <p>Upload Speed: ${
        uploadSpeed ? uploadSpeed.toFixed(2) : "Not available"
      } Mbps</p>
      <p>Download Speed: ${downloadSpeed.toFixed(2)} Mbps</p>
      <p>Ping: ${ping.toFixed(2)} ms</p>
      <p>Local IP Address: ${localIPAddress}</p>
      <p>Location: ${location}</p>
    `;
  } catch (error) {
    console.error("Error running speed test:", error);
    resultsElement.innerHTML = "Speed test failed. Please try again.";
  }
});

async function getDownloadSpeed() {
  return new Promise((resolve, reject) => {
    const startTime = performance.now();
    const fileSize = 10 * 1024 * 1024; // 10 MB
    const url =
      "https://raw.githubusercontent.com/SaolGhra/Atmosify/main/assets/speedtest/articles.csv";

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.blob();
      })
      .then((blob) => {
        const endTime = performance.now();
        const duration = (endTime - startTime) / 1000;
        const bitsLoaded = fileSize * 8;
        const speedBps = bitsLoaded / duration;
        const speedKbps = speedBps / 1024;
        const speedMbps = speedKbps / 1024;
        resolve(speedMbps);
      })
      .catch((error) => {
        console.error("Error:", error);
        reject(error);
      });
  });
}

async function getUploadSpeed() {
  return new Promise((resolve, reject) => {
    const startTime = performance.now();
    const fileSize = 10 * 1024 * 1024; // 10 MB
    const url =
      "https://raw.githubusercontent.com/SaolGhra/Atmosify/main/assets/speedtest/upload.txt";

    const formData = new FormData();
    formData.append("file", new Blob([new ArrayBuffer(fileSize)]));

    const request = new XMLHttpRequest();
    request.open("POST", url);
    request.onload = () => {
      if (request.status === 200) {
        const endTime = performance.now();
        const duration = (endTime - startTime) / 1000;
        const bitsLoaded = fileSize * 8;
        const speedBps = bitsLoaded / duration;
        const speedKbps = speedBps / 1024;
        const speedMbps = speedKbps / 1024;
        resolve(speedMbps);
      } else {
        reject(new Error("Failed to upload file"));
      }
    };
    request.onerror = () => {
      reject(new Error("Failed to upload file"));
    };
    request.send(formData);
  });
}
async function getPing() {
  const startTime = performance.now();
  const response = await fetch(
    "https://raw.githubusercontent.com/SaolGhra/Atmosify/main/assets/speedtest/ping.json"
  );
  const endTime = performance.now();
  const duration = endTime - startTime;
  const ping = duration.toFixed(2);
  return parseFloat(ping);
}

async function getLocalIPAddress() {
  return new Promise((resolve, reject) => {
    const ipPromise = new Promise((resolve) => {
      const ipRequest = new XMLHttpRequest();
      ipRequest.open("GET", "https://api.ipify.org?format=json");
      ipRequest.onload = () => {
        if (ipRequest.status === 200) {
          const ipData = JSON.parse(ipRequest.responseText);
          resolve(ipData.ip);
        } else {
          reject(new Error("Failed to get IP address"));
        }
      };
      ipRequest.onerror = () => {
        reject(new Error("Failed to get IP address"));
      };
      ipRequest.send();
    });

    const ipv4Promise = new Promise((resolve) => {
      const ipv4Request = new XMLHttpRequest();
      ipv4Request.open("GET", "https://api.ipify.org?format=json");
      ipv4Request.onload = () => {
        if (ipv4Request.status === 200) {
          const ipv4Data = JSON.parse(ipv4Request.responseText);
          resolve(ipv4Data.ip);
        } else {
          resolve(null);
        }
      };
      ipv4Request.onerror = () => {
        resolve(null);
      };
      ipv4Request.send();
    });

    const ipv6Promise = new Promise((resolve) => {
      const ipv6Request = new XMLHttpRequest();
      ipv6Request.open("GET", "https://api64.ipify.org?format=json");
      ipv6Request.onload = () => {
        if (ipv6Request.status === 200) {
          const ipv6Data = JSON.parse(ipv6Request.responseText);
          resolve(ipv6Data.ip);
        } else {
          resolve(null);
        }
      };
      ipv6Request.onerror = () => {
        resolve(null);
      };
      ipv6Request.send();
    });

    Promise.all([ipPromise, ipv4Promise, ipv6Promise])
      .then(([ip, ipv4, ipv6]) => {
        // Filter out duplicate IPs
        const ipAddresses = [];
        if (ip) ipAddresses.push(ip);
        if (ipv4 && ipv4 !== ip) ipAddresses.push(ipv4);
        if (ipv6) ipAddresses.push(ipv6);
        resolve({
          ipv4: ipAddresses.filter((addr) => addr.includes(".")),
          ipv6: ipAddresses.filter((addr) => !addr.includes(".")),
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// Function to get the users location
async function getLocation() {
  return new Promise((resolve, reject) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        }
      );
    } else {
      reject(new Error("Geolocation is not available"));
    }
  });
}

//function to make that long and lat into a location
async function getLocationFromCoordinates(latitude, longitude) {
  return new Promise((resolve, reject) => {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

    const request = new XMLHttpRequest();
    request.open("GET", url);
    request.onload = () => {
      if (request.status === 200) {
        const data = JSON.parse(request.responseText);
        resolve(data.locality);
      } else {
        reject(new Error("Failed to get location"));
      }
    };
    request.onerror = () => {
      reject(new Error("Failed to get location"));
    };
    request.send();
  });
}
