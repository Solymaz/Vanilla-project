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

//search fot the users' live location when they click on pin
let getLiveLocation = document.querySelector(".pin");
getLiveLocation.addEventListener("click", getGPS);

//search for the city that the user type in the search box
let search = document.querySelector(".search");
search.addEventListener("submit", searchLocation);

//deafult temperature is shown on celsuis
sessionStorage.setItem("degree", "C");

//fetch IP address
axios
  .get("https://api.ipify.org/?format=json")
  .then(fetchCityByIP)
  .catch(getDefaultLocation);

//convert temperature C<->F when user clicks on C°/F°
let fTemperatureElement = document.querySelector("#FTemp");
fTemperatureElement.addEventListener("click", function (event) {
  convertTemp(event, true);
});
let cTemperatureElement = document.querySelector("#CTemp");
cTemperatureElement.addEventListener("click", function (event) {
  convertTemp(event, false);
});

// Fetch city from ip and call weather info based on the response
function fetchCityByIP(response) {
  axios
    .get(
      `http://api.ipstack.com/${response.data.ip}?access_key=9bc5de24983079b86f7f6a4cab684cea`
    )
    .then(getLocation)
    .catch(getDefaultLocation);
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
//show the time in hh:mm format
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
  return `${hours}:${minutes}`;
}
//show days in three first letters format e.g. "Fri"
function formatDay(timestring) {
  let timeStamp = Date.parse(timestring.replace(/-/g, "/"));
  let date = new Date(timeStamp);
  return days[date.getDay()];
}
//check if the current day is the same day as the first day of the coming days' forecast which idealy should be tomorrow
function isSameDay(currentTimeStamp) {
  let localDay = new Date(locationDateTimeStamp).getDay();
  let currentDay = new Date(currentTimeStamp).getDay();
  return localDay === currentDay;
}
//get the current and future weather data for the location of the user's choice
function searchLocation(event) {
  event.preventDefault();
  let locationValue = document.querySelector("#search").value;
  let ApiKey = `f2ba4b7c95e0f3e8dedeafe2da9d569f`;
  let currentApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${locationValue}&appid=${ApiKey}&units=metric`;
  let futureApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${locationValue}&appid=${ApiKey}&units=metric`;
  axios.get(currentApiUrl).then(showCurrentTimeWeather).catch(showError);
  axios.get(futureApiUrl).then(showFutureWeather);
}
//get the current and future weather data for the location of the city given
function getLocation(response) {
  let city = response.data.city;
  let ApiKey = `f2ba4b7c95e0f3e8dedeafe2da9d569f`;
  let currentApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${ApiKey}&units=metric`;
  let futureApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${ApiKey}&units=metric`;
  axios.get(currentApiUrl).then(showCurrentTimeWeather).catch(showError);
  axios.get(futureApiUrl).then(showFutureWeather);
}
//get the current and future weather data for the location of default city (Stockholm)
function getDefaultLocation() {
  let city = "Stockholm";
  let ApiKey = `f2ba4b7c95e0f3e8dedeafe2da9d569f`;
  let currentApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${ApiKey}&units=metric`;
  let futureApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${ApiKey}&units=metric`;
  axios.get(currentApiUrl).then(showCurrentTimeWeather).catch(showError);
  axios.get(futureApiUrl).then(showFutureWeather);
}

//show the error
function showError() {
  document.querySelector(".error").style = `display:block`;
}
//reset the search box, hide the error, remove the style from fahrenheit element and set degree to celsius
function reset() {
  document.querySelector("#search").blur();
  document.querySelector(".error").style = `display: none`;
  document.querySelector(".search").reset();
  let fahrenheit = document.querySelector("#FTemp");
  fahrenheit.style = "";
  sessionStorage.setItem("degree", "C");
}
/*show the location's name, current, min and max temperature, show the weather description, show the humidity and wind speed
highlight the celsius degree, show the weather icon, show the local time and date*/
function showCurrentTimeWeather(response) {
  console.log(response);
  reset();
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
  document.querySelector(".windSpeed").innerHTML = `Wind Speed: ${Math.round(
    response.data.wind.speed
  )} km/h`;
  document.querySelector(
    ".humidity"
  ).innerHTML = `Humidity: ${response.data.main.humidity} %`;
  let apiIcon = response.data.weather[0].icon;
  document
    .querySelector("#weatherIcon")
    .setAttribute(
      "src",
      icons[apiIcon]
        ? `media/icons/${icons[apiIcon]}.svg`
        : `http://openweathermap.org/img/w/${apiIcon}.png`
    );
  let localTimeStamp = getLocalTime(response.data.timezone, null);
  let dateAtLocation = formatDate(localTimeStamp);
  locationDateTimeStamp = localTimeStamp;
  document.querySelector("#currentDateTime").innerHTML = dateAtLocation;
}
//show coming hours weather forecast, time and weather icon- show the next 4 days weather forecast, day and weather icon
function showFutureWeather(response) {
  //future hours
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
        icons[apiIcon]
          ? `media/icons/${icons[apiIcon]}.svg`
          : `http://openweathermap.org/img/w/${apiIcon}.png`
      );

    //future days
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
    document.querySelector(
      `#comingDaysTemp${index}`
    ).innerHTML = `${comigDaysTemp[index].main.temp.toFixed(0)}°`;

    let apiIcon2 = comigDaysTemp[index].weather[0].icon;
    document
      .querySelector(`#dayIcon${index}`)
      .setAttribute(
        "src",
        icons[apiIcon2]
          ? `media/icons/${icons[apiIcon2]}.svg`
          : `http://openweathermap.org/img/w/${apiIcon2}.png`
      );

    document.querySelector(`#day${index}`).innerHTML = formatDay(
      comigDaysTemp[index].dt_txt
    );
  }
  document.querySelector(
    ".country"
  ).innerHTML = `/${response.data.city.country}`;
  document.querySelector(".fixed-bottom").style = `display: block`;
}
//get the user's live location data
function getGPS() {
  navigator.geolocation.getCurrentPosition(findLiveLocation);
}
//get the current and future weather data of the user's live location
function findLiveLocation(GPS) {
  let lat = GPS.coords.latitude;
  let lon = GPS.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=f2ba4b7c95e0f3e8dedeafe2da9d569f&units=metric`;
  let futureApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=f2ba4b7c95e0f3e8dedeafe2da9d569f&units=metric`;
  axios.get(futureApiUrl).then(showFutureWeather);
  axios.get(apiUrl).then(showCurrentTimeWeather);
}
/*convert all temperatures to Fahrenheit if it is not already on Fahrenheit/convert all temperature to celsius if it is not already on celsius,
show the active degree by changing the C° or F° color to red*/
function convertTemp(event, convertToFahrenheit) {
  if (
    sessionStorage.getItem("degree") === "C" &&
    convertToFahrenheit === false
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
