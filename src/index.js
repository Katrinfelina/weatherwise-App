function updateBackground(iconName) {
  const bodyElement = document.body;
  if (iconName.includes("day")) {
    bodyElement.className = "light-background";
  } else if (iconName.includes("night")) {
    bodyElement.className = "dark-background";
  }
}

function refreshWeather(response) {
  console.log("API Response:", response);

  let temperature = Math.round(response.data.temperature.current);
  let humidity = `${response.data.temperature.humidity} %`;
  let wind = `${response.data.wind.speed} km/h`;
  let description = response.data.condition.description;
  let city = response.data.city;
  let date = new Date(response.data.time * 1000);
  let iconName = response.data.condition.icon;

  let icon = `<img src="media/${iconName}.png "alt="${description}" class="current-temperature-icon" />`;

  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#current-condition");
  let temperatureElement = document.querySelector("#current-temperature");
  let humidityElement = document.querySelector("#current-humidity");
  let windElement = document.querySelector("#current-wind-speed");
  let timeElement = document.querySelector("#date");
  let iconElement = document.querySelector("#icon");

  cityElement.innerHTML = city;
  descriptionElement.innerHTML = description;
  temperatureElement.innerHTML = temperature;
  humidityElement.innerHTML = humidity;
  windElement.innerHTML = wind;
  timeElement.innerHTML = formatDate(date);
  iconElement.innerHTML = icon;

  updateBackground(iconName);

  getForecast(response.data.city);
}

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

  return `${currentDay}, ${currentHours}:${currentMinutes},`;
}

function searchCity(city) {
  let apiKey = "8d334a66tf350346425d1bf477off27e";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(refreshWeather);
}

function handleSearchSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-input");
  let formattedCity =
    searchInput.value.charAt(0).toUpperCase() +
    searchInput.value.slice(1).toLowerCase();
  searchCity(formattedCity);
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[date.getDay()];
}

function getForecast(city) {
  let apiKey = "8d334a66tf350346425d1bf477off27e";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
  axios(apiUrl).then(displayForecast);
}

function displayForecast(response) {
  let forecastHtml = "";
  let minTemperatureToday = Math.round(
    response.data.daily[0].temperature.minimum
  );
  let maxTemperatureToday = Math.round(
    response.data.daily[0].temperature.maximum
  );

  response.data.daily.forEach(function (day, index) {
    if (index > 0 && index < 7) {
      forecastHtml =
        forecastHtml +
        `
        <div class="col-2">
          <div class="forecast-day">${formatDay(day.time)}</div>
          <div class="forecast-icon"> <img src="media/${
            day.condition.icon
          }.png" alt="Weather icon"></div>
          <div class="forecast-temperature">
            <div class="forecast-temperature-max">${Math.round(
              day.temperature.maximum
            )}°</div>
            <div class="forecast-temperature-min">${Math.round(
              day.temperature.minimum
            )}°</div>
          </div>
        </div>
    `;
    }
  });

  let forecastElement = document.querySelector("#weather-forecast");
  forecastElement.innerHTML = forecastHtml;

  let temperatureSpanElement = document.querySelector("#min-max-teperature");
  temperatureSpanElement.innerHTML = `${maxTemperatureToday}°C/${minTemperatureToday}°C`;
}

let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearchSubmit);

searchCity("Berlin");

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
