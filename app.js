let search = document.querySelector(".search");
search.addEventListener("submit", searchLocation);

function searchLocation(event) {
  event.preventDefault();
  let location = document.querySelector("#search").value;
  let ApiKey = `f2ba4b7c95e0f3e8dedeafe2da9d569f`;
  let currentApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${ApiKey}&units=metric`;
  let futureApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${ApiKey}&units=metric`;
  axios.get(currentApiUrl).then(showCurrentTimeWeather);
  axios.get(futureApiUrl).then(showFutureWeather);
  document.querySelector(".search").reset();
}
function showCurrentTimeWeather(response) {
  document.querySelector(".location").innerHTML = response.data.name;
  document.querySelector(".currentDegree").innerHTML = Math.round(
    response.data.main.temp
  );
  document
    .querySelector("#weatherIcon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/w/${response.data.weather[0].icon}.png`
    );
  let localTimeStamp = getLocalTime(response.data.timezone, null);
  let dateAtLocation = formatDate(localTimeStamp);
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
function showFutureWeather(response) {
  console.log(response);

  for (let index = 0; index < 6; index++) {
    document.querySelector(`#TimeSpan${index}`).innerHTML = formatDate(
      getLocalTime(response.data.city.timezone, response.data.list[index].dt)
    );
    document.querySelector(`#TimeSpanTemp${index}`).innerHTML = `${Math.round(
      response.data.list[index].main.temp
    )}°`;
    document
      .querySelector(`#TimeSpanIcon${index}`)
      .setAttribute(
        "src",
        `http://openweathermap.org/img/w/${response.data.list[index].weather[0].icon}.png`
      );
  }
}
let liveLocation = document.querySelector(".pin");
liveLocation.addEventListener("click", getGPS);
function getGPS() {
  navigator.geolocation.getCurrentPosition(findLiveLocation);
}
function findLiveLocation(GPS) {
  console.log(GPS);
  let lat = GPS.coords.latitude;
  let lon = GPS.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=f2ba4b7c95e0f3e8dedeafe2da9d569f&units=metric`;
  let futureApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=f2ba4b7c95e0f3e8dedeafe2da9d569f&units=metric`;
  axios.get(futureApiUrl).then(showFutureWeather);
  axios.get(apiUrl).then(showCurrentTimeWeather);
}
