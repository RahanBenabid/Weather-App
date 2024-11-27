import express from "express";
import { handleRequest } from "../controllers/WeatherController.js";

const router = express.Router();

router.get('/weather/:country', handleRequest);

export default router;