const defaultCity = 'London';
const suggestionsList = document.getElementById('suggestionsList');

// Fetch weather data from the WeatherAPI
async function getWeatherData(city) {
    try {
        const response = await fetch(`keys/getWeatherData.php?city=${encodeURIComponent(city)}`);
        if (!response.ok) {
            throw new Error('Weather data not available');
        }
        const data = await response.json();
        return data.forecast.forecastday.map(day => day.hour);
    } catch (error) {
        throw new Error(error.message);
    }
}

async function updateTodayAndTomorrowWeather(city) {
    try {
        const hourlyWeather = await getWeatherData(city);

        // Update today's and tomorrow's weather
        for (let i = 0; i < 2; i++) {
            const weatherContainer = document.querySelector(`.day-${i + 1}-weather`);
            weatherContainer.innerHTML = ''; // Clear existing content

            const dayWeather = hourlyWeather[i];

            // Display day
            const day = document.createElement('h2');
            day.classList.add('day');
            day.textContent = i === 0 ? 'Today' : 'Tomorrow';
            weatherContainer.appendChild(day);

            // Display location (modified to use a class for easier identification)
            const townName = document.createElement('p');
            townName.classList.add('town-name'); // Add a class for easier identification
            townName.textContent = city; // Use the city parameter
            weatherContainer.appendChild(townName);

            // Display current weather information
            const weatherType = document.createElement('p');
            weatherType.classList.add('weather-type');
            weatherType.textContent = dayWeather[0].condition.text;
            weatherContainer.appendChild(weatherType);

            const temperature = document.createElement('p');
            temperature.classList.add('temperature');
            temperature.textContent = `${Math.floor(dayWeather[0].temp_c)}°C`;
            weatherContainer.appendChild(temperature);

            // Display hourly weather in a horizontal slider
            const hourlySlider = document.createElement('div');
            hourlySlider.classList.add('hourly-slider');

            dayWeather.forEach(hour => {
                const hourCard = document.createElement('div');
                hourCard.classList.add('hour-card');
                hourCard.innerHTML = `
                    <p class="time">${hour.time}</p>
                    <div class="weather-icon"><i class="fas ${getWeatherIconClass(hour.condition.code)}"></i></div>
                    <p class="temperature">${Math.floor(hour.temp_c)}°C</p>
                    <p class="description">${hour.condition.text}</p>
                `;
                hourlySlider.appendChild(hourCard);
            });

            weatherContainer.appendChild(hourlySlider);
        }
    } catch (error) {
        console.log('Error:', error.message);
    }
}


// Function to update a weather container with data
function updateWeatherContainer(containerSelector, weatherData, city) {
    const container = document.querySelector(containerSelector);
    const weatherIcon = container.querySelector('.weather-icon');
    const temperature = container.querySelector('.temperature');
    const description = container.querySelector('.description');

    weatherIcon.innerHTML = `<i class="fas ${getWeatherIconClass(weatherData.condition.code)}"></i>`;
    temperature.textContent = `${weatherData.avgtemp_c}°C`;
    description.textContent = weatherData.condition.text;

    // Add click event listener to show detailed weather information
    container.addEventListener('click', () => {
        const date = weatherData.date;
        showDetailedWeather(city, date);
    });
}

async function showDetailedWeather(city, date) {
    try {
        const hourlyWeather = await getWeatherData(city, date);

        const hourlyWeatherContainer = document.querySelector('.detailed-weather-container');
        hourlyWeatherContainer.innerHTML = '';

        // Add a close button to the slide-out panel
        const closeButton = document.createElement('button');
        closeButton.classList.add('close-button');
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', () => {
            hourlyWeatherContainer.classList.remove('slide-in');
        });
        hourlyWeatherContainer.appendChild(closeButton);

        // Display current weather information
        const currentWeather = document.createElement('div');
        currentWeather.classList.add('current-weather');
        const currentCondition = hourlyWeather[0].condition;
        currentWeather.innerHTML = `
            <div class="current-weather-icon"><i class="fas ${getWeatherIconClass(currentCondition.code)}"></i></div>
            <p class="town-name">${city}</p>
            <p class="weather-type">${currentCondition.text}</p>
        `;
        hourlyWeatherContainer.appendChild(currentWeather);

        // Display hourly weather in a horizontal slider
        const hourlySlider = document.createElement('div');
        hourlySlider.classList.add('hourly-slider');

        hourlyWeather.forEach(hour => {
            const hourCard = document.createElement('div');
            hourCard.classList.add('hour-card');
            hourCard.innerHTML = `
                <p class="time">${hour.time}</p>
                <div class="weather-icon"><i class="fas ${getWeatherIconClass(hour.condition.code)}"></i></div>
                <p class="temperature">${hour.temp_c}°C</p>
                <p class="description">${hour.condition.text}</p>
            `;
            hourlySlider.appendChild(hourCard);
        });

        hourlyWeatherContainer.appendChild(hourlySlider);

        hourlyWeatherContainer.classList.toggle('slide-in');
    } catch (error) {
        console.log('Error:', error.message);
    }
}


function getWeatherIconClass(conditionCode) {
    switch (conditionCode) {
        case 1000:
            return 'fa-sun';
        case 1003:
            return 'fa-cloud-sun';
        case 1006:
        case 1009:
            return 'fa-cloud';
        case 1030:
        case 1135:
        case 1147:
        case 1180:
        case 1183:
        case 1186:
        case 1189:
        case 1192:
        case 1195:
        case 1198:
        case 1201:
        case 1204:
        case 1207:
        case 1210:
        case 1213:
        case 1216:
        case 1219:
        case 1222:
        case 1225:
        case 1237:
            return 'fa-cloud-showers-heavy';
        case 1063:
        case 1150:
        case 1153:
        case 1168:
        case 1171:
            return 'fa-cloud-rain';
        case 1066:
        case 1114:
        case 1117:
        case 1214:
        case 1217:
            return 'fa-snowflake';
        case 1273:
        case 1276:
        case 1279:
        case 1282:
            return 'fa-bolt';
        default:
            return 'fa-question-circle';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const locationInput = document.getElementById('location');

    if (locationInput) {
        locationInput.addEventListener('input', function () {
            const newLocation = this.value.trim(); // Get the new location from the input field

            // Log the new location for debugging
            console.log('New Location:', newLocation);

            // Construct the API URL with the new location
            const apiUrl = `keys/getWeatherData.php?city=${encodeURIComponent(newLocation)}`;

            // Update the weather based on the new location
            updateTodayAndTomorrowWeather(newLocation);
        });
    } else {
        console.error('Element with ID "location" not found.');
    }

    // Initial call to set the default city when the page loads
    updateLocationAndWeather();
});

// Function to update the location and weather based on user input
function updateLocationAndWeather() {
    const locationInput = document.getElementById("location");

    if (locationInput) {
        const newLocation = locationInput.value.trim() || defaultCity; // Use default city if input is empty
        locationInput.value = newLocation; // Update the input field value

        // Update the weather based on the location
        updateTodayAndTomorrowWeather(newLocation);
    } else {
        console.error('Element with ID "location" not found.');
    }
}

// Example usage (assuming there's an input field with id "location" in your settings modal)
document.addEventListener('DOMContentLoaded', function () {
    const locationInput = document.getElementById('location');

    if (locationInput) {
        locationInput.addEventListener('input', function () {
            const newLocation = this.value.trim(); // Get the new location from the input field
            updateTodayAndTomorrowWeather(newLocation); // Update the weather based on the new location
        });
    } else {
        console.error('Element with ID "location" not found.');
    }

    // Initial call to set the default city when the page loads
    updateLocationAndWeather();
});