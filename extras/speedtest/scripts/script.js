import speedTest from "../../../node_modules/speed-test/cli.js";

const startButton = document.getElementById("start-button");
const resultsElement = document.getElementById("result");

startButton.addEventListener("click", async () => {
  try {
    const { downloadSpeed, uploadSpeed, ping } = await speedTest();

    // Retrieve local IP address using a separate function for clarity
    const localIPAddress = await getLocalIPAddress();

    // Optionally determine location using an external API (not included in this example)
    const location = "Location unavailable";

    resultsElement.innerHTML = `
      Upload Speed: ${uploadSpeed.toFixed(2)} Mbps
      Download Speed: ${downloadSpeed.toFixed(2)} Mbps
      Ping: ${ping.toFixed(2)} ms
      Local IP Address: ${localIPAddress}
      Location: ${location}
    `;
  } catch (error) {
    console.error("Error running speed test:", error);
    resultsElement.innerHTML = "Speed test failed. Please try again.";
  }
});

async function getLocalIPAddress() {
  const interfaces = require("os").networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const address of interfaces[name]) {
      if (address.family === "IPv4" && !address.internal) {
        return address.address;
      }
    }
  }
  return "Local IP address unavailable";
}
// https://raw.githubusercontent.com/SaolGhra/Atmosify/main/assets/speedtest/ping.json
// https://raw.githubusercontent.com/SaolGhra/Atmosify/main/assets/speedtest/articles.csv
