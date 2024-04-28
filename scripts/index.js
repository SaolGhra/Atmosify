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
    hourly: "visibility",
    wind_speed_unit: "mph",
    timeformat: "unixtime",
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
  const currentDay = currentDate.getDay();

  const temperature = Math.round(weatherData.current.temperature_2m);
  const humidity = weatherData.current.relative_humidity_2m;
  const windSpeed = weatherData.current.wind_speed_10m;
  const realFeel = Math.round(weatherData.current.apparent_temperature);
  const precipitation = weatherData.current.precipitation;
  const windDirection = weatherData.current.wind_direction_10m;
  const cloudCoverage = weatherData.current.cloud_cover;
  const visibility = weatherData.hourly.visibility[currentHour];
  const uvIndex = weatherData.daily.uv_index_max[currentDay];

  const container = document.querySelector(".container");
  container.innerHTML = `
      <div class="weather">
        <h2>${location}</h2>
        <span class="divider">|</span>
        <p>${temperature}°C</p>
      </div>
      <div class="stats">
        <p class="real">${realFeel}°C</p>
        <p class="precipitation">${precipitation} mm</p>
        <p class="humidity">${((humidity / (humidity + 1000)) * 100).toFixed(2)}%</p>
        <p class="windspeed">${windSpeed} Mph</p>
        <p class="cloudcoverage">${cloudCoverage}%</p>
        <p class="visibility">${visibility/1000} km</p>
        <p class="uvindex">${uvIndex} km</p>
        <div class=winddirection>
          <p class=winddirection-degrees>${windDirection}°</p>
          <div class=compass-hand style="transform: rotate(${windDirection + "deg"})"></div>
        </div>
      </div>
    `;
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
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
}

// Call the function to get geolocation and weather data
getGeolocation();
