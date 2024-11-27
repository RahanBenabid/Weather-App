import redis from "redis";
import  { apiRequest } from "./RequestController.js";

async function redisConnect(country) {
  const client = await redis
    .createClient()
    .on("error", (err) => console.log("redis client error", err))
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