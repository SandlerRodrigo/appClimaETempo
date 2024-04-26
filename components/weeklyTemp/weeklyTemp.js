function getWeeklyTempData(tempo){
    let data
    let i = 0
    let num = 0  
    while(i < 40){
        let data = new Date(tempo.list[i].dt_txt)
        if(data.getHours()%12 == 0 & data.getHours()!=0 || data.getHours()%21 == 0 & data.getHours()!=0 ){        
            let diaDaSemana = data.toLocaleDateString("en-US", { weekday: "short" })
            document.getElementById("temp" + num).innerHTML = tempo.list[i].main.temp + "°C"
            document.getElementById("day" + num).innerHTML = diaDaSemana
            document.getElementById("time" + num).innerHTML = data.getHours()  + "h"
            document.getElementById("rain" + num).innerHTML = tempo.list[i].main.humidity + "%"
            document.getElementById("wind" + num).innerHTML = tempo.list[i].wind.speed + "m/s"
            document.getElementById("img" + num).src =  "images/clear_day.svg"
            if(tempo.list[i].weather[0].id <= 232 & tempo.list[i].weather[0].id >= 200){
                document.getElementById("img" + num).src =  "images/storm.svg"
            }else if(tempo.list[i].weather[0].id <= 321 & tempo.list[i].weather[0].id >= 300){
                document.getElementById("img" + num).src =  "images/rain.svg"
            }else if(tempo.list[i].weather[0].id <= 531 & tempo.list[i].weather[0].id >= 500){
                document.getElementById("img" + num).src =  "images/rain.svg"
            }else if(tempo.list[i].weather[0].id <= 622 & tempo.list[i].weather[0].id >= 600){
                document.getElementById("img" + num).src =  "images/snow.svg"
            }else if(tempo.list[i].weather[0].id == 800){
                document.getElementById("img" + num).src =  "images/clear_day.svg"
            }else if(tempo.list[i].weather[0].id <= 804 & tempo.list[i].weather[0].id > 800){
                document.getElementById("img" + num).src =  "images/cloud.svg"
            }
            num++
        }
        if(num == 6){
            break;
        }
        i++
    }
}



