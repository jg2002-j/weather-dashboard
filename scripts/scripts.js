// Create a weather dashboard with form inputs.

// When a user searches for a city they are presented with current and future conditions for that city and that city is added to the search history
// When a user views the current weather conditions for that city they are presented with:

      var FormEl = $("#search-form")
      var InputEl = $("#search-input")

      var currentForecastarea = $("#today")
      var fivedayforecastarea = $("#forecast")
      
      function WeatherSearch(event){
            event.preventDefault();
            var SearchQuery = InputEl.val();
            InputEl.val("");
            currentForecastarea.empty();
            fivedayforecastarea.empty();
            
            var currentDate = dayjs();
            var date = currentDate.format("dddd DD/MM/YYYY");

            // The city name
            fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${SearchQuery}&limit=1&appid=29d3c41b285caf441bf342de37c4db4d`)
                  .then(function (response) {
                        return response.json();
                  }).then(function (data){
                        var lat = data[0].lat;
                        var lon = data[0].lon;
                        var cityName = data[0].name + ", " + data[0].country;
                  
                        fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=alerts,minutely&appid=29d3c41b285caf441bf342de37c4db4d`)
                              .then(function (response) {
                                    return response.json();
                              }).then(function (data){
                                                                        
                                    var weather = data.current.weather[0].main;
                                    // An icon representation of weather conditions
                                    var weatherIcon = data.current.weather[0].icon;
                                    // The temperature
                                    var temperature = data.current.temp;
                                    // The humidity
                                    var humidity = data.current.humidity;
                                    // The wind speed
                                    var windspeed = data.current.wind_speed;

                                    currentForecastarea.append(`
                                    <div class="card">
                                          <div class="card-body">
                                                <div class="d-flex justify-content-between align-content-center">
                                                      <div class="d-flex flex-column justify-content-evenly">
                                                            <h3 class="card-title">${cityName}</h3>
                                                            <h5>Today: ${date}</h5>
                                                      </div>
                                                      <img src="https://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="${weather}">
                                                </div>
                                                <div class="container d-flex justify-content-start">
                                                      <div class="card m-2" style="width: 15rem;">
                                                            <div class="card-body">
                                                            <h5 class="card-title"><i class="me-2 bi bi-thermometer-half"></i> Temperature </h5>
                                                            <p class="card-text">${temperature}</p>
                                                            </div>
                                                      </div>
                                                      <div class="card m-2" style="width: 15rem;">
                                                            <div class="card-body">
                                                            <h5 class="card-title"><i class="me-2 bi bi-wind"></i> Wind</h5>
                                                            <p class="card-text">${windspeed}</p>
                                                            </div>
                                                      </div>
                                                      <div class="card m-2" style="width: 15rem;">
                                                            <div class="card-body">
                                                            <h5 class="card-title"><i class="me-2 bi bi-droplet-half"></i> Humidity</h5>
                                                            <p class="card-text">${humidity}</p>
                                                            </div>
                                                      </div>
                                                </div>
                                          </div>
                                    </div>
                                    `)
                              });

                        var forecastDays = [currentDate.add(1, "day").format("YYYY-MM-DD"), currentDate.add(2, "day").format("YYYY-MM-DD"), currentDate.add(3, "day").format("YYYY-MM-DD"), currentDate.add(4, "day").format("YYYY-MM-DD"), currentDate.add(5, "day").format("YYYY-MM-DD")];
                        
                        fivedayforecastarea.append(`<div class="card"><div class="card-body"><h3 class="card-title" >5-Day Forecast</h3><div class="container d-flex flex-nowrap justify-content-start" id="forecastcards"></div></div></div>`)

                        forecastDays.forEach(date => {    
                              fetch(`https://api.openweathermap.org/data/3.0/onecall/day_summary?lat=${lat}&lon=${lon}&units=metric&exclude=alerts&date=${date}&appid=29d3c41b285caf441bf342de37c4db4d`)
                                    .then(function (response) {
                                          return response.json();
                                    }).then(function (data){
                                          console.log(data)
                                          // An icon representation of weather conditions
                                          // var forecastweatherIcon = data.current.weather[0].icon;
                                          // The temperature
                                          var forecasttemperatureMax = data.temperature.max;
                                          var forecasttemperatureMin = data.temperature.min;
                                          // The humidity
                                          var forecasthumidity = data.humidity.afternoon;
                                          // The wind speed
                                          var forecastwindspeed = data.wind.max.speed;

                                          $("#forecastcards").append(`
                                          <div class="card m-2" style="width: 15rem;">
                                                <div class="card-body">
                                                      <div class="d-flex flex-column justify-content-between align-content-center">
                                                            <img src="https://openweathermap.org/img/wn/01d@2x.png" alt="Weather icon">
                                                            <div class="d-flex flex-column justify-content-evenly">
                                                                  <h5>${date}</h5>
                                                            </div>
                                                      </div>
                                                      <p class="card-text mb-1"><i class="me-2 bi bi-thermometer-half"></i>${forecasttemperatureMin} — ${forecasttemperatureMax}</p>
                                                      <p class="card-text mb-1"><i class="me-2 bi bi-wind"></i> ${forecastwindspeed}</p>
                                                      <p class="card-text mb-1"><i class="me-2 bi bi-droplet-half"></i>${forecasthumidity}</p>
                                                </div>
                                          </div>
                                          `)

                                    });
                              });            
                  });
      }

      FormEl.on("submit", WeatherSearch)

      





      // When a user click on a city in the search history they are again presented with current and future conditions for that city