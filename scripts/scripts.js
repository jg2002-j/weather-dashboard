var FormEl = $("#search-form");
var InputEl = $("#search-input");
var hCEl = $("#history");
var historyButton = $("#historyButton")

var currentForecastarea = $("#today");
var fivedayforecastarea = $("#forecast");

var pastOWsearchqueries = []; //an array of the cities that the openweatehr api interprets from user input 
var pastSearches = [];

// function: fetch data from openweather api and populate on page 
function runSearch(){
      var currentDate = dayjs();
      var date = currentDate.format("dddd DD MMM YYYY");
      fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${SearchQuery}&limit=1&appid=d9fb8f659f461f86c935ea25def8363c`)
            .then(function (response) {
                  return response.json();
            }).then(function (data){
                  var lat = data[0].lat;
                  var lon = data[0].lon;
                  refinedSearch = data[0].name;

                  if (pastOWsearchqueries.includes(refinedSearch)) {
                        return;
                  } else if (!refinedSearch) {
                        return;
                  } else {
                        pastOWsearchqueries.unshift(refinedSearch);
                  }

                  var cityName = refinedSearch + ", " + data[0].country;                 

                  fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=alerts,minutely,hourly&appid=d9fb8f659f461f86c935ea25def8363c`)
                        .then(function (response) {
                              return response.json();
                        }).then(function (data){
                              console.log(data)                  
                              var weather = data.current.weather[0].main;
                              var weatherIcon = data.current.weather[0].icon;
                              var temperature = data.current.temp;
                              var humidity = data.current.humidity;
                              var windspeed = data.current.wind_speed;

                              currentForecastarea.append(`
                              <div class="card text-bg-dark">
                                    <div class="card-body">
                                          <div class="d-flex justify-content-between align-content-center">
                                                <div class="d-flex flex-column justify-content-evenly">
                                                      <h2 class="card-title">${cityName}</h2>
                                                      <h4>Today: ${date}</h4>
                                                </div>
                                                <img src="https://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="${weather}">
                                          </div>
                                          <div class="container d-flex justify-content-start">
                                                <div class="card m-2 text-bg-dark border-secondary" style="width: 15rem;">
                                                      <div class="card-body">
                                                      <h5 class="card-title"><i class="me-2 bi bi-thermometer-half" style="color: #A26769;"></i> Temperature </h5>
                                                      <p class="card-text">${temperature}°C</p>
                                                      </div>
                                                </div>
                                                <div class="card m-2 text-bg-dark border-secondary" style="width: 15rem;">
                                                      <div class="card-body">
                                                      <h5 class="card-title"><i class="me-2 bi bi-wind" style="color: #EEEBD0;"></i> Wind</h5>
                                                      <p class="card-text">${windspeed} m/s</p>
                                                      </div>
                                                </div>
                                                <div class="card m-2 text-bg-dark border-secondary" style="width: 15rem;">
                                                      <div class="card-body">
                                                      <h5 class="card-title"><i class="me-2 bi bi-droplet-half" style="color: #99B2DD;"></i> Humidity</h5>
                                                      <p class="card-text">${humidity} %</p>
                                                      </div>
                                                </div>
                                          </div>
                                    </div>
                              </div>
                              `)
                              
                              fivedayforecastarea.append(`<div class="card text-bg-dark"><div class="card-body"><h4 class="card-title" >5-Day Forecast</h4><div class="container d-flex flex-nowrap justify-content-start" id="forecastcards"></div></div></div>`);
                              
                              var day2 = {
                                    date: dayjs.unix(data.daily[1].dt).format("dddd DD MMM"),
                                    weather: data.daily[1].summary,
                                    weathericon: data.daily[1].weather[0].icon,
                                    tempmin: data.daily[1].temp.min,
                                    tempmax: data.daily[1].temp.max,
                                    windspeed: data.daily[1].wind_speed,
                                    humidity: data.daily[1].humidity,
                              }
                              var day3 = {
                                    date: dayjs.unix(data.daily[2].dt).format("dddd DD MMM"),
                                    weather: data.daily[2].summary,
                                    weathericon: data.daily[2].weather[0].icon,
                                    tempmin: data.daily[2].temp.min,
                                    tempmax: data.daily[2].temp.max,
                                    windspeed: data.daily[2].wind_speed,
                                    humidity: data.daily[2].humidity,
                              }
                              var day4 = {
                                    date: dayjs.unix(data.daily[3].dt).format("dddd DD MMM"),
                                    weather: data.daily[3].summary,
                                    weathericon: data.daily[3].weather[0].icon,
                                    tempmin: data.daily[3].temp.min,
                                    tempmax: data.daily[3].temp.max,
                                    windspeed: data.daily[3].wind_speed,
                                    humidity: data.daily[3].humidity,
                              }
                              var day5 = {
                                    date: dayjs.unix(data.daily[4].dt).format("dddd DD MMM"),
                                    weather: data.daily[4].summary,
                                    weathericon: data.daily[4].weather[0].icon,
                                    tempmin: data.daily[4].temp.min,
                                    tempmax: data.daily[4].temp.max,
                                    windspeed: data.daily[4].wind_speed,
                                    humidity: data.daily[4].humidity,
                              }
                              var day6 = {
                                    date: dayjs.unix(data.daily[5].dt).format("dddd DD MMM"),
                                    weather: data.daily[5].summary,
                                    weathericon: data.daily[5].weather[0].icon,
                                    tempmin: data.daily[5].temp.min,
                                    tempmax: data.daily[5].temp.max,
                                    windspeed: data.daily[5].wind_speed,
                                    humidity: data.daily[5].humidity,
                              }
                        
                              var forecastDays = [day2, day3, day4, day5, day6]
                              console.log(forecastDays)

                              forecastDays.forEach(day => {    
                                 $("#forecastcards").append(`
                                    <div class="card m-2 text-bg-dark border-secondary" style="width: 15rem;">
                                          <div class="card-body d-flex flex-column justify-content-between">
                                                <div class="d-flex flex-column justify-content-between align-content-center">
                                                      <img class="mb-3" src="https://openweathermap.org/img/wn/${day.weathericon}@2x.png" alt="Weather icon" style="width: 4rem; height: auto; margin: auto;">
                                                      <div class="d-flex flex-column justify-content-evenly">
                                                            <h5>${day.date}</h5>
                                                            <h6 class="card-subtitle mb-2 text-body-light">${day.weather}</h6>
                                                      </div>
                                                </div>
                                                <div>
                                                      <p class="card-text mb-1"><i class="me-2 bi bi-thermometer-half" style="color: #A26769;"></i>${day.tempmin} — ${day.tempmax}°C</p>
                                                      <p class="card-text mb-1"><i class="me-2 bi bi-wind" style="color: #EEEBD0;"></i> ${day.windspeed} m/s</p>
                                                      <p class="card-text mb-1"><i class="me-2 bi bi-droplet-half" style="color: #99B2DD;"></i>${day.humidity} %</p>
                                                </div>
                                          </div>
                                    </div>
                                    `)
                              });
                        });           
            });
};

// function: log user input in local history
function searchToHistory(){
      console.log(`array of the citynames openweather api gets from form input: ${pastOWsearchqueries}`);

      // if local storage is blank, continue
      if (!pastSearches){
      //else get the values stored there and set it into an array called pastSearches
      } else { 
            pastSearches = JSON.parse(localStorage.getItem("historySearches"));
      }
      
      console.log(`pastSearches: ${pastSearches}`)

      // then add the latest unique search query to that array and re-set that array as a local storage item
      pastSearches.unshift(pastOWsearchqueries[0])
      localStorage.setItem("historySearches", JSON.stringify(pastSearches)) 
}

// load history into five buttons below search bar
function loadHistory(){
            // create an array of the five most recent searches
            recentSearches = [pastSearches[0], pastSearches[1], pastSearches[2], pastSearches[3], pastSearches[4]]
            console.log(`recentSearches: ${recentSearches}`)
      
            // clear all the existing buttons
            hCEl.empty()
            // for each of the 5 most recent searches, create a new button
            recentSearches.forEach(search => {
                  if (!search){return;}
                  hCEl.append(`<button class="btn btn-outline-light m-2" id="historyButton">${search}</button>`)
            });
}

// clears buttons and local storage
function clearHistory() {
            hCEl.empty()
            pastSearches = [""];
            localStorage.setItem("historySearches", JSON.stringify(pastSearches)) 
}

// function: create search query > if from search bar, use value of input field
function fromFormSearchQuery(event){
      event.preventDefault();
      
      SearchQuery = InputEl.val();
      InputEl.val("");
      currentForecastarea.empty();
      fivedayforecastarea.empty();
      
      // function: run search
      runSearch();
      // function: log value of input field into history
      searchToHistory();
      // refreshes history buttons
      loadHistory();
}

// function: create search query > if from history, use value of clicked button
function fromHistorySearchQuery(){
      console.log($(this));
      SearchQuery = ""; 
      // function: run search
      runSearch();
}

// run functions on page load:
loadHistory();

// set up event listeners so functions run when needed:
FormEl.on("submit", fromFormSearchQuery);
historyButton.on("click", fromHistorySearchQuery);