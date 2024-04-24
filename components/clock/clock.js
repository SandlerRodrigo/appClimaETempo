function getClockData() {
    updateClock();
    setInterval(updateClock, 60000);
}

function updateClock(){
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const d = new Date();
    let day = weekday[d.getDay()];
    let mod = document.getElementById("mod");
    mod.innerHTML = day;

    let prima = d.getHours();
    let secu = d.getMinutes();
    let home = document.getElementById("hora");
    if (secu <=9){home.innerHTML = prima + ":0" + secu;}
    else{home.innerHTML = prima + ":" + secu;}

    let dd = d.getDate();
    let mm = d.getMonth();
    let yy = d.getFullYear();
    let gorge = document.getElementById("omed");
    gorge.innerHTML = dd + "/" + Number(mm + 1) + "/" + yy;

}