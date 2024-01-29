var FormEl = $("#search-form");
var InputEl = $("#search-input");
var hCEl = $("#history")

var currentForecastarea = $("#today");
var fivedayforecastarea = $("#forecast");

function WeatherSearch(event){
      event.preventDefault();
      
      SearchQuery = InputEl.val();
      InputEl.val("");
      currentForecastarea.empty();
      fivedayforecastarea.empty();
      
      var currentDate = dayjs();
      var date = currentDate.format("dddd DD MMM YYYY");

      fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${SearchQuery}&limit=1&appid=29d3c41b285caf441bf342de37c4db4d`)
            .then(function (response) {
                  return response.json();
            }).then(function (data){
                  var lat = data[0].lat;
                  var lon = data[0].lon;
                  var refinedSearch = data[0].name;
                  var cityName = refinedSearch + ", " + data[0].country;
            
                  fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=alerts,minutely&appid=29d3c41b285caf441bf342de37c4db4d`)
                        .then(function (response) {
                              return response.json();
                        }).then(function (data){
                                                                  
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
                        });

                  var forecastDays = [currentDate.add(1, "day"), currentDate.add(2, "day"), currentDate.add(3, "day"), currentDate.add(4, "day"), currentDate.add(5, "day")];
                  
                  fivedayforecastarea.append(`<div class="card text-bg-dark"><div class="card-body"><h4 class="card-title" >5-Day Forecast</h4><div class="container d-flex flex-nowrap justify-content-start" id="forecastcards"></div></div></div>`);

                  forecastDays.forEach(date => {    
                        fetch(`https://api.openweathermap.org/data/3.0/onecall/day_summary?lat=${lat}&lon=${lon}&units=metric&exclude=alerts&date=${date.format("YYYY-MM-DD")}&appid=29d3c41b285caf441bf342de37c4db4d`)
                              .then(function (response) {
                                    return response.json();
                              }).then(function (data){
                                    // var forecastweatherIcon = data.current.weather[0].icon;
                                    var forecasttemperatureMax = data.temperature.max;
                                    var forecasttemperatureMin = data.temperature.min;
                                    var forecasthumidity = data.humidity.afternoon;
                                    var forecastwindspeed = data.wind.max.speed;
                                    $("#forecastcards").append(`
                                    <div class="card m-2 text-bg-dark border-secondary" style="width: 15rem;">
                                          <div class="card-body">
                                                <div class="d-flex flex-column justify-content-between align-content-center">
                                                      <img class="mb-3" src="https://openweathermap.org/img/wn/01d@2x.png" alt="Weather icon" style="width: 4rem; height: auto; margin: auto;">
                                                      <div class="d-flex flex-column justify-content-evenly">
                                                            <h5>${date.format("dddd DD MMM YYYY")}</h5>
                                                      </div>
                                                </div>
                                                <p class="card-text mb-1"><i class="me-2 bi bi-thermometer-half" style="color: #A26769;"></i>${forecasttemperatureMin} — ${forecasttemperatureMax}°C</p>
                                                <p class="card-text mb-1"><i class="me-2 bi bi-wind" style="color: #EEEBD0;"></i> ${forecastwindspeed} m/s</p>
                                                <p class="card-text mb-1"><i class="me-2 bi bi-droplet-half" style="color: #99B2DD;"></i>${forecasthumidity} %</p>
                                          </div>
                                    </div>
                                    `)

                              });
                        });
                        
                        if (pastSearches.includes(refinedSearch)) {
                              console.log("This value already exists.")
                        } else {
                              pastSearches.unshift(refinedSearch)
                              localStorage.setItem("historySearches", JSON.stringify(pastSearches)) 
                                                
                              recentSearches = [pastSearches[0], pastSearches[1], pastSearches[2], pastSearches[3], pastSearches[4]]
                              console.log(`Past searches: ${localStorage.setItem("historySearches", JSON.stringify(pastSearches))}`)
                              console.log(`Recent searches: ${recentSearches}`)
      
                              hCEl.empty()
                              recentSearches.forEach(search => {
                                    if (!search) {return;}
                                    hCEl.append(`<button class="btn btn-outline-light m-2" onclick="WeatherSearch()">${search}</button>`)
                              });
                        }

            });
}

var pastSearches = JSON.parse(localStorage.getItem("historySearches"))

if (!pastSearches){
      pastSearches = [""];
      localStorage.setItem("historySearches", JSON.stringify(pastSearches)) 
}
      
FormEl.on("submit", WeatherSearch)

function clearHistory() {
      hCEl.empty()
      pastSearches = [""];
      localStorage.setItem("historySearches", JSON.stringify(pastSearches)) 
}