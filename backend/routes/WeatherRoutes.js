import express from "express";
import { handleRequest, getCachedCountries, addCountryToCache } from "../controllers/WeatherController.js";

const router = express.Router();

router.get('/weather/:country', handleRequest);
router.get('/cached-countries', getCachedCountries);
router.post("/add-country", addCountryToCache);

export default router;