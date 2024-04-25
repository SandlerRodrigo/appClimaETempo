// Objective: Get the daily temperature data from the API
function getDailyTempData(ListaDados) {
    document.querySelector('.city .cityName').innerHTML = ListaDados.city.name;
    document.querySelector('.aboveLine .temp').innerHTML = Math.round(ListaDados.list[0].main.temp);
    document.querySelector('.description').innerHTML = ListaDados.list[0].weather[0].description;
    document.querySelector('.bellowLine .dois .humidity').innerHTML = ListaDados.list[0].main.humidity + '%';
    document.querySelector('.bellowLine .um .DTwind').innerHTML = Math.round(ListaDados.list[0].wind.speed) + 'm/s';
    document.querySelector('.bellowLine .tres .chuva').innerHTML = 'TBD';

    let unix_timestamp = ListaDados.city.sunrise;
    let date = new Date(unix_timestamp * 1000);
    let hours = date.getHours();
    let minutes = "0" + date.getMinutes();
    let formattedTime = hours + ':' + minutes.substr(-2);
    document.querySelector('.lowerDiv .left .sunrise').innerHTML = formattedTime;

    let unix_timestamp2 = ListaDados.city.sunset;
    let date2 = new Date(unix_timestamp2 * 1000);
    let hours2 = date2.getHours();
    let minutes2 = "0" + date2.getMinutes();
    let formattedTime2 = hours2 + ':' + minutes2.substr(-2);
    document.querySelector('.lowerDiv .right .sunset').innerHTML = formattedTime2;

    const WeatherConditions = {
        STORM: { min: 200, max: 232, icon: "../../images/storm.svg" },
        LIGHT_RAIN: { min: 300, max: 321, icon: "../../images/rain.svg" },
        RAIN: { min: 500, max: 531, icon: "../../images/rain.svg" },
        SNOW: { min: 600, max: 622, icon: "../../images/snow.svg" },
        CLEAR_DAY: { min: 800, max: 800, icon: "../../images/clear_day.svg" },
        CLOUD: { min: 801, max: 804, icon: "../../images/cloud.svg" }
      };
      
      let weatherId = ListaDados.list[0].weather[0].id;
      let iconSrc;
      
      for (let condition in WeatherConditions) {
        if (weatherId >= WeatherConditions[condition].min && weatherId <= WeatherConditions[condition].max) {
          iconSrc = WeatherConditions[condition].icon;
          break;
        }
      }
      
      document.querySelector('.aboveLine .nuvem .fotinha').src = iconSrc;
}