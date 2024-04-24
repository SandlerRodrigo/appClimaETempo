function getClockData() {
    updateClock();
    setInterval(updateClock, 60000);
}


// Adicionei um formatador pra evitar horarios tipo 0:1 e transformar em 00:01
// adicionei um set interval que atualiza o relogio a cada 60 segundos
function updateClock() {
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const d = new Date();
    let day = weekday[d.getDay()];
    let mod = document.getElementById("mod");
    mod.innerHTML = day;

    let prima = d.getHours();
    let secu = d.getMinutes();
    let home = document.getElementById("hora");
    home.innerHTML = formatTime(prima) + ":" + formatTime(secu);

    let dd = d.getDate();
    let mm = d.getMonth();
    let yy = d.getFullYear();
    let gorge = document.getElementById("omed");
    gorge.innerHTML = dd + "/" + Number(mm + 1) + "/" + yy;
}


function formatTime(time) {
  return time < 10 ? `0${time}` : time;
}