# Weather-App
A mini project that fetches all sorts of infos of a country weather.

to start the backend:

```sh
cd into/the/project
cd /backend
npm install # to install the npm packages dependencies
```

then create a `.env` file and put it INSIDE the `/backend` folder, it should look like this:

```
KEY = "GJZKQX8W2TAY6L3M5R9VNB4F"
```

the value of the key should be your API key that you got from [Visual Crossing Weather API](https://weather.visualcrossing.com).

then just execute:

```sh
npm run dev
```

once the app is running you can perform a request:

```sh
curl http://localhost:3000/weather/London
```