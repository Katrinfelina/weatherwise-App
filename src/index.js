function refreshWeather(response) {
  let temperature = Math.round(response.data.temperature.current);
  let humidity = response.data.temperature.humidity;
  let wind = response.data.wind.speed;
  let description = response.data.condition.description;
  let city = response.data.city;

  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#current-condition");
  let temperatureElement = document.querySelector("#current-temperature");
  let humidityElement = document.querySelector("#current-humidity");
  let windElement = document.querySelector("#current-wind-speed");

  cityElement.innerHTML = city;
  descriptionElement.innerHTML = description;
  temperatureElement.innerHTML = temperature;
  humidityElement.innerHTML = humidity;
  windElement.innerHTML = wind;
}

function searchCity(city) {
  let apiKey = "8d334a66tf350346425d1bf477off27e";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(refreshWeather);
}

function handleSearchSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-input");
  // let cityElement = document.querySelector("#city");
  let formattedCity =
    searchInput.value.charAt(0).toUpperCase() +
    searchInput.value.slice(1).toLowerCase();
  // cityElement.innerHTML = formattedCity;
  searchCity(formattedCity);
}

function setDefaultCity() {
  const defaultCity = "Berlin";
  searchCity(defaultCity);
}
document.addEventListener("DOMContentLoaded", setDefaultCity);

let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearchSubmit);

function formatDate(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let currentDay = days[date.getDay()];
  let currentHours = date.getHours();
  let currentMinutes = date.getMinutes();

  if (currentMinutes < 10) {
    currentMinutes = `0${currentMinutes}`;
  }
  if (currentHours < 10) {
    currentHours = `0${currentHours}`;
  }

  return `${currentDay}, ${currentHours}:${currentMinutes}`;
}

let date = document.querySelector("#date");
date.innerHTML = formatDate(new Date());

function showSpinner() {
  document.getElementById("loading-spinner").style.display = "block";
}

function hideSpinner() {
  document.getElementById("loading-spinner").style.display = "none";
}

function searchCity(city) {
  showSpinner(); // Spinner anzeigen, bevor der API-Aufruf beginnt
  let apiKey = "8d334a66tf350346425d1bf477off27e";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios
    .get(apiUrl)
    .then((response) => {
      refreshWeather(response);
      hideSpinner(); // Spinner verbergen, nachdem die Daten erfolgreich geladen wurden
    })
    .catch((error) => {
      console.error("Error fetching weather:", error);
      hideSpinner(); // Spinner auch verbergen, wenn ein Fehler auftritt
    });
}
