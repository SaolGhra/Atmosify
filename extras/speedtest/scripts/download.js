function measureDownloadSpeed(url, duration) {
  return new Promise((resolve, reject) => {
    let downloadedBytes = 0;
    const startTime = performance.now();
    const controller = new AbortController();
    const signal = controller.signal;

    const timer = setTimeout(() => {
      controller.abort();
    }, duration * 1000);

    fetch(url, { signal })
      .then((response) => {
        const reader = response.body.getReader();

        reader.read().then(function processChunk({ done, value }) {
          if (done || controller.signal.aborted) {
            clearTimeout(timer);
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
        if (err.name === "AbortError") {
          console.log("Download speed test aborted");
        } else {
          reject(err);
        }
      });
  });
}

const url =
  "https://raw.githubusercontent.com/SaolGhra/Atmosify/main/assets/speedtest/articles.csv";
measureDownloadSpeed(url, 15)
  .then((downloadSpeed) => {
    console.log(`Download speed: ${downloadSpeed.toFixed(2)} Mbps`);
  })
  .catch((err) => {
    console.error("Error measuring download speed:", err);
  });

module.exports = measureDownloadSpeed;
