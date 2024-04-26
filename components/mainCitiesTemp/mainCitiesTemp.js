function getMainCitiesDatas(data){
    arrayCities = Object.keys(data)
    let city = arrayCities[0]
    for(i = 0; i < arrayCities.length; i++){
        city = arrayCities[i]
        document.getElementById("d_temp" + i).innerHTML = data[city].main.temp + "°"
        document.getElementById("d_day" + i).innerHTML = city
        document.getElementById("d_wind" + i).innerHTML = data[city].wind.speed + "m/s"
        document.getElementById("d_rain" + i).innerHTML = data[city].main.humidity + "%"
        if(data[city].weather[0].id <= 232 & data[city].weather[0].id >= 200){
            document.getElementById("d_img" + i).src =  "images/storm.svg"
        }else if(data[city].weather[0].id <= 321 & data[city].weather[0].id >= 300){
            document.getElementById("d_img" + i).src =  "images/rain.svg"
        }else if(data[city].weather[0].id <= 531 & data[city].weather[0].id >= 500){
            document.getElementById("d_img" + i).src =  "images/rain.svg"
        }else if(data[city].weather[0].id <= 622 & data[city].weather[0].id >= 600){
            document.getElementById("d_img" + i).src =  "images/snow.svg"
        }else if(data[city].weather[0].id == 800){
            document.getElementById("d_img" + i).src =  "images/clear_day.svg"
        }else if(data[city].weather[0].id <= 804 & data[city].weather[0].id > 800){
            document.getElementById("d_img" + i).src =  "images/cloud.svg"
        }
    }
}

