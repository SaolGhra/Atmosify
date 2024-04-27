const http = require("http");
const fs = require("fs");

function measureDownloadSpeed(url) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    let downloadedBytes = 0;

    const file = fs.createWriteStream("tempFile");

    http
      .get(url, (response) => {
        response.on("data", (data) => {
          downloadedBytes += data.length;
        });

        response.on("end", () => {
          const endTime = Date.now();
          const elapsedTime = (endTime - startTime) / 1000;
          const downloadSpeedMbps =
            (downloadedBytes * 8) / (elapsedTime * 1024 * 1024);

          fs.unlink("tempFile", (err) => {
            if (err) {
              reject(err);
            } else {
              resolve(downloadSpeedMbps);
            }
          });
        });

        response.pipe(file);
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

// Usage example
const url = "http://example.com/file-to-download";
measureDownloadSpeed(url)
  .then((downloadSpeed) => {
    console.log(`Download speed: ${downloadSpeed.toFixed(2)} Mbps`);
  })
  .catch((err) => {
    console.error("Error measuring download speed:", err);
  });

module.exports = measureDownloadSpeed;
