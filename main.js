const API_KEY = "82f32e38c41e40633981ec24dbae5dc1"
const defaultCords = [30.0325, -51.2304]
const defaultCity = "Porto Alegre"
const mainCityCords = {
    Londres: [51.5073219, -0.1276474],
    Paris: [48.8588897, 2.3200410217200766],
    Tokyo: [35.6895, 139.6917],
    "New York": [40.7128, -74.0060],
    "Xique-Xique": [-10.8217193, -42.7265689],
    Pequim: [39.906217, 116.391275],
}
/**
 * Carrega os dados iniciais da pagina o que envolve carregar os componentes
 * encontrar a latitude e longitude do usuario e fazer fetch dos dados do tempo
 * e finalmente remover a tela de loading 
 * */
async function loadData() {
    await loadComponents()
    getClockData()
    let cords = await getGeoLocation()
    let tempo = await fetchData(cords[0], cords[1])
    removeLoading()
    getNavBarData(updateDataWithCity, updateDataWithUnit, tempo, defaultCity)
    getDailyTempData(tempo, defaultCity)
    getWeeklyTempData(tempo)
    
    // As cidades principais podem ser carregadas após a remoção da tela de carregamento
    // pois não são essenciais para o uso do aplicativo e tendem a demorar mais por se 
    // tratar de várias requisições
    mainCitiesTempData = await fetchMainCitiesData()
    getMainCitiesDatas(mainCitiesTempData)

}
loadData()

/**
 * Atualiza os componentes relevantes da pagina com os dados 
 * de uma nova cidade
 * @param {Number} lon - Longitude da nova cidade
 * @param {Number} lat - Latitude da nova cidade
 * @param {String} cityName - Nome da nova cidade
 * */
async function updateDataWithCity(lon,lat, cityName) {
    let data = await fetchData(lat, lon, true)
    getDailyTempData(data, cityName)
    getWeeklyTempData(data)
    getNavBarData(updateDataWithCity, updateDataWithUnit, data, cityName)
}


async function updateDataWithUnit(data, unit, cityName) {
    let newList = data.list.map(element => {
        return {...element, main: {...element.main, temp: converterTemperatura(element.main.temp, unit)}}
    })
    let newData = {...data, list: newList}
    getDailyTempData(newData, cityName)
    getWeeklyTempData(newData)
// get mainCitiesData on localStorage
    let mainCitiesData = JSON.parse(localStorage.getItem('mainCitiesData'));
    let newMainCitiesData = mainCitiesData
    let mainCitiesDataList = Object.keys(mainCitiesData)
    mainCitiesDataList.forEach(city => {
        newMainCitiesData[city] = {...mainCitiesData[city], main: {...mainCitiesData[city].main, temp: converterTemperatura(mainCitiesData[city].main.temp, unit)}}
    })
    getMainCitiesDatas(newMainCitiesData)
}


/**
 * Faz o GET dos dados a partir da API do OpenWeatherMap, os dados são armazenados 
 * no localStorage para evitar requisições desnecessárias a API e são apenas atualizados
 * após mais de 1h da última requisição
 * @param {Number} latitude - Latitude da nova cidade
 * @param {Number} longitude - Longitude da nova cidade
 * @param {String} isChangeOfCity - Boolean para indicar se a requisição é uma troca de cidade
 * */
function fetchData(latitude, longitude , isChangeOfCity = false) {
    return new Promise((resolve, reject) => {
        // Busca os dados no local storage e verifica se a última requisição foi feita a menos de 1h
        // se sim, resolve a promessa com os dados do local storage
        const weatherData = JSON.parse(localStorage.getItem('weatherData'));
        const timestamp = localStorage.getItem('timestamp');
        if (!isChangeOfCity && weatherData && weatherData !={} && timestamp && Date.now() - timestamp < 3600000) {
            resolve(weatherData);
            return;
        }
        // Se a requisição for uma troca de cidade, busca os dados no local storage citiesWeatherData
        // onde a chave é a latitude e longitude se a última requisição foi feita a menos de 1h
        // resolve a promessa com os dados do local storage
        const citiesWeatherData = JSON.parse(localStorage.getItem('citiesWeatherData'));
        const citiesTimestamp = localStorage.getItem('citiesTimestamp');
        if (isChangeOfCity && citiesWeatherData && citiesWeatherData[latitude] && 
            citiesWeatherData[latitude][longitude] && 
            citiesWeatherData[latitude][longitude] != {} && Date.now() - citiesTimestamp < 3600000) {
            resolve(citiesWeatherData[latitude][longitude]);
            return;
        }

        // Se não houver dados no local storage ou se a última requisição foi feita a mais de 1h
        // faz uma requisição a API do OpenWeatherMap
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=pt_br`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao obter os dados da API');
                }
                return response.json();
            })
            .then(data => {
                // Armazenar dados na localStorage e guarda o timestamp
                localStorage.setItem('weatherData', JSON.stringify(data));
                localStorage.setItem('timestamp', Date.now());
                // Caso seja uma troca de cidade, armazena os dados no citiesWeatherData
                // utilizando a latitude e longitude como chave
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

/**
 * Faz o GET dos dados das principais cidades a partir de uma lista de coordenadas 
 * pré-definidas, os dados são armazenados no localStorage para evitar requisições
 * desnecessárias a API e são apenas atualizados após mais de 1h da última requisição 
 * */
async function fetchMainCitiesData() {   
    // Busca os dados no local storage e verifica se a última requisição foi feita a menos de 1h
    // se sim, resolve a promessa com os dados do local storage
    let mainCitiesData = JSON.parse(localStorage.getItem('mainCitiesData'));
    const timestamp = localStorage.getItem('timestamp');
    if (mainCitiesData && Object.keys(mainCitiesData).length > 0 && timestamp && Date.now() - timestamp < 3600000) {
        return mainCitiesData;
    } 

    // Se não houver dados no local storage ou se a última requisição foi feita a mais de 1h
    // faz uma requisição a API do OpenWeatherMap para cada cidade principal

    mainCitiesData = {};
    let mainCityCordsList = Object.keys(mainCityCords);
    const promises = mainCityCordsList.map(async (city) => {
        const [latitude, longitude] = mainCityCords[city];
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        mainCitiesData[city] = data;
    });
    await Promise.all(promises);

    // Depois que todas as promessas forem resolvidas, salvar no armazenamento local
    localStorage.setItem('mainCitiesData', JSON.stringify(mainCitiesData));
    localStorage.setItem('timestamp', Date.now());

    return mainCitiesData;
}


/**
 * Utiliza a API de geolocalização do navegador para obter a latitude e longitude do usuário
 * e armazena no localStorage para evitar requisições desnecessárias. Caso a geolocalização não
 * seja permitida ou não seja suportada, retorna as coordenadas padrão que são predefinidas
 * para Porto Alegre
 * */
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


/**
 * Converter a temperatura de Celsius para Fahrenheit ou Kelvin ou manter em Celsius
 * @param {Number} temp - Temperatura em graus Celsius
 * @param {String} unidadeAlvo - Unidade alvo da temperatura ('F' para Fahrenheit, 'K' para Kelvin e 'C' para Celsius)
 * */
function converterTemperatura(temp, unidadeAlvo) {
    // Supondo que 'temp' esteja em graus Celsius (C)
    if (unidadeAlvo === 'F') {
        // Converter para Fahrenheit (F)
        return ((temp * 9 / 5) + 32).toFixed(2);
    } else if (unidadeAlvo === 'K') {
        // Converter para Kelvin (K)
        return (temp + 273.15).toFixed(2);
    }else if(unidadeAlvo == 'C') {
        // Se a unidade alvo for 'C', retornar a temperatura original
        return temp;
    } else {
        // Se a unidade alvo não for 'f' nem 'k', retornar a temperatura original
        return temp;
    }
}