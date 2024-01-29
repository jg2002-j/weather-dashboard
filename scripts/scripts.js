// Create a weather dashboard with form inputs.

// When a user searches for a city they are presented with current and future conditions for that city and that city is added to the search history
// When a user views the current weather conditions for that city they are presented with:

      var FormEl = $("#search-form")
      var InputEl = $("#search-input")

      var currentForecastarea = $("#today")
      
      function WeatherSearch(event){
            event.preventDefault();
            var SearchQuery = InputEl.val();
            InputEl.val("");
            console.log(SearchQuery);
            
            var currentDate = dayjs();
            var date = currentDate.format("dddd DD/MM/YYYY");


            // The date
            console.log(date)

            // The city name
            fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${SearchQuery}&limit=1&appid=29d3c41b285caf441bf342de37c4db4d`)
                  .then(function (response) {
                        return response.json();
                  }).then(function (data){
                        console.log(data)
                        var lat = data[0].lat;
                        var lon = data[0].lon;
                        console.log(`latitude: ${lat}, longitude: ${lon}`)
                        var cityName = data[0].name + ", " + data[0].country;
                  
                        fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=alerts,minutely&appid=29d3c41b285caf441bf342de37c4db4d`)
                              .then(function (response) {
                                    return response.json();
                              }).then(function (data){
                                                                        
                                    var weather = data.current.weather[0].main;
                                    console.log("Weather is " + weather);
                                    
                                    // An icon representation of weather conditions
                                    var weatherIcon = data.current.weather[0].icon;
                                    console.log(weatherIcon);
                                    console.log(`https://openweathermap.org/img/wn/${weatherIcon}@2x.png`)
                                    
                                    // The temperature
                                    var temperature = data.current.temp;
                                    console.log("Temperature is " + temperature);
                                    
                                    // The humidity
                                    var humidity = data.current.humidity;
                                    console.log("Humidity is " + humidity)
                                    
                                    // The wind speed
                                    var windspeed = data.current.wind_speed;
                                    console.log("Windspeed is " + windspeed);

                                    currentForecastarea.append(`
                                    <div class="card">
                                          <div class="card-body">
                                          <h3 class="card-title">${cityName}</h3>
                                          <h5>${date}</h5>
                              
                                          <div class="container d-flex flex-nowrap justify-content-start">
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

                        var day2  = currentDate.add(1, 'day')
                        var day3 = currentDate
                        
                        fetch("https://api.openweathermap.org/data/3.0/onecall/timemachine?lat={lat}&lon={lon}&dt={time}&appid={API key}")


                  });            

      }

      FormEl.on("submit", WeatherSearch)

      









      // When a user view future weather conditions for that city they are presented with a 5-day forecast that displays:

            // The date

            // An icon representation of weather conditions

            // The temperature

            // The humidity

      // When a user click on a city in the search history they are again presented with current and future conditions for that city