// index.js
const startButton = document.getElementById("start-button");
const resultsElement = document.getElementById("result");

function startTest() {
  uploadTest()
    .then((uploadSpeedMbps) => {
      displayResults(uploadSpeedMbps);
    })
    .catch((error) => {
      console.error("Error during upload:", error);
      displayResults("Error during upload");
    });
}

function displayResults(uploadSpeedMbps) {
  resultsElement.textContent = `Upload speed: ${uploadSpeedMbps.toFixed(
    2
  )} Mbps`;
}

function uploadTest() {
  return new Promise((resolve, reject) => {
    const fileSizeMB = 0.99;
    const fileSizeBytes = fileSizeMB * 1024 * 1024;
    const startTime = Date.now();

    // Create a sample file to upload
    const sampleFile = new Blob(["0".repeat(fileSizeBytes)], {
      type: "application/octet-stream",
    });

    // Create a FormData object to append the file
    const formData = new FormData();
    formData.append("file", sampleFile);

    // Send a POST request to upload the file
    fetch("https://atmosify.free.beeceptor.com", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Upload failed");
        }
        // Calculate the time taken for the upload
        const uploadTimeSeconds = (Date.now() - startTime) / 1000;
        const uploadSpeedMbps =
          ((fileSizeBytes / uploadTimeSeconds) * 8) / (1024 * 1024);

        resolve(uploadSpeedMbps);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function downloadTest() {}

function pingTest() {}

function getLocation() {}

function getISP() {}

function getIP() {}

startButton.addEventListener("click", startTest);

// https://raw.githubusercontent.com/SaolGhra/Atmosify/main/assets/speedtest/article.csv
// https://raw.githubusercontent.com/SaolGhra/Atmosify/main/assets/speedtest/ping.json
