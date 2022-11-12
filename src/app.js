let apiKey = '668da14f2dd183d5f357bb8c35faa1a0';

let now = new Date();

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
}

function getWeatherDataByCityName(city) {
  axios
    .get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    )
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

function changeMeasurements(event) {
  event.preventDefault();
  if (tempCelcium) {
    if (event.target.id === 'celcium') {
      temperatureEl.innerHTML = tempCelcium;
    } else {
      temperatureEl.innerHTML = Math.round(tempCelcium * (9 / 5) + 32);
    }
    document
      .querySelectorAll('.measurements a')
      .forEach((el) => el.classList.toggle('active-meas'));
  }
}

document
  .querySelectorAll('.measurements a')
  .forEach((el) => el.addEventListener('click', changeMeasurements));

function getWeatherDataByCoords(lat, lon) {
  axios
    .get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    )
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
