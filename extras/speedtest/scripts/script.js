// index.js
const startButton = document.getElementById("start-button");
const resultsElement = document.getElementById("result");

function startTest() {
  Promise.all([
    uploadTest().catch((error) => console.error("Error in uploadTest:", error)),
    downloadTest().catch((error) =>
      console.error("Error in downloadTest:", error)
    ),
    pingTest().catch((error) => console.error("Error in pingTest:", error)),
    getLocation().catch((error) =>
      console.error("Error in getLocation:", error)
    ),
    getISP().catch((error) => console.error("Error in getISP:", error)),
    getIP().catch((error) => console.error("Error in getIP:", error)),
  ])
    .then(
      ([
        uploadSpeedMbps,
        downloadResult,
        pingResult,
        locationResult,
        ispResult,
        ipResult,
      ]) => {
        displayResults(
          uploadSpeedMbps,
          downloadResult,
          pingResult,
          locationResult,
          ispResult,
          ipResult
        );
      }
    )
    .catch((error) => {
      console.error("Error during test:", error);
      displayResults("Error during test", null, null, null, null, null);
    });
}

function displayResults(
  uploadSpeedMbps,
  downloadResult,
  pingResult,
  locationResult,
  ispResult,
  ipResult
) {
  const uploadDisplay =
    uploadSpeedMbps !== undefined
      ? `${uploadSpeedMbps} Mbps`
      : "Error during upload";
  const downloadDisplay =
    downloadResult !== undefined
      ? `${downloadResult} Mbps`
      : "Error during download";
  const pingDisplay =
    pingResult !== undefined ? pingResult : "Error during ping test";
  const ipDisplay = ipResult !== undefined ? ipResult : "Error fetching IP";

  resultsElement.innerHTML = `
    Upload speed: ${uploadDisplay} <br>
    Download result: ${downloadDisplay} <br>
    Ping result: ${pingDisplay} <br>
    Location: ${
      locationResult ? locationResult : "Error fetching location"
    } <br>
    ISP: ${ispResult ? ispResult : "Error fetching ISP"} <br>
    IP: ${ipDisplay}
  `;
}

function uploadTest() {
  return new Promise((resolve, reject) => {
    const fileSizeMB = 0.99;
    const fileSizeBytes = fileSizeMB * 1024 * 1024;
    const startTime = Date.now();

    const sampleFile = new Blob(["0".repeat(fileSizeBytes)], {
      type: "application/octet-stream",
    });

    const formData = new FormData();
    formData.append("file", sampleFile);

    const xhr = new XMLHttpRequest();

    // event listeners for the XMLHttpRequest object
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        const uploadTimeSeconds = (Date.now() - startTime) / 1000;
        const uploadSpeedMbps =
          ((fileSizeBytes / uploadTimeSeconds) * 8) / (1024 * 1024);
        resolve(uploadSpeedMbps);
      } else {
        reject(new Error("Upload failed"));
      }
    };

    xhr.onerror = function () {
      reject(new Error("Upload failed"));
    };

    xhr.open("POST", "https://atmosify.free.beeceptor.com", true);
    xhr.send(formData);
  });
}

function downloadTest() {
  return new Promise((resolve, reject) => {
    const url =
      "https://raw.githubusercontent.com/SaolGhra/Atmosify/main/assets/speedtest/articles.csv";
    const xhr = new XMLHttpRequest();
    let startTime, endTime, duration;
    let totalBytesLoaded = 0;

    xhr.open("GET", url, true);
    xhr.responseType = "blob";

    xhr.onloadstart = function () {
      startTime = performance.now();

      setTimeout(() => {
        const duration = (performance.now() - startTime) / 1000;
        const speedMbps = Math.round(
          (totalBytesLoaded * 8) / (duration * 512 * 512)
        );
        resolve(`${speedMbps}`);
        xhr.abort();
      }, 1500);
    };

    xhr.onprogress = function (event) {
      totalBytesLoaded = event.loaded;
    };

    xhr.onload = function () {
      endTime = performance.now();
      duration = (endTime - startTime) / 1000;
      const fileSize = totalBytesLoaded;
      const speedMbps = Math.round((fileSize * 8) / (duration * 1024 * 1024));
      if (xhr.status === 200) {
        resolve(`${speedMbps}`);
      } else {
        reject(new Error("Download failed"));
      }
    };

    xhr.onerror = function () {
      reject(new Error("Download failed"));
    };

    xhr.send();
  });
}

function pingTest() {
  const url =
    "https://raw.githubusercontent.com/SaolGhra/Atmosify/main/assets/speedtest/ping.json";
  const startTime = performance.now();

  // Make a GET request to the specified URL
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Ping failed");
      }
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);
      return latency;
    })
    .catch((error) => {
      throw new Error("Ping failed");
    });
}

function getLocation() {
  const url = "https://ipapi.co/json/";

  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Location fetching failed");
      }
      return response.json();
    })
    .then((data) => {
      // Extract location information from data
      return `${data.city}, ${data.region}, ${data.country_name}`;
    })
    .catch((error) => {
      throw new Error("Location fetching failed");
    });
}

function getISP() {
  const url = "https://ipapi.co/json/";

  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("ISP fetching failed");
      }
      return response.json();
    })
    .then((data) => {
      // Extract ISP information from data
      return data.org;
    })
    .catch((error) => {
      throw new Error("ISP fetching failed");
    });
}

function getIP() {
  const url = "https://api.ipify.org?format=json";

  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("IP fetching failed");
      }
      return response.json();
    })
    .then((data) => {
      // Extract IP address from data
      return data.ip;
    })
    .catch((error) => {
      throw new Error("IP fetching failed");
    });
}

startButton.addEventListener("click", () => {
  console.log("Start button clicked");
  startTest();
});

// https://raw.githubusercontent.com/SaolGhra/Atmosify/main/assets/speedtest/article.csv
// https://raw.githubusercontent.com/SaolGhra/Atmosify/main/assets/speedtest/ping.json
