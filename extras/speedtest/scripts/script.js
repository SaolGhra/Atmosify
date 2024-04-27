const startButton = document.getElementById("start-button");
const resultsElement = document.getElementById("result");

startButton.addEventListener("click", async () => {
  const upload = await import("./upload.js");
  const download = await import("./download.js");
  const ping = await import("./ping.js");
  const location = await import("./location.js");

  const uploadModule = upload.default;
  const downloadModule = download.default;
  const pingModule = ping.default;
  const locationModule = location.default;

  const uploadResult = uploadModule();
  const downloadResult = downloadModule();
  const pingResult = pingModule();
  const locationResult = locationModule();

  const uploadElement = document.createElement("p");
  uploadElement.textContent = uploadResult;
  resultsElement.appendChild(uploadElement);

  const downloadElement = document.createElement("p");
  downloadElement.textContent = downloadResult;
  resultsElement.appendChild(downloadElement);

  const pingElement = document.createElement("p");
  pingElement.textContent = pingResult;
  resultsElement.appendChild(pingElement);

  const locationElement = document.createElement("p");
  locationElement.textContent = locationResult;
  resultsElement.appendChild(locationElement);
});

// https://raw.githubusercontent.com/SaolGhra/Atmosify/main/assets/speedtest/ping.json
