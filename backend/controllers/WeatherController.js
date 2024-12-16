import redis from "redis";
import  { apiRequest } from "./RequestController.js";

async function redisConnect(country) {
  const client = await redis
  .createClient()
  .on("error", (err) => console.log("redis client error:", err))
  .connect();
  
  try {
    
    const cachedData = await client.get(country);
    
    if (cachedData) {
      console.log('Cache hit!');
      const parsedData = JSON.parse(cachedData);
      console.log(parsedData.latitude, parsedData.longitude);
      return { status: 'Cache hit!', data: parsedData };
    }
    
    console.log('Cache miss, fetching from the website');
    const data = await apiRequest(country);
    console.log(data.latitude, data.longitude);
    
    await client.set(country, JSON.stringify(data));
    
    let cachedCountries = await client.get("cachedCountries");
    cachedCountries = cachedCountries ? JSON.parse(cachedCountries) : [];
    if (!cachedCountries.includes(country)) {
      cachedCountries.push(country);
      await client.set("cachedCountries", JSON.stringify(cachedCountries));
    }
    
    return { status: 'Cache miss!', data };
  } finally {
    await client.disconnect();
  }
}

export const handleRequest = async (req, res) => {
  try {
    const country = req.params.country;
    const response = await redisConnect(country);
    console.log(response);
    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "server error" });
  }
}

export const getCachedCountries = async (req, res) => {
  const client = redis.createClient();
  client.on("error", (err) => console.log("redis client error:", err));
  await client.connect();
  
  try {
    const cachedCountries = await client.get("cachedCountries");
    if (cachedCountries) {
      return res.json(JSON.parse(cachedCountries));
    } else {
      return res.json([]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "server error" });
  } finally {
    await client.disconnect();
  }
}











export const addCountryToCache = async (req, res) => {
  const { country } = req.body;
  
  const client = redis.createClient();
  client.on("error", (err) => console.log("redis client error:", err));
  await client.connect();
  
  try {
    const cachedCountries = await client.get("cachedCountries");
    const countries = cachedCountries ? JSON.parse(cachedCountries) : [];
    
    // Add the new country if it's not already in the cache
    if (!countries.includes(country)) {
      countries.push(country);
      await client.set("cachedCountries", JSON.stringify(countries));
    }
    
    res.status(200).json({ message: "Country added to cache", countries });
  } catch (err) {
    console.error("Error adding country to cache:", err);
    res.status(500).json({ message: "Error adding country to cache" });
  }
};