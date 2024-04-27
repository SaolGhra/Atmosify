function measureDownloadSpeed(url) {
  return new Promise((resolve, reject) => {
    const startTime = performance.now();
    let downloadedBytes = 0;

    fetch(url)
      .then((response) => {
        const reader = response.body.getReader();

        reader.read().then(function processChunk({ done, value }) {
          if (done) {
            const endTime = performance.now();
            const elapsedTime = (endTime - startTime) / 1000;
            const downloadSpeedMbps =
              (downloadedBytes * 8) / (elapsedTime * 1024 * 1024);
            resolve(downloadSpeedMbps);
            return;
          }

          downloadedBytes += value.length;
          return reader.read().then(processChunk);
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
}

window.measureDownloadSpeed = measureDownloadSpeed;

const url =
  "https://raw.githubusercontent.com/SaolGhra/Atmosify/main/assets/speedtest/articles.csv";
measureDownloadSpeed(url)
  .then((downloadSpeed) => {
    console.log(`Download speed: ${downloadSpeed.toFixed(2)} Mbps`);
  })
  .catch((err) => {
    console.error("Error measuring download speed:", err);
  });

module.exports = measureDownloadSpeed;
