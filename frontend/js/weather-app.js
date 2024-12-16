// Map weather conditions to icon files
const weatherIconMap = {
    // Cloudy conditions
    'Cloudy': '../icons/cloudy.svg',
    'Partly Cloudy': '../icons/cloudy-day-3.svg',
    'Mostly Cloudy': '../icons/cloudy-day-3.svg',
    
    // Clear conditions
    'Clear': '../icons/day.svg',
    'Clear Day': '../icons/day.svg',
    'Clear Night': '../icons/night.svg',
    
    // Rainy conditions
    'Rain': '../icons/rainy-3.svg',
    'Light Rain': '../icons/rainy-3.svg',
    'Moderate Rain': '../icons/rainy-5.svg',
    'Heavy Rain': '../icons/rainy-7.svg',
    'Thunderstorms': '../icons/thunder.svg',
    
    // Snowy conditions
    'Snow': '../icons/snowy-3.svg',
    'Light Snow': '../icons/snowy-3.svg',
    'Heavy Snow': '../icons/snowy-6.svg',
    
    // Fallback
    'default': '../icons/weather.svg'
};

// Function to select the appropriate icon
function selectWeatherIcon(conditions, isDay = true) {
    if (weatherIconMap[conditions]) {
        return weatherIconMap[conditions];
    }
    
    const matchingIcon = Object.keys(weatherIconMap).find(key => 
        conditions.toLowerCase().includes(key.toLowerCase())
    );
    
    return matchingIcon ? weatherIconMap[matchingIcon] : weatherIconMap['default'];
}

// Fetch weather data based on city input
document.getElementById('fetch-weather').addEventListener('click', async function () {
    const city = document.getElementById('city-input').value.trim();
    
    if (!city) {
        alert('Please enter a city name');
        return;
    }
    
    await fetchWeatherData(city);
});

// Fetch weather data using current location
document.getElementById('get-location-weather').addEventListener('click', async function () {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
        return;
    }
    
    // Show loading state
    this.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Fetching...';
    this.disabled = true;
    
    try {
        // Get current position
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        
        const { latitude, longitude } = position.coords;
        
        // Fetch weather for coordinates
        await fetchWeatherData(`${latitude},${longitude}`);
    } catch (error) {
        console.error('Geolocation error:', error);
        alert('Error getting your location: ' + error.message);
    } finally {
        // Reset button
        this.innerHTML = '<i class="fas fa-map-marker"></i> My Location';
        this.disabled = false;
    }
});

// Fetch weather data from server
async function fetchWeatherData(location) {
    try {
        const response = await fetch(`http://localhost:3000/weather/${location}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        console.log('Fetched data:', data);
        
        if ((data.status === "Cache hit!" || data.status === "Cache miss!") && data.data && data.data.currentConditions) {
            updateWeatherInfo(data.data);
        } else {
            alert('Error fetching weather data: Invalid data format');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error fetching weather data: ' + error.message);
    }
}

// Update UI with fetched weather info
function updateWeatherInfo(weatherData) {
    const currentConditions = weatherData.currentConditions;
    
    // Determine if it's day or night based on current time and sunrise/sunset
    const currentTime = new Date();
    const sunriseTime = new Date();
    const sunsetTime = new Date();
    
    const [sunriseHours, sunriseMinutes] = currentConditions.sunrise.split(':').map(Number);
    const [sunsetHours, sunsetMinutes] = currentConditions.sunset.split(':').map(Number);
    
    sunriseTime.setHours(sunriseHours, sunriseMinutes, 0);
    sunsetTime.setHours(sunsetHours, sunsetMinutes, 0);
    
    const isDay = currentTime >= sunriseTime && currentTime <= sunsetTime;
    
    // Select and set weather icon
    const weatherIcon = selectWeatherIcon(currentConditions.conditions, isDay);
    const weatherIconElement = document.getElementById('weather-icon');
    
    // If weather icon element doesn't exist, create it
    if (!weatherIconElement) {
        const iconElement = document.createElement('img');
        iconElement.id = 'weather-icon';
        iconElement.alt = 'Weather Icon';
        iconElement.classList.add('weather-icon');
        
        // Insert the icon before the current temperature
        const currentTempElement = document.getElementById('current-temp');
        currentTempElement.parentNode.insertBefore(iconElement, currentTempElement);
    }
    
    // Update icon source
    document.getElementById('weather-icon').src = weatherIcon;
    
    // Update text information
    document.getElementById('city-name').innerText = weatherData.resolvedAddress || weatherData.address;
    document.getElementById('current-temp').innerText = `${Math.round(currentConditions.temp)}°`;
    document.getElementById('weather-description').innerText = currentConditions.conditions;
    
    // Update other details as needed
    document.getElementById('humidity-info').innerText = `Humidity: ${Math.round(currentConditions.humidity)}%`;
    document.getElementById('temperature').innerText = `${Math.round(currentConditions.temp)}°`;
    document.getElementById('humidity').innerText = `${Math.round(currentConditions.humidity)}%`;
    document.getElementById('feels-like').innerText = `${Math.round(currentConditions.feelslike)}°`;
    document.getElementById('wind-speed').innerText = `${Math.round(currentConditions.windspeed)} km/h`;
    document.getElementById('pressure-value').innerText = `${Math.round(currentConditions.pressure)} hPa`;
    document.getElementById('sunrise-time').innerText = formatTime(currentConditions.sunrise);
    document.getElementById('sunset-time').innerText = formatTime(currentConditions.sunset);
}

// Format time from HH:MM:SS to a more readable format
function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
}