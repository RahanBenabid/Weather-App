document.addEventListener("DOMContentLoaded", () => {
  const searchBox = document.querySelector(".search-box input");
  const cityList = document.querySelector(".city-list");

  // Function to fetch weather data
  async function fetchWeather(city) {
    try {
      const response = await fetch(`http://localhost:3000/weather/${city}`);
      if (!response.ok) throw new Error("Failed to fetch weather data");

      const data = await response.json();
      if (!data || !data.data || !data.data.currentConditions) {
        throw new Error("Incomplete data received from server.");
      }
      return data;
    } catch (error) {
      console.error("Error fetching weather:", error);
      alert("Could not fetch weather data. Please try again.");
      return null;
    }
  }

  // Function to create a city card dynamically
  function createCityCard(cityName, conditions, temperature, highTemp, lowTemp) {
    const card = document.createElement("div");
    card.className = "city-card";

    card.innerHTML = `
      <div class="city-info">
        <div class="city-name">${cityName} <i class="fas fa-map-marker-alt"></i></div>
        <div class="weather-condition">${conditions} ${highTemp}° / ${lowTemp}°</div>
      </div>
      <div class="temperature">${temperature}°</div>
    `;

    // Add click event to redirect to index.html with the city name
    card.addEventListener("click", () => {
      window.location.href = `/frontend/components/index.html?country=${encodeURIComponent(cityName)}`;
    });

    cityList.appendChild(card);
  }

  // Function to clear city cards
  function clearCityList() {
    while (cityList.firstChild) {
      cityList.removeChild(cityList.firstChild);
    }
  }

  // Function to fetch all cached countries from Redis
  async function fetchCachedCountries() {
    try {
      const response = await fetch("http://localhost:3000/cached-countries");
      if (!response.ok) throw new Error("Failed to fetch cached countries");
      const countries = await response.json();
      return countries;
    } catch (error) {
      console.error("Error fetching cached countries:", error);
      return [];
    }
  }

  // Function to display all cached countries as city cards
  async function displayCachedCities() {
    const cachedCountries = await fetchCachedCountries();
    if (!cachedCountries.length) return;

    for (const country of cachedCountries) {
      const weatherData = await fetchWeather(country);
      if (!weatherData) continue;

      const { currentConditions } = weatherData.data;
      const { address } = weatherData.data;
      const { description } = weatherData.data;
      const temp = currentConditions.temp;
      const highTemp = weatherData.data.days[0].tempmax; // Assuming today's high
      const lowTemp = weatherData.data.days[0].tempmin;  // Assuming today's low

      // Create a city card for each cached country
      createCityCard(address, description, temp, highTemp, lowTemp);
    }
  }

  // Event listener for search box input
  searchBox.addEventListener("keypress", async (event) => {
    if (event.key === "Enter") {
      const city = searchBox.value.trim();
      if (!city) return;

      // Clear input
      searchBox.value = "";

      // Fetch weather data
      const weatherData = await fetchWeather(city.toLowerCase());
      if (!weatherData) return;

      // Extract necessary data
      const { currentConditions } = weatherData.data;
      const { resolvedAddress } = weatherData.data;
      const { description } = weatherData.data;
      const temp = currentConditions.temp;
      const highTemp = weatherData.data.days[0].tempmax; // Assuming today's high
      const lowTemp = weatherData.data.days[0].tempmin;  // Assuming today's low

      // Clear the list and update UI with the new city
      clearCityList();
      createCityCard(resolvedAddress, description, temp, highTemp, lowTemp);

      // Add the city to Redis and display it
      await fetch("http://localhost:3000/add-country", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ country: city }),
      });

      // Optionally, re-fetch cached countries after adding a new one
      displayCachedCities();
    }
  });

  // Initially display cached cities from Redis
  displayCachedCities();
});
