# Weather-App
A mini project that fetches all sorts of infos of a country weather.

to start the backend:

```sh
cd into/the/project
cd backend/
npm install # to install the npm packages dependencies
```

then create a `.env` file and put it INSIDE the `/backend` folder, it should look like this:

```
KEY = "GJZKQX8W2TAY6L3M5R9VNB4F" # this isn't my key so don't bother
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

Now for making it work for the frontend, while the backend is running do this:

```sh
cd into/the/project/root/
python3 -m http.server 5500 # This starts a simple HTTP server on port 5500
```

Go to http://localhost:5500 in your browser, and you should be able to see the index page, now simply write a country name in the input.

> for the app to work, you need to have your redis server running in the background