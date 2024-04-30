function checkStats() {
    const stats = document.querySelector(".stats");
    const forecastWeather = document.querySelector(".weather");

    if (!stats || !forecastWeather) {
        return;
    }

    // Check if the device has touch controls and window width is less than 768px
    if ('ontouchstart' in window && window.innerWidth < 768) {
        if (stats.textContent.trim() === "") {
            // console.log("Stats empty");
        } else {
            forecastWeather.style.width = (stats.clientWidth - 68)+ "px";
            setTimeout(() => {
                forecastWeather.style.opacity = 1;
            }, 250);
        }
    }
}

// Check initially
checkStats();

// Set interval to continuously check
const interval = setInterval(checkStats, 1000); // Adjust the interval as needed
