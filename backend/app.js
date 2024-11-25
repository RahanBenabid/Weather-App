const express = require("express");
const axios = require("axios");
const redis = require("redis");

const app = express();
app.use(express.json());
require("dotenv").config();

async function performRequest(country) {
  try {
    const response = await axios.get(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${country}`,
      {
        params: {
          unitGroup: "metric",
          key: process.env.KEY,
          contentType: "json",
        },
      },
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 401)
      console.error("something wrong with the server:", error.response.status);
    else
      console.error(
        `Error ${error.response?.status || "unknown"}, Bad request`,
      );
    throw error;
  }
}

async function redisConnect(country) {
  const client = await redis
    .createClient()
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();

  try {
    // check if we have cached data
    const cachedData = await client.get(country);
    if (cachedData) {
      console.log("Cache hit!");
      const parsedData = JSON.parse(cachedData);
      console.log(parsedData.latitude, parsedData.longitude);
      return parsedData;
    }

    // Cache miss, perform normal API request then store the value
    console.log("Cache miss, fetching from API...");
    const data = await performRequest(country);
    console.log(data.latitude, data.longitude);

    // Store the stringified data in Redis
    await client.set(country, JSON.stringify(data));

    return data;
  } finally {
    await client.disconnect();
  }
}

async function main() {
  const args = process.argv.slice(2);
  const country = args[0];

  if (!country) {
    console.error("Please provide a country name");
    process.exit(1);
  }

  try {
    const weatherData = await redisConnect(country);
    console.log("Weather data retrieved successfully");
  } catch (error) {
    console.error("Failed to get weather data:", error.message);
  }
}

main().catch(console.error);
