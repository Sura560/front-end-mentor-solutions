const form = document.querySelector("form");
const inputEL = document.getElementById("locationInput");
const button = document.getElementById("fetchWeather");

const locationEL = document.querySelector(".location");
const dateEL = document.querySelector(".date");
const tempEL = document.querySelector(".temperature");
const iconEl = document.querySelector(".icon");
const feelsLikeEl = document.getElementById("feels-like");
const humidityEl = document.getElementById("humidity");
const windSpeedEl = document.getElementById("wind-speed");
const precipitationEl = document.getElementById("precipitation");
const dailyForecastEl = document.querySelector(".daily-forecast");
const hourlyForecastEl = document.querySelector(".hourly");
const dayListEl = document.querySelector(".day-list");


const weatherData = {};
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  let search = inputEL.value.trim();
  if (!search) return;
  // fetchWeather(search)
  const locationData = await getCountry(search);
  const weather = await fetchWeather(search);
  if (!locationData || !weather) return;

  const data = getWeatherData(weather, locationData);
  console.log(data);
  currentWeatherUi(data);
  dailyForecastUi(weatherData.days);
  hourlyForecastUi()
});
async function fetchWeather(location) {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=SVCPRLNYW7ZLX7XJL9NWFV82W`,
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching weather:", err);
  }
}
//get date
function getDate() {
  const date = new Date();
  const options = {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  return date.toLocaleDateString(undefined, options);
}
//Get country
async function getCountry(location) {
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=1&language=en&format=json`,
  );
  if (!response.ok) return;

  const data = await response.json();
  if (!data.results || data.results.length === 0) {
    alert("Location not found");
    return null;
  }
  const city = data.results[0].name;
  const country = data.results[0].country;
  const lat = data.results[0].latitude;
  const lon = data.results[0].longitude;
  return { city, country, lat, lon };
}
function getWeatherData(data, locationData) {
  weatherData.location = data.resolvedAddress;
  weatherData.temperature = data.currentConditions.temp;
  weatherData.humidity = data.currentConditions.humidity;
  weatherData.date = getDate();
  weatherData.feelsLike = data.currentConditions.feelslike;
  weatherData.windSpeed = data.currentConditions.windspeed;
  weatherData.precipitation = data.currentConditions.precip;
  weatherData.icon = vcToMeteoIcon(data.currentConditions.icon);
  weatherData.country = locationData;
  weatherData.days = data.days;
  weatherData.hours = data.days[0].hours;
  return weatherData;
}

//convert visual crossing icon to open meteo icon
function vcToMeteoIcon(vcIcon) {
  const map = {
    "clear-day": "sunny",
    "clear-night": "sunny",

    "partly-cloudy-day": "partly-cloudy-day",
    "partly-cloudy-night": "partly-cloudy-day",

    cloudy: "overcast",

    rain: "rain",
    snow: "snow",

    fog: "overcast",
    wind: "overcast",

    "thunder-rain": "storm",
  };

  return map[vcIcon] || "overcast";
}

//ui

function currentWeatherUi(data) {
  locationEL.textContent = `${data.country.city}, ${data.country.country}`;
  dateEL.textContent = data.date;
  tempEL.textContent = `${data.temperature}°`;
  iconEl.src = `assets/images/icon-${vcToMeteoIcon(data.icon)}.webp`;
  feelsLikeEl.textContent = `${data.feelsLike}°`;
  humidityEl.textContent = `${data.humidity}%`;
  windSpeedEl.textContent = `${data.windSpeed} km/h`;
  precipitationEl.textContent = `${data.precipitation} mm`;
}

function dailyForecastUi(data) {
  dailyForecastEl.innerHTML = '';
  for (let i = 0; i < 7; i++) {
    const dateStr = data[i].datetime;
    // Use T00:00:00 to avoid timezone shifts
    const date = new Date(dateStr + "T00:00:00");

    // 'narrow' = W, 'short' = Wed, 'long' = Wednesday
    const day = date.toLocaleDateString("en-US", { weekday: "short" });
    console.log(dateStr);
    const dayForcastEl = document.createElement("div");
    dayForcastEl.innerHTML = `<div class="daily-forecast-item"> 
                             <h3 class="day"> ${day} </h3>
                            <img src = "assets/images/icon-${vcToMeteoIcon(data[i].icon)}.webp" alt="weather icon">
                            <div class="forecast-info"><p class="forecast-tempmax"> ${data[i].tempmax}° </p>
                            <p class="forecast-tempmin"> ${data[i].tempmin}° </p>
                            </div>
                              </div>`;
    dailyForecastEl.append(dayForcastEl);
  }
}

function hourlyForecastUi() {
  hourlyForecastEl.innerHTML = '';
  const data = weatherData.days;
  data.slice(0, 7).map((day, index) => {
    const date = new Date(day.datetime + "T00:00:00");
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
    const button = document.createElement("button");
    button.textContent = dayName;
    dayListEl.append(button);
    button.addEventListener("click", () => {
      hourlyForecastEl.innerHTML = "";
      for(let i = 0; i < 24; i++) {
        const div = document.createElement('div');
        div.innerHTML = `<div class="hour"><img src="assets/images/icon-${vcToMeteoIcon(data[index].hours[i].icon)}.webp" alt ="hourly icon"> <p class="current-hour"> ${data[index].hours[i].datetime} </p></div> <p> ${data[index].hours[i].temp}</p>`;
        hourlyForecastEl.append(div);
      }
    })
    
  }); 
}


window.addEventListener("DOMContentLoaded", async () => {
  const locationData = await getCountry("addis ababa");
  const weather = await fetchWeather("addis ababa");

  if (!locationData || !weather) return;

  const data = getWeatherData(weather, locationData);

  currentWeatherUi(data);
  dailyForecastUi(weatherData.days);
  hourlyForecastUi();
});