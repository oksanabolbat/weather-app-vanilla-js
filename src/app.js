let apiKey = '668da14f2dd183d5f357bb8c35faa1a0';

let now = new Date();
let units = 'metric';
let icons = {
  '01d': ['clear-sky-day', 'Clear sky'],
  '02d': ['few-clouds-day', 'Few clouds'],
  '03d': ['scattered-clouds-day', 'Scattered clouds'],
  '04d': ['broken-clouds-day', 'Broken clouds'],
  '09d': ['shower-rain-day', 'Shower rain'],
  '10d': ['rain-day', 'Rain'],
  '11d': ['thunderstorm-day', 'Thunderstorm'],
  '13d': ['snow-day', 'Snow'],
  '50d': ['mist-day', 'Mist'],
  '01n': ['clear-sky-night', 'Clear sky'],
  '02n': ['few-clouds-night', 'Few clouds'],
  '03n': ['scattered-clouds-night', 'Scattered clouds'],
  '04n': ['broken-clouds-night', 'Broken clouds'],
  '09n': ['shower-rain-night', 'Shower rain'],
  '10n': ['rain-night', 'Rain'],
  '11n': ['thunderstorm-night', 'Thunderstorm'],
  '13n': ['snow-night', 'Snow'],
  '50n': ['mist-night', 'Mist'],
};

function updateDayTime(dateDisplay) {
  let days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  let dayEl = document.querySelector('#day');
  let timeEl = document.querySelector('#time');
  dayEl.innerHTML = days[dateDisplay.getDay()];
  timeEl.innerHTML = `${
    dateDisplay.getHours() > 9
      ? dateDisplay.getHours()
      : '0' + dateDisplay.getHours()
  }:${
    dateDisplay.getMinutes() > 9
      ? dateDisplay.getMinutes()
      : '0' + dateDisplay.getMinutes()
  }`;
}

updateDayTime(now);
let tempCelcium;
let temperatureEl = document.querySelector('#temperature');

function displayWeatherData(response) {
  let temp = Math.round(response.data.main.temp);
  tempCelcium = temp;
  let description = response.data.weather[0].description;
  let city = response.data.name;
  let humidity = response.data.main.humidity;
  let wind = response.data.wind.speed;
  let iconName = response.data.weather[0].icon;
  let cityDate = response.data.dt;

  let cityEl = document.querySelector('#city');
  let descriptionEl = document.querySelector('#description');
  let humidityEl = document.querySelector('#humidity');
  let windEl = document.querySelector('#wind');
  let currentIconEl = document.querySelector('#current-icon');

  cityEl.innerHTML = city;
  temperatureEl.innerHTML = temp;
  descriptionEl.innerHTML = description;
  humidityEl.innerHTML = humidity;
  windEl.innerHTML = wind;
  currentIconEl.setAttribute(
    'src',
    `https://shecodes-assets.s3.amazonaws.com/api/weather/icons/${icons[iconName][0]}.png`
  );
  currentIconEl.setAttribute('alt', icons[iconName][1]);
  updateDayTime(new Date(cityDate * 1000));

  getWeatherForecastData(response.data.coord);
}

function getWeatherDataByCityName(city) {
  axios
    .get(`https://api.openweathermap.org/data/2.5/weather`, {
      params: {
        q: city,
        appid: apiKey,
        units,
      },
    })
    .then(displayWeatherData);
}

function searchHandler(event) {
  event.preventDefault();
  let searchCityEl = document.querySelector('#search-city');
  let city = searchCityEl.value.trim();

  getWeatherDataByCityName(city);
  searchCityEl.value = '';
}

document
  .querySelector('#search-form')
  .addEventListener('submit', searchHandler);

function getWeatherDataByCoords(lat, lon) {
  axios
    .get(`https://api.openweathermap.org/data/2.5/weather`, {
      params: {
        lat,
        lon,
        appid: apiKey,
        units,
      },
    })
    .then(displayWeatherData);
}

function getCurrentLocationWeather(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition((position) => {
    getWeatherDataByCoords(position.coords.latitude, position.coords.longitude);
  });
}

document
  .querySelector('#curr-location')
  .addEventListener('click', getCurrentLocationWeather);

function displayWeatherForecast(response) {
  let weatherForecastHtml = '<div class="row">';

  response.data.daily.forEach((el) => {
    weatherForecastHtml += `<div class="col">
      <div class='forecast-day'>
        ${convertDateToShortDay(el.time)}<br />
        
      </div>
      <div class='forecast-icon'>
        <img src=${`https://shecodes-assets.s3.amazonaws.com/api/weather/icons/${el.condition.icon}.png`} />
      </div>
      <div class='forecast-temp'>
        <span class='temp-max'>
          ${Math.round(el.temperature.maximum)} 
        </span>
        ${Math.round(el.temperature.minimum)}
      </div>
      <div class='forecast-wind'>
        ${el.wind.speed} m/s 
      </div>

      </div>`;
  });

  weatherForecastHtml += '</div>';

  document.querySelector('#weather-forecast').innerHTML = weatherForecastHtml;
}

function getWeatherForecastData(coord) {
  let apiKey = 'b35c686ba9565ba0ab254c2230937552';
  axios
    .get(`https://api.shecodes.io/weather/v1/forecast`, {
      params: {
        lat: coord.lat,
        lon: coord.lon,
        key: '5o0a7ff1b9010e3b3ffaeet4f9642424',
        units: 'metric',
        cnt: 5,
      },
    })
    .then(displayWeatherForecast);
}
function convertDateToShortDay(date) {
  let shortDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return shortDays[new Date(date * 1000).getDay()];
}
