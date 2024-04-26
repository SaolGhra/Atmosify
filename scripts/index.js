// Function to get weather data using Open Meteo API
async function getWeatherData(latitude, longitude) {
    const params = new URLSearchParams({
        latitude: latitude,
        longitude: longitude,
        current: ["temperature_2m", "relative_humidity_2m", "wind_speed_10m"],
        wind_speed_unit: "mph",
        timeformat: "unixtime"
    });

    const apiUrl = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

// Function to display weather information
function displayWeatherInfo(weatherData) {
    if (!weatherData || !weatherData.current) {
        console.error('Invalid weather data:', weatherData);
        return;
    }

    const latitude = weatherData.latitude;
    const longitude = weatherData.longitude;
    const temperature = weatherData.current.temperature_2m;
    const humidity = weatherData.current.relative_humidity_2m;
    const windSpeed = weatherData.current.wind_speed_10m;

    const glassContainer = document.querySelector('.glass-container');
    glassContainer.innerHTML = `
        <p>Latitude: ${latitude}</p>
        <p>Longitude: ${longitude}</p>
        <p>Temperature: ${temperature}</p>
        <p>Humidity: ${humidity}</p>
        <p>Wind Speed: ${windSpeed}</p>
    `;
}

// Function to get user's geolocation
function getGeolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const weatherData = await getWeatherData(latitude, longitude);
                if (weatherData) {
                    displayWeatherInfo(weatherData);
                }
            },
            (error) => {
                console.error('Error getting geolocation:', error);
            }
        );
    } else {
        console.error('Geolocation is not supported by this browser.');
    }
}

// Call the function to get geolocation and weather data
getGeolocation();