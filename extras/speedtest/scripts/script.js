document.getElementById("start-button").addEventListener("click", function () {
  var startTime, endTime;
  var fileSizeMB = 10;
  var uploadSpeedMbps;
  var downloadSpeedMbps;
  var pingTime;

  // Download test
  var downloadXHR = new XMLHttpRequest();
  downloadXHR.open("GET", "https://example.com/large-file.bin", true);
  downloadXHR.responseType = "blob";

  downloadXHR.onloadstart = function () {
    startTime = performance.now();
  };

  downloadXHR.onload = function () {
    endTime = performance.now();
    var downloadTime = endTime - startTime;
    downloadSpeedMbps = (fileSizeMB * 8) / (downloadTime / 1000);
    pingServer();
  };

  downloadXHR.send();

  // Ping test
  function pingServer() {
    var pingXHR = new XMLHttpRequest();
    pingXHR.open("HEAD", "https://example.com/ping-test", true);

    pingXHR.onloadstart = function () {
      startTime = performance.now();
    };

    pingXHR.onload = function () {
      endTime = performance.now();
      pingTime = endTime - startTime;
      uploadTest();
    };

    pingXHR.send();
  }

  // Upload test
  function uploadTest() {
    var formData = new FormData();
    for (var i = 0; i < fileSizeMB * 1024 * 1024; i++) {
      formData.append("file", "0");
    }
    var uploadXHR = new XMLHttpRequest();
    uploadXHR.open("POST", "https://example.com/upload", true);

    uploadXHR.onloadstart = function () {
      startTime = performance.now();
    };

    uploadXHR.onload = function () {
      endTime = performance.now();
      var uploadTime = endTime - startTime;
      uploadSpeedMbps = (fileSizeMB * 8) / (uploadTime / 1000);
      displayResult(downloadSpeedMbps, uploadSpeedMbps, pingTime);
    };

    uploadXHR.send(formData);
  }

  function displayResult(downloadSpeedMbps, uploadSpeedMbps, pingTime) {
    downloadSpeedMbps = downloadSpeedMbps.toFixed(2);
    uploadSpeedMbps = uploadSpeedMbps.toFixed(2);
    pingTime = pingTime.toFixed(2);
    var result = "Download Speed: " + downloadSpeedMbps + " Mbps<br>";
    result += "Upload Speed: " + uploadSpeedMbps + " Mbps<br>";
    result += "Ping: " + pingTime + " ms";
    document.getElementById("result").innerHTML = result;
  }
});
