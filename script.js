//selecting DOM elements

const cityName = document.querySelector(".city");
const temperature = document.querySelector(".temp");
const locationIcon = document.querySelector(".weather-icon");
const desc = document.querySelector(".description");
const windSpeed = document.querySelector(".wind");
const tempMin = document.querySelector(".temp-min");
const tempMax = document.querySelector(".temp-max");
const searchBar = document.querySelector(".search button");
const searchValue = document.querySelector(".search-bar");
const currentDate = document.querySelector("#currentDate");
const clock = document.querySelector("#clockDisplay");

let weather = {
  apiKey: "5c3cd94654380dc0608fe15327e2cc71",
  getWeather: function (city) {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}&units=metric`
    )
      .then((response) => response.json())
      .then((data) => this.displayWeather(data));
  },
  displayWeather: function (data) {
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, temp_min, temp_max } = data.main;
    const { speed } = data.wind;
    cityName.innerText = name;
    temperature.innerText = Math.round(temp) + "°C";
    tempMin.innerText = "Temperature Min: " + Math.round(temp_min) + "°C";
    tempMax.innerText = "Temperature Max: " + Math.round(temp_max) + "°C";
    windSpeed.innerText = "Wind Speed: " + speed + " km/h";
    locationIcon.innerHTML = `<img src="icons/${icon}.png">`;
  },
  search: function () {
    this.getWeather(searchValue.value);
  },
};

let geocode = {
  reverseGeocode: function (latitude, longitude) {
    var api_key = "81bd9954d3a54498b793acef93d34504";

    var api_url = "https://api.opencagedata.com/geocode/v1/json";

    var request_url =
      api_url +
      "?" +
      "key=" +
      api_key +
      "&q=" +
      encodeURIComponent(latitude + "," + longitude) +
      "&pretty=1" +
      "&no_annotations=1";

    var request = new XMLHttpRequest();
    request.open("GET", request_url, true);

    request.onload = function () {
      if (request.status === 200) {
        var data = JSON.parse(request.responseText);

        weather.getWeather(data.results[0].components.town);
      } else if (request.status <= 500) {
        console.log("unable to geocode! Response code: " + request.status);
        var data = JSON.parse(request.responseText);
        console.log("error msg: " + data.status.message);
      } else {
        console.log("server error");
      }
    };

    request.onerror = function () {
      console.log("unable to connect to server");
    };

    request.send(); // make the request
  },
  getLocation: function () {
    function success(data) {
      geocode.reverseGeocode(data.coords.latitude, data.coords.longitude);
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, console.error);
    } else {
      weather.getWeather("London");
    }
  },
};

searchBar.addEventListener("click", function () {
  weather.search();
});

searchValue.addEventListener("keyup", function (e) {
  if (e.key === "Enter") {
    weather.search();
  }
});

geocode.getLocation();

//date

let date = new Date().toUTCString().slice(5, 16);

currentDate.innerHTML = date;

//time
function checkTime(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

//time
function startTime() {
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();

  // add a zero in front of numbers<10
  m = checkTime(m);

  document.getElementById("clockDisplay").innerHTML = h + ":" + m;
  t = setTimeout(function () {
    startTime();
  }, 500);
}
startTime();
