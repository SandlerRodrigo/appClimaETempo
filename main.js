const API_KEY = "82f32e38c41e40633981ec24dbae5dc1"
const defaultCords = [30.0325, -51.2304]
const defaultCity = "Porto Alegre"
const mainCityCords = {
    Londres: [51.5074, -0.1278],
    Paris: [48.8566, 2.3522],
    Tokyo: [35.6895, 139.6917],
    NewYork: [40.7128, -74.0060],
    XiqueXique: [-9.5373, -42.3588],
    Pequim: [39.9042, 116.4074],
}


async function loadData() {
    let cords;
    let tempo;
    await loadComponents()
    getNavBarData(updateDataWithCity)
    getClockData()
    cords = await getGeoLocation()
    tempo = await fetchData(cords[0], cords[1])
    getDailyTempData(tempo, defaultCity)
    getWeeklyTempData(tempo)
    mainCitiesTempData = await fetchMainCitiesData()
    getMainCitiesDatas(mainCitiesTempData)

}

async function updateDataWithCity(lon,lat, cityName) {
    let data = await fetchData(lat, lon, true)
    getDailyTempData(data, cityName)
    getWeeklyTempData(data)
}


loadData()

function fetchData(latitude, longitude , isChangeOfCity = false) {
    return new Promise((resolve, reject) => {
        // Verificar se os dados estão armazenados na localStorage e se faz menos de 1h que foram armazenados
        const weatherData = JSON.parse(localStorage.getItem('weatherData'));
        const timestamp = localStorage.getItem('timestamp');
        if (!isChangeOfCity && weatherData && weatherData !={} && timestamp && Date.now() - timestamp < 3600000) {
            resolve(weatherData);
            return;
        }
        const citiesWeatherData = JSON.parse(localStorage.getItem('citiesWeatherData'));
        const citiesTimestamp = localStorage.getItem('citiesTimestamp');
        if (isChangeOfCity && citiesWeatherData && citiesWeatherData[latitude] && 
            citiesWeatherData[latitude][longitude] && 
            citiesWeatherData[latitude][longitude] != {} && Date.now() - citiesTimestamp < 3600000) {
            // Verifica se os dados estao no local storage citiesWeatherData
            // onde a chave é a latitude e longitude
            resolve(citiesWeatherData[latitude][longitude]);
            return;
        }
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=pt_br`)
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
                if (isChangeOfCity) {
                    const citiesWeatherData = JSON.parse(localStorage.getItem('citiesWeatherData')) || {};
                    citiesWeatherData[latitude] = citiesWeatherData[latitude] || {};
                    citiesWeatherData[latitude][longitude] = data;
                    localStorage.setItem('citiesWeatherData', JSON.stringify(citiesWeatherData));
                    localStorage.setItem('citiesTimestamp', Date.now());

                }
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
    });
}

async function fetchMainCitiesData() {   
    let mainCitiesData = JSON.parse(localStorage.getItem('mainCitiesData'));
    const timestamp = localStorage.getItem('timestamp');
    if (mainCitiesData && Object.keys(mainCitiesData).length > 0 && timestamp && Date.now() - timestamp < 3600000) {
        return mainCitiesData;
    } 

    mainCitiesData = {};
    let mainCityCordsList = Object.keys(mainCityCords);

    // Array para armazenar todas as promessas geradas no loop
    const promises = mainCityCordsList.map(async (city) => {
        const [latitude, longitude] = mainCityCords[city];
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        mainCitiesData[city] = data;
    });

    // Aguardar todas as promessas serem resolvidas
    await Promise.all(promises);

    // Depois que todas as promessas forem resolvidas, salvar no armazenamento local
    localStorage.setItem('mainCitiesData', JSON.stringify(mainCitiesData));
    localStorage.setItem('timestamp', Date.now());

    return mainCitiesData;
}



async function fetchDailyTempData(latitude, longitude) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
    const data = await response.json();
    return data;

} 



function getGeoLocation() {
    return new Promise((resolve, reject) => {
        if (localStorage.getItem('latitude') && localStorage.getItem('longitude')) {
            resolve([localStorage.getItem('latitude'), localStorage.getItem('longitude')]);
            return;
        }
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    localStorage.setItem('latitude', latitude);
                    localStorage.setItem('longitude', longitude);

                    resolve([latitude, longitude]); // Resolvendo a promessa com os valores de latitude e longitude
                },
                function (error) {
                    console.error("Erro ao obter a localização do usuário:", error.message);
                    console.log("Retornando coordenadas padrão...");
                    resolve(defaultCords); // Retorna as coordenadas padrão em caso de erro
                }
            );
        } else {
            console.error("Geolocalização não é suportada neste navegador.");
            reject("Geolocalização não é suportada neste navegador."); // Rejeitando a promessa se a geolocalização não for suportada
        }
    });
}