import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const apiRequest = async (country) => {
	try {
		console.log("my key:", process.env.KEY)
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
	} catch (err) {
		if (err.response?.status === 401) console.error("Something wrong with the server", err.response.status)
		else console.error(`Error ${err.response.status || "unknown"}, Bad request`);
		
		throw err;
	}
}