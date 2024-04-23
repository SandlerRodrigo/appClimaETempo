function getClockData() {
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const d = new Date();
    let day = weekday[d.getDay()];
    let mod = document.getElementById("mod");
    mod.innerHTML = day;

    let prima = d.getHours();
    let secu = d.getMinutes();
    let home = document.getElementById("hora");
    home.innerHTML = prima + ":" + secu;

    let dd = d.getDate();
    let mm = d.getMonth();
    let yy = d.getFullYear();
    let gorge = document.getElementById("omed");
    gorge.innerHTML = dd + "/" + Number(mm + 1) + "/" + yy.slice(2);

}