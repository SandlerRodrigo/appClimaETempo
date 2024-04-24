const API_KEY = "82f32e38c41e40633981ec24dbae5dc1"

async function loadData() {
    let cords;
    let tempo;
    await loadComponents()
    getNavBarData()
    getClockData()
    cords = await getGeoLocation()
    tempo = await fetchData(cords[0], cords[1])

}

loadData()

function fetchData(latitude, longitude) {
    return new Promise((resolve, reject) => {
        // Verificar se os dados estão armazenados na localStorage e se faz menos de 1h que foram armazenados
        const weatherData = JSON.parse(localStorage.getItem('weatherData'));
        const timestamp = localStorage.getItem('timestamp');
        if (weatherData && timestamp && Date.now() - timestamp < 3600000) {
            resolve(weatherData);
            return;
        }
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao obter os dados da API');
                }
                return response.json();
            })
            .then(data => {
                // Armazenar dados na localStorage e timestamp
                localStorage.setItem('weatherData', JSON.stringify(data));
                localStorage.setItem('timestamp', Date.now());
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
    });
}



function getGeoLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;

                    resolve([latitude, longitude]); // Resolvendo a promessa com os valores de latitude e longitude
                },
                function (error) {
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            reject("Permissão negada para obter a localização do usuário.");
                            break;
                        case error.POSITION_UNAVAILABLE:
                            reject("Informações de localização indisponíveis.");
                            break;
                        case error.TIMEOUT:
                            reject("Tempo limite expirado ao obter a localização do usuário.");
                            break;
                        case error.UNKNOWN_ERROR:
                            reject("Erro desconhecido ao obter a localização do usuário.");
                            break;
                    }
                }
            );
        } else {
            console.error("Geolocalização não é suportada neste navegador.");
            reject("Geolocalização não é suportada neste navegador."); // Rejeitando a promessa se a geolocalização não for suportada
        }
    });
}


