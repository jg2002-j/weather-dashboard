var FormEl = $("#search-form");
var InputEl = $("#search-input");
var hCEl = $("#history");
var historyButton = $("#historyButton")

var currentForecastarea = $("#today");
var fivedayforecastarea = $("#forecast");

var lastSearch = {}; //an object of the latest city that the openweatehr api interprets from user input 
var pastSearches = [];
var recent5searches = []; //an object of the last 5 searches

// function: fetch data from openweather api and populate on page 
function runSearch(){
      var currentDate = dayjs();
      var date = currentDate.format("dddd DD MMM YYYY");
      fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${SearchQuery}&limit=1&appid=d9fb8f659f461f86c935ea25def8363c`)
            .then(function (response) {
                  return response.json();
            }).then(function (data){
                  var lat = data[0].lat;
                  var lon = data[0].lon;
                  refinedSearch = data[0].name;
                  lastSearch.latest = refinedSearch;
                  var cityName = refinedSearch + ", " + data[0].country;                 
                  fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=alerts,minutely,hourly&appid=d9fb8f659f461f86c935ea25def8363c`)
                        .then(function (response) {
                              return response.json();
                        }).then(function (data){
                              var weather = data.current.weather[0].main;
                              var weatherIcon = data.current.weather[0].icon;
                              var temperature = data.current.temp;
                              var humidity = data.current.humidity;
                              var windspeed = data.current.wind_speed;

                              currentForecastarea.append(`
                              <div class="card rounded-5 p-3 text-bg-dark border-secondary">
                                    <div class="card-body">
                                          <div class="d-flex justify-content-between align-content-center">
                                                <div class="d-flex flex-column justify-content-evenly">
                                                      <h2 class="card-title">${cityName}</h2>
                                                      <h4>Today: ${date}</h4>
                                                </div>
                                                <img src="https://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="${weather}">
                                          </div>
                                          <div class="container d-flex justify-content-start">
                                                <div class="card rounded-4 m-2 text-bg-dark border-secondary" style="width: 15rem;">
                                                      <div class="card-body">
                                                      <h5 class="card-title"><i class="me-2 bi bi-thermometer-half" style="color: #A26769;"></i> Temperature </h5>
                                                      <p class="card-text">${temperature}°C</p>
                                                      </div>
                                                </div>
                                                <div class="card rounded-4 m-2 text-bg-dark border-secondary" style="width: 15rem;">
                                                      <div class="card-body">
                                                      <h5 class="card-title"><i class="me-2 bi bi-wind" style="color: #EEEBD0;"></i> Wind</h5>
                                                      <p class="card-text">${windspeed} m/s</p>
                                                      </div>
                                                </div>
                                                <div class="card rounded-4 m-2 text-bg-dark border-secondary" style="width: 15rem;">
                                                      <div class="card-body">
                                                      <h5 class="card-title"><i class="me-2 bi bi-droplet-half" style="color: #99B2DD;"></i> Humidity</h5>
                                                      <p class="card-text">${humidity} %</p>
                                                      </div>
                                                </div>
                                          </div>
                                    </div>
                              </div>
                              `)
                              
                              fivedayforecastarea.append(`<div class="card text-bg-dark border border-secondary rounded-5 p-3"><div class="card-body"><h4 class="card-title mb-4" >5-Day Forecast</h4><div class="container d-flex flex-nowrap justify-content-start" id="forecastcards"></div></div></div>`);
                              
                              var day2 = {
                                    date: dayjs.unix(data.daily[1].dt).format("ddd DD MMM"),
                                    weather: data.daily[1].summary,
                                    weathericon: data.daily[1].weather[0].icon,
                                    tempmin: data.daily[1].temp.min,
                                    tempmax: data.daily[1].temp.max,
                                    windspeed: data.daily[1].wind_speed,
                                    humidity: data.daily[1].humidity,
                              }
                              var day3 = {
                                    date: dayjs.unix(data.daily[2].dt).format("ddd DD MMM"),
                                    weather: data.daily[2].summary,
                                    weathericon: data.daily[2].weather[0].icon,
                                    tempmin: data.daily[2].temp.min,
                                    tempmax: data.daily[2].temp.max,
                                    windspeed: data.daily[2].wind_speed,
                                    humidity: data.daily[2].humidity,
                              }
                              var day4 = {
                                    date: dayjs.unix(data.daily[3].dt).format("ddd DD MMM"),
                                    weather: data.daily[3].summary,
                                    weathericon: data.daily[3].weather[0].icon,
                                    tempmin: data.daily[3].temp.min,
                                    tempmax: data.daily[3].temp.max,
                                    windspeed: data.daily[3].wind_speed,
                                    humidity: data.daily[3].humidity,
                              }
                              var day5 = {
                                    date: dayjs.unix(data.daily[4].dt).format("ddd DD MMM"),
                                    weather: data.daily[4].summary,
                                    weathericon: data.daily[4].weather[0].icon,
                                    tempmin: data.daily[4].temp.min,
                                    tempmax: data.daily[4].temp.max,
                                    windspeed: data.daily[4].wind_speed,
                                    humidity: data.daily[4].humidity,
                              }
                              var day6 = {
                                    date: dayjs.unix(data.daily[5].dt).format("ddd DD MMM"),
                                    weather: data.daily[5].summary,
                                    weathericon: data.daily[5].weather[0].icon,
                                    tempmin: data.daily[5].temp.min,
                                    tempmax: data.daily[5].temp.max,
                                    windspeed: data.daily[5].wind_speed,
                                    humidity: data.daily[5].humidity,
                              }
                        
                              var forecastDays = [day2, day3, day4, day5, day6]
                              forecastDays.forEach(day => {    
                                 $("#forecastcards").append(`
                                    <div class="card rounded-4 px-1 mx-2 text-bg-dark border-secondary" style="width: 15rem;">
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
                  console.log(`line 140: lastSearch.latest is ${lastSearch.latest} and lastSearch is`, lastSearch)
            }).then(function(){
                  console.log(`line 142: lastSearch.latest is ${lastSearch.latest} and lastSearch is`, lastSearch)
                  console.log
                  return "SearchDone"
            });
};

// function: log user input in local history
function searchToHistory(){
      // get the last search
      console.log("line 154: lastSearch is ",lastSearch)
      console.log("line 155: lastSearch.latest is ",lastSearch.latest)
      var lastSearchstring = lastSearch.latest;
      // push it to an array
      pastSearches = JSON.parse(localStorage.getItem("SearchHistory"))
      if (!pastSearches) {pastSearches = [];}
      pastSearches.unshift(lastSearchstring)
      // push the array to local storage
      localStorage.setItem("SearchHistory", JSON.stringify(pastSearches))
}

// load history into five buttons below search bar
function loadHistory(){
      // get the array from local storage
      pastSearches = JSON.parse(localStorage.getItem("SearchHistory"))
      // get the last 5 results from the array and put it into an array
      if (!pastSearches) {
            pastSearches = [];
      } else {
            recent5searches = [pastSearches[0], pastSearches[1], pastSearches[2], pastSearches[3], pastSearches[4]];
      }
      // IF there are any, clear any existing buttons
      hCEl.empty()
      // FOR EACH item in the array, generate a new button
      recent5searches.forEach(searchItem => {
            if (!searchItem) {
                  return;
            } else {
                  hCEl.append(`<button class="btn btn-outline-light m-2" id="historyButton">${searchItem}</button>`)   
            }
      });
}

// clears buttons and local storage
function clearHistory() {
            hCEl.empty()
            pastSearches = [];
            localStorage.setItem("SearchHistory", JSON.stringify(pastSearches)) 
}

// function: create search query > if from search bar, use value of input field
function fromFormSearchQuery(event){
      event.preventDefault();
      
      SearchQuery = InputEl.val();
      InputEl.val("");
      currentForecastarea.empty();
      fivedayforecastarea.empty();

      let historyPromise = new Promise(function(myResolve, myReject) {
            let x = runSearch(); 
            console.log("x is", x)         
            if (x == "SearchDone") {
                  myResolve();
            } else {
                  myReject();
            }
      });
          
      historyPromise.then(
            function(value) {
                  console.log(value, "Function reached here, which means promise.then() worked")
                  searchToHistory();
                  loadHistory();
            },
            function(error){alert("Error. Please try again.")}
      );
}

// function: create search query > if from history, use value of clicked button
function fromHistorySearchQuery(){
      SearchQuery = $(this)[0].innerText; 
      runSearch();
      currentForecastarea.empty();
      fivedayforecastarea.empty();
}

// run functions on page load:
loadHistory();

// set up event listeners so functions run when needed:
FormEl.on("submit", fromFormSearchQuery);
hCEl.on("click", "#historyButton", fromHistorySearchQuery)