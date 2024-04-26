// Function to get weather data using Open Meteo API
async function getWeatherData(latitude, longitude) {
    const params = {
        "latitude": 52.52,
        "longitude": 13.41,
        "current": ["temperature_2m", "relative_humidity_2m", "wind_speed_10m"],
        "wind_speed_unit": "mph",
        "timeformat": "unixtime"
    };

    const apiUrl = `https://api.open-meteo.com/v1/forecast`;

    try {
        const response = await fetch(apiUrl, params);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

// Function to display weather information
function displayWeatherInfo(weatherData) {
    if (!weatherData || !weatherData.city) {
        console.error('Invalid weather data:', weatherData);
        return;
    }

    const town = weatherData.city.name;
    const temperature = weatherData.hourly.temperature_2m_1h[0].value;
    const realFeel = weatherData.hourly.apparent_temperature_2m_1h[0].value;
    const humidity = weatherData.hourly.humidity_2m_1h[0].value;
    const windSpeed = weatherData.hourly.windspeed_10m_1h[0].value;

    const glassContainer = document.querySelector('.glass-container');
    glassContainer.innerHTML = `
        <p>Town: ${town}</p>
        <p>Temperature: ${temperature}</p>
        <p>Real Feel: ${realFeel}</p>
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