// Function to get weather data using Open Meteo API
async function getWeatherData(latitude, longitude) {
    const params = new URLSearchParams({
        latitude: latitude,
        longitude: longitude,
        current: ["temperature_2m", "relative_humidity_2m", "wind_speed_10m", "precipitation", "rain", "showers", "snowfall", "wind_direction_10m", "weather_code"],
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
function displayWeatherInfo(weatherData, location) {
    if (!weatherData || !weatherData.current) {
        console.error('Invalid weather data:', weatherData);
        return;
    }

    const temperature = Math.round(weatherData.current.temperature_2m);
    const humidity = weatherData.current.relative_humidity_2m;
    const windSpeed = weatherData.current.wind_speed_10m;

    const glassContainer = document.querySelector('.glass-container');
    glassContainer.innerHTML = `
        <p>Location: ${location}</p>
        <p>Temperature: ${temperature}°C</p>
        <p>Humidity: ${humidity} g/kg</p>
        <p>Wind Speed: ${windSpeed} Mph</p>
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
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                const data = await response.json();
                const suburb = data.address.suburb || data.address.town || data.address.county;
                const city = data.address.city || data.address.county;

                const location = `${suburb}, ${city}`;

                const weatherData = await getWeatherData(latitude, longitude);
                if (weatherData) {
                    displayWeatherInfo(weatherData, location);
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