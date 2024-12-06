// Fetch weather data based on city input
document.getElementById('fetch-weather').addEventListener('click', async function () {
    const city = document.getElementById('city-input').value.trim();
    
    if (!city) {
        alert('Please enter a city name');
        return;
    }
    
    try {
        const response = await fetch(`http://localhost:3000/weather/${city}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            console.log('Fetched data:', data); // Log fetched data for debugging
            
            // Handle response correctly
            if ((data.status === "Cache hit!" || data.status === "Cache miss!") && data.data && data.data.currentConditions) {
                updateWeatherInfo(data.data);
            } else {
                // alert('Error fetching weather data: Invalid data format');
            }
            } catch (error) {
                console.error('Error:', error);
            }
        });
        
        
        // Update UI with fetched weather info
        function updateWeatherInfo(weatherData) {
            document.getElementById('city-name').innerText = weatherData.resolvedAddress || weatherData.address;
            
            const currentConditions = weatherData.currentConditions;
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