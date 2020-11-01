let search = document.querySelector(".search");
search.addEventListener("submit", searchLocation);

function searchLocation(event) {
  event.preventDefault();
  let location = document.querySelector("#search").value;
  let ApiKey = `f2ba4b7c95e0f3e8dedeafe2da9d569f`;
  let currentApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${ApiKey}&units=metric`;
  let futureApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${ApiKey}&units=metric`;
  axios.get(currentApiUrl).then(showCurrentTimeWeather).catch(showError);
  axios.get(futureApiUrl).then(showFutureWeather);
}

function showError() {
  document.querySelector(
    ".error"
  ).innerHTML = `The city could not be found💔Check your spelling❗`;
  document.querySelector(".error").style = `display:block`;
}

let locationDateTimeStamp = null;
function showCurrentTimeWeather(response) {
  document.querySelector(".error").style = `display: none`;
  document.querySelector(".search").reset();

  document.querySelector(".location").innerHTML = response.data.name;
  celsiusDegree = response.data.main.temp;
  document.querySelector(".currentDegree").innerHTML = Math.round(
    celsiusDegree
  );

  let celsius = document.querySelector("#CTemp");
  celsius.style = "color: #d50000";
  document.querySelector("#min").innerHTML = `Min: ${Math.round(
    response.data.main.temp_min
  )}° `;
  document.querySelector("#max").innerHTML = `Max: ${Math.round(
    response.data.main.temp_max
  )}°`;
  document.querySelector("#description").innerHTML =
    response.data.weather[0].description;
  let apiIcon = response.data.weather[0].icon;
  document
    .querySelector("#weatherIcon")
    .setAttribute(
      "src",
      icons[apiIcon] !== undefined
        ? `media/icons/${icons[apiIcon]}.svg`
        : `http://openweathermap.org/img/w/${apiIcon}.png`
    );
  let localTimeStamp = getLocalTime(response.data.timezone, null);
  let dateAtLocation = formatDate(localTimeStamp);
  locationDateTimeStamp = localTimeStamp;
  document.querySelector("#currentDateTime").innerHTML = dateAtLocation;
}

function getLocalTime(timeZone, datetime) {
  let now = new Date();
  if (datetime !== null) {
    now = new Date(datetime * 1000);
  }
  let timeZoneOffsetInMs = now.getTimezoneOffset() * 60 * 1000;
  let timeZoneInMs = timeZone * 1000;
  return now.getTime() + timeZoneOffsetInMs + timeZoneInMs;
}

function formatDate(timeStamp) {
  let date = new Date(timeStamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

function formatDay(timestring) {
  let date = new Date(Date.parse(timestring));
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
}

function isSameDay(currentTimeStamp) {
  let localDay = new Date(locationDateTimeStamp).getDay();
  let currentDay = new Date(currentTimeStamp).getDay();
  return localDay === currentDay;
}

function showFutureWeather(response) {
  let comigDaysTemp = [
    response.data.list[4],
    response.data.list[12],
    response.data.list[20],
    response.data.list[28],
    response.data.list[36],
  ];

  let todayTimeStamp = new Date(Date.parse(comigDaysTemp[0].dt_txt));
  if (isSameDay(todayTimeStamp)) {
    comigDaysTemp.shift();
  }

  for (let index = 0; index < 4; index++) {
    document.querySelector(`#TimeSpan${index}`).innerHTML = formatDate(
      getLocalTime(response.data.city.timezone, response.data.list[index].dt)
    );
    document.querySelector(`#TimeSpanTemp${index}`).innerHTML = `${Math.round(
      response.data.list[index].main.temp
    )}°`;

    let apiIcon = response.data.list[index].weather[0].icon;
    document
      .querySelector(`#TimeSpanIcon${index}`)
      .setAttribute(
        "src",
        icons[apiIcon] !== undefined
          ? `media/icons/${icons[apiIcon]}.svg`
          : `http://openweathermap.org/img/w/${apiIcon}.png`
      );

    //future days
    document.querySelector(`#comingDaysTemp${index}`).innerHTML = comigDaysTemp[
      index
    ].main.temp.toFixed(0);

    let apiIcon2 = comigDaysTemp[index].weather[0].icon;
    document
      .querySelector(`#dayIcon${index}`)
      .setAttribute(
        "src",
        icons[apiIcon2] !== undefined
          ? `media/icons/${icons[apiIcon2]}.svg`
          : `http://openweathermap.org/img/w/${apiIcon2}.png`
      );

    document.querySelector(`#day${index}`).innerHTML = formatDay(
      comigDaysTemp[index].dt_txt
    );
  }
  document.querySelector(".fixed-bottom").style = `display: block`;
}
let liveLocation = document.querySelector(".pin");
liveLocation.addEventListener("click", getGPS);
function getGPS() {
  navigator.geolocation.getCurrentPosition(findLiveLocation);
}
function findLiveLocation(GPS) {
  let lat = GPS.coords.latitude;
  let lon = GPS.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=f2ba4b7c95e0f3e8dedeafe2da9d569f&units=metric`;
  let futureApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=f2ba4b7c95e0f3e8dedeafe2da9d569f&units=metric`;
  axios.get(futureApiUrl).then(showFutureWeather);
  axios.get(apiUrl).then(showCurrentTimeWeather);
}
function getDay(timeStamp) {
  let day = new Date(timeStamp).getDay();
  return day;
}
let celsiusDegree = null;

let convertTempToF = document.querySelector("#FTemp");
convertTempToF.addEventListener("click", convertTemp1);
function convertTemp1(event) {
  let fahrenheitTemp = ((celsiusDegree * 9) / 5 + 32).toFixed(0);
  document.querySelector("#currentDegree").innerHTML = fahrenheitTemp;
  for (let index = 0; index < 4; index++) {
    document.querySelector(`#TimeSpanTemp${index}`).innerHTML = fahrenheitTemp;
    document.querySelector(
      `#comingDaysTemp${index}`
    ).innerHTML = fahrenheitTemp;
  }
  document.querySelector("#min").innerHTML = `Min:${fahrenheitTemp}°`;
  document.querySelector("#max").innerHTML = ` Max:${fahrenheitTemp}°`;
  event.target.style = " color: #d50000";
  let celsius = document.querySelector("#CTemp");
  celsius.style = "";
}
let convertTempToC = document.querySelector("#CTemp");
convertTempToC.addEventListener("click", convertTemp2);
function convertTemp2(event) {
  document.querySelector("#currentDegree").innerHTML = Math.round(
    celsiusDegree
  );
  for (let index = 0; index < 4; index++) {
    document.querySelector(`#TimeSpanTemp${index}`).innerHTML = Math.round(
      celsiusDegree
    );
    document.querySelector(`#comingDaysTemp${index}`).innerHTML = Math.round(
      celsiusDegree
    );
  }
  document.querySelector("#min").innerHTML = `Min:${Math.round(
    celsiusDegree
  )}°`;
  document.querySelector("#max").innerHTML = ` Max:${Math.round(
    celsiusDegree
  )}°`;

  event.target.style = " color: #d50000";
  let fahrenheit = document.querySelector("#FTemp");
  fahrenheit.style = "";
}
let icons = {
  "01d": "day",
  "02d": "few-clouds",
  "03d": "scattered-clouds",
  "04d": "cloudy",
  "09d": "shower-rain",
  "10d": "rain",
  "11d": "thunder",
  "13d": "snow",
  "01n": "night",
  "02n": "cloudy",
  "03n": "cloudy",
  "04n": "cloudy",
  "09n": "shower-rain",
  "10n": "rainy",
  "11n": "thunder",
  "13n": "snow",
};
