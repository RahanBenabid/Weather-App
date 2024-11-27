import express from "express";

const app = express();
app.use(express.json());

import weatherRoutes from "./routes/WeatherRoutes.js";

const PORT = 3000;

app.use("/", weatherRoutes);

app.listen(PORT, () => {
	console.log(`app is running and is listening at port ${PORT}`);
});