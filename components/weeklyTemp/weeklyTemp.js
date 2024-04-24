function getWeeklyTempData(tempo){
    console.log(tempo)
    let data
    let i = 0
    let num = 0
    while(i < 40){
        data = new Date(tempo.list[i].dt_txt)
        if(data.getHours()%12 == 0 & data.getHours()!=0 || data.getHours()%21 == 0 & data.getHours()!=0 ){        
            let diaDaSemana = data.toLocaleDateString("en-US", { weekday: "short" })
            document.getElementById("temp" + num).innerHTML = tempo.list[i].main.temp + "°C"
            document.getElementById("day" + num).innerHTML = diaDaSemana
            document.getElementById("time" + num).innerHTML = data.getHours()  + "h"
            document.getElementById("rain" + num).innerHTML = tempo.list[i].main.humidity + "%"
            document.getElementById("wind" + num).innerHTML = tempo.list[i].wind.speed + "m/s"
            num++
        }
        if(num == 6){
            break;
        }
        i++
    }
}


