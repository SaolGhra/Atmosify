const http = require("http");

function measurePingSpeed() {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    let receivedBytes = 0;

    const request = http.get(
      "https://raw.githubusercontent.com/SaolGhra/Atmosify/main/assets/speedtest/ping.json",
      (response) => {
        response.on("data", (chunk) => {
          receivedBytes += chunk.length;
        });

        response.on("end", () => {
          const endTime = Date.now();
          const duration = (endTime - startTime) / 1000;
          const speedMbps = (receivedBytes / duration / 1024 / 1024).toFixed(2);
          resolve(speedMbps);
        });
      }
    );

    request.on("error", (error) => {
      reject(error);
    });

    setTimeout(() => {
      request.abort();
      reject(new Error("Timeout"));
    }, 5000);
  });
}

module.exports = measurePingSpeed;

// https://raw.githubusercontent.com/SaolGhra/Atmosify/main/assets/speedtest/ping.json
