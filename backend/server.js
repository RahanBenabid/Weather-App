import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());
app.use(
	cors({
		origin: 'http://localhost:5500',
	})
);

import weatherRoutes from "./routes/WeatherRoutes.js";

const PORT = 3000;

app.use("/", weatherRoutes);

app.listen(PORT, () => {
	console.log(`app is running and is listening at port ${PORT}`);
});