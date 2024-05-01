// Function to get weather data using Open Meteo API
async function getWeatherData(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: latitude,
    longitude: longitude,
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "wind_speed_10m",
      "is_day",
      "precipitation",
      "rain",
      "showers",
      "snowfall",
      "wind_direction_10m",
      "cloud_cover",
      "is_day",
      "weather_code",
    ],
    daily: "uv_index_max",
    hourly: ["visibility", "temperature_2m"],
    wind_speed_unit: "mph",
    timeformat: "unixtime",
    forecast_days: 1,
  });

  const apiUrl = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
}

// Function to display weather information
function displayWeatherInfo(weatherData, location) {
  if (!weatherData || !weatherData.current) {
    console.error("Invalid weather data:", weatherData);
    return;
  }

  const currentDate = new Date();
  const currentHour = currentDate.getHours();

  const temperature = Math.round(weatherData.current.temperature_2m);
  const humidity = weatherData.current.relative_humidity_2m;
  const windSpeed = weatherData.current.wind_speed_10m;
  const realFeel = Math.round(weatherData.current.apparent_temperature);
  const precipitation = weatherData.current.precipitation;
  const windDirection = weatherData.current.wind_direction_10m;
  const cloudCoverage = weatherData.current.cloud_cover;
  const visibility = weatherData.hourly.visibility[currentHour];
  const uvIndex = weatherData.daily.uv_index_max;

  const container = document.querySelector(".container");
  container.innerHTML = `
      <div class="weather">
        <h2>${location}</h2>
        <span class="divider">|</span>
        <p class="overallTemp">${temperature}°C</p>
        <div class="hourlyWeather">
          ${weatherData.hourly.temperature_2m
            .map(
              (temp, index) => `
          <div class="hourTemp-card">
              <p>${index}:00</p>
              <p>${temp}°C</p>
          </div>`
            )
            .join("")}
        </div>
      </div>
      <div class="stats">
        <div class="real">
          <p class="title">Real Feel</p>
          <p class="real text">${realFeel}°C</p>
        </div>
        <div class="precipitation">
          <p class="title">Precipitation</p>
          <p class="precipitation text">${precipitation} mm</p>
        </div>
        <div class="humidity">
          <p class="title">Humidity</p>
          <p class="humidity text">${(
            (humidity / (humidity + 1000)) *
            100
          ).toFixed(2)}%</p>
        </div>
        <div class="windspeed">
          <p class="title">Wind Speed</p>
          <p class="windspeed text">${windSpeed} Mph</p>
        </div>
        <div class="cloudcoverage">
          <p class="title">Cloud Coverage</p>
          <p class="cloudcoverage text">${cloudCoverage}%</p>
        </div>
        <div class="visibility">
          <p class="title">Visibility</p>
          <p class="visibility text">${visibility / 1000} km</p>
        </div>
        <div class="uvindex">
          <p class="title">UV Index</p>
          <p class="uvindex text">${uvIndex} km</p>
        </div>
        <div class=winddirection>
          <p class="title">Wind Direction</p>
          <div class="winddirection-container">
            <p class="winddirection text">${windDirection}°</p>
            <div class=compass-hand style="transform: rotate(${
              windDirection + "deg"
            })"></div>
          </div>
        </div>
      </div>
    `;

  const hourlyWeather = document.querySelector(".hourlyWeather");
  const hourCardWidth =
    hourlyWeather.querySelector(".hourTemp-card").offsetWidth + 32;

  hourlyWeather.addEventListener("wheel", (event) => {
    event.preventDefault();
    const scrollAmount = Math.sign(event.deltaY) * hourCardWidth;
    hourlyWeather.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  });

  const currentTime = new Date().getHours();

  const currentHourCard = document.querySelector(
    `.hourTemp-card:nth-child(${currentTime + 1})`
  );

  hourlyWeather.scrollTo({
    left:
      currentHourCard.offsetLeft -
      hourlyWeather.offsetWidth / 2 +
      currentHourCard.offsetWidth +
      16,
    behavior: "smooth",
  });
}

// Function to show location popup
function showLocationPopup() {
  const popupContainer = document.querySelector(".popup-container");
  const popup = document.createElement("div");
  popup.classList.add("location-popup");
  popup.innerHTML = `
    <div class="popup-content">
      <span class="close-popup">&times;</span>
      <h3>Location Required</h3>
      <p>We require your location to show you accurate weather information.</p>
      <button class="enable-location-btn">Enable Location</button>
    </div>
  `;

  // Close popup when clicking on the close button
  const closeBtn = popup.querySelector(".close-popup");
  closeBtn.addEventListener("click", () => {
    popupContainer.removeChild(popup);
  });

  // Add event listener to the "Enable Location" button
  const enableLocationBtn = popup.querySelector(".enable-location-btn");
  enableLocationBtn.addEventListener("click", () => {
    getGeolocation();
    popupContainer.removeChild(popup);
  });

  popupContainer.appendChild(popup);
}

// Function to get user's geolocation
function getGeolocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // Reverse geocoding
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const data = await response.json();
        const suburb =
          data.address.suburb || data.address.town || data.address.county;

        const location = `${suburb}`;

        const weatherData = await getWeatherData(latitude, longitude);
        if (weatherData) {
          displayWeatherInfo(weatherData, location);
        }
      },
      (error) => {
        console.error("Error getting geolocation:", error);
        if (error.code === error.PERMISSION_DENIED) {
          // Show location popup
          showLocationPopup();
          const defaultLatitude = 51.5074;
          const defaultLongitude = -0.1278;
          const defaultLocation = "London";
          getWeatherData(defaultLatitude, defaultLongitude)
            .then((weatherData) => {
              displayWeatherInfo(weatherData, defaultLocation);
            })
            .catch((error) => {
              console.error(
                "Error fetching weather data for default location:",
                error
              );
            });
        }
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
}

getGeolocation();
