let celsiusDegree = null;
let locationDateTimeStamp = null;
let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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
let getLiveLocation = document.querySelector(".pin");
getLiveLocation.addEventListener("click", getGPS);
let convertTempToF = document.querySelector("#FTemp");
convertTempToF.addEventListener("click", function (event) {
  convertTemp(event, true);
});
let convertTempToC = document.querySelector("#CTemp");
convertTempToC.addEventListener("click", function (event) {
  convertTemp(event, false);
});
let search = document.querySelector(".search");
search.addEventListener("submit", searchLocation);
sessionStorage.setItem("degree", "C");

function searchLocation(event) {
  event.preventDefault();
  let locationValue = document.querySelector("#search").value;
  let ApiKey = `f2ba4b7c95e0f3e8dedeafe2da9d569f`;
  let currentApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${locationValue}&appid=${ApiKey}&units=metric`;
  let futureApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${locationValue}&appid=${ApiKey}&units=metric`;
  axios.get(currentApiUrl).then(showCurrentTimeWeather).catch(showError);
  axios.get(futureApiUrl).then(showFutureWeather);
}

function showError() {
  document.querySelector(".error").style = `display:block`;
}

function reset() {
  document.querySelector(".error").style = `display: none`;
  document.querySelector(".search").reset();

  let fahrenheit = document.querySelector("#FTemp");
  fahrenheit.style = "";
  sessionStorage.setItem("degree", "C");
}

function showCurrentTimeWeather(response) {
  reset();
  document.querySelector(".location").innerHTML = response.data.name;
  celsiusDegree = response.data.main.temp;
  document.querySelector(".currentDegree").innerHTML = Math.round(
    celsiusDegree
  );
  let celsius = document.querySelector("#CTemp");
  celsius.style = "color: #d50000";
  document.querySelector("#min").innerHTML = `${Math.round(
    response.data.main.temp_min
  )}° `;
  document.querySelector("#max").innerHTML = `${Math.round(
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
  document.querySelector(".minMax").style = "display: block";
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

  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

function formatDay(timestring) {
  let date = new Date(Date.parse(timestring));
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
    document.querySelector(
      `#comingDaysTemp${index}`
    ).innerHTML = `${comigDaysTemp[index].main.temp.toFixed(0)}°`;

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

function convertTemp(event, convertToFahrenheit) {
  if (
    sessionStorage.getItem("degree") === "C" &&
    convertToFahrenheit !== true
  ) {
    return;
  } else if (
    sessionStorage.getItem("degree") === "F" &&
    convertToFahrenheit === true
  ) {
    return;
  }

  let convertTempFn = null;
  if (convertToFahrenheit) {
    // C -> F
    convertTempFn = function (tmp) {
      return ((tmp * 9) / 5 + 32).toFixed(0);
    };
    sessionStorage.setItem("degree", "F");
  } else {
    // F -> C
    convertTempFn = function (tmp) {
      return (((tmp - 32) * 5) / 9).toFixed(0);
    };
    sessionStorage.setItem("degree", "C");
  }

  document.querySelector("#currentDegree").innerHTML = convertTempFn(
    document.querySelector("#currentDegree").innerHTML
  );

  for (let index = 0; index < 4; index++) {
    document.querySelector(
      `#TimeSpanTemp${index}`
    ).innerHTML = `${convertTempFn(
      document.querySelector(`#TimeSpanTemp${index}`).innerHTML.replace("°", "")
    )}°`;
    document.querySelector(
      `#comingDaysTemp${index}`
    ).innerHTML = `${convertTempFn(
      document
        .querySelector(`#comingDaysTemp${index}`)
        .innerHTML.replace("°", "")
    )}°`;
  }
  document.querySelector("#min").innerHTML = `${convertTempFn(
    document.querySelector("#min").innerHTML.replace("°", "")
  )}°`;
  document.querySelector("#max").innerHTML = `${convertTempFn(
    document.querySelector("#max").innerHTML.replace("°", "")
  )}°`;
  event.target.style = " color: #d50000";

  if (convertToFahrenheit) {
    let celsius = document.querySelector("#CTemp");
    celsius.style = "";
  } else {
    let fahrenheit = document.querySelector("#FTemp");
    fahrenheit.style = "";
  }
}
