let search = document.querySelector(".search");
search.addEventListener("submit", searchLocation);

function searchLocation(event) {
  event.preventDefault();
  let location = document.querySelector("#search").value;
  let ApiKey = `f2ba4b7c95e0f3e8dedeafe2da9d569f`;
  let currentApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${ApiKey}&units=metric`;
  let futureApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${ApiKey}&units=metric`;
  axios.get(currentApiUrl).then(showCurrentWeather);
  axios.get(futureApiUrl).then(showFutureWeather);
}
function showCurrentWeather(response) {
  console.log(response);
  document.querySelector(".location").innerHTML = response.data.name;
  document.querySelector(".currentDegree").innerHTML = Math.round(
    response.data.main.temp
  );
}
