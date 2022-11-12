let apiKey = '668da14f2dd183d5f357bb8c35faa1a0';

let now = new Date();
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

dayEl.innerHTML = days[now.getDay()];
timeEl.innerHTML = `${
  now.getHours() > 9 ? now.getHours() : '0' + now.getHours()
}:${now.getMinutes() > 9 ? now.getMinutes() : '0' + now.getMinutes()}`;

function displayWeatherData(response) {
  let temp = Math.round(response.data.main.temp);
  let description = response.data.weather[0].description;
  let city = response.data.name;
  let humidity = response.data.main.humidity;
  let wind = response.data.wind.speed;

  let cityEl = document.querySelector('#city');
  let temperatureEl = document.querySelector('#temperature');
  let descriptionEl = document.querySelector('#description');
  let humidityEl = document.querySelector('#humidity');
  let windEl = document.querySelector('#wind');

  cityEl.innerHTML = city;
  temperatureEl.innerHTML = temp;
  descriptionEl.innerHTML = description;
  humidityEl.innerHTML = humidity;
  windEl.innerHTML = wind;
  console.log(response.data);
}

function getWeatherData(city) {
  console.log(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
  );
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

  getWeatherData(city);
  searchCityEl.value = '';
}

document
  .querySelector('#search-form')
  .addEventListener('submit', searchHandler);
