async function measureUploadSpeed(file) {
  const fileSizeInBytes = file.size;
  const fileSizeInBits = fileSizeInBytes * 8;
  const startTime = Date.now();

  await new Promise((resolve) => setTimeout(resolve, 15000));

  const endTime = Date.now();
  const elapsedTimeInSeconds = (endTime - startTime) / 1000;
  const uploadSpeedInMbps = fileSizeInBits / elapsedTimeInSeconds / 1000000;

  return uploadSpeedInMbps;
}

document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.querySelector('input[type="file"]');
  if (fileInput) {
    fileInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      measureUploadSpeed(file)
        .then((uploadSpeed) => {
          console.log(`Upload speed: ${uploadSpeed.toFixed(2)} Mbps`);
        })
        .catch((err) => {
          console.error("Error measuring upload speed:", err);
        });
    });
  } else {
    console.error('No <input type="file"> element found');
  }
});

module.exports = measureUploadSpeed;
