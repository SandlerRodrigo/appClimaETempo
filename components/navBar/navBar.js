// TODO: MELHORAR A ORGANIZAÇÃO DO CÓDIGO ADICIONANDO FUNÇÕES PARA CADA EVENT LISTENER
// EVITANDO FUNÇÕES ANONIMAS LONGAS E COM MULTIPLOS PROPÓSITOS

let lastSearches = JSON.parse(localStorage.getItem('lastSearches')) || {};

function getNavBarData(updateDataWithCity, updateDataWithUnit, tempo, cityName) {

  // PEGANDO ELEMENTOS DO DOM

  const searchInput = document.getElementById('searchTextField');
  const autoComplete = document.getElementById('autoComplete');
  const popup = document.getElementById('popup');
  const configIcon = document.getElementById('configIcon');
  let form = document.getElementById('searchForm');


  // ADICIONADNO EVENTOS LISTENERS

  popup.addEventListener('click', (event) => {
    event.stopPropagation();
  });  
  searchInput.addEventListener('click', function() {
    autoComplete.style.display = "flex";
  });
  configIcon.addEventListener("click", onConfigIconClick);
  
form.addEventListener('submit', async function(event) {
    event.preventDefault(); // Isso impede que a página seja recarregada
    let search = await searchPlace(searchInput.value);
    if (search) {
        searchInput.value = "";
        searchInput.placeholder = search[0].name + ", " + search[0].country;
        if (Object.keys(lastSearches).length >= 5) {
            delete lastSearches[Object.keys(lastSearches)[0]];
        }
        lastSearches[search[0].name] = search;
        updateAutoComplete(searchInput);
        updateDataWithCity(search[0].lon, search[0].lat, search[0].name);
    }
});

  document.addEventListener('click', function(event) {
    // Verifica se o clique foi fora do searchInput e do autoComplete
  if (!searchInput.contains(event.target) && !autoComplete.contains(event.target)) {
    autoComplete.style.display = 'none'; // Esconde o autoComplete
  }
  // esconde o pop up do config
  if (!document.getElementById('configIcon').contains(event.target) && !popup.contains(event.target)) {
    popup.style.transform = 'scale(0)';
  }
});


  // Chama função inicialmente para popular o autoComplete caso haja dados salvos
  updateAutoComplete(searchInput);


  handleUnitChange(updateDataWithUnit, tempo, cityName);
}



/**
 * Faz uma requisição a API do OpenWeatherMap para buscar uma cidade
 * a prtir de um nome passado como parâmetro
 * @param {string} name - Nome da cidade
 * @returns {Promise} - Promise com os dados da cidade
 * */
function searchPlace(name) {
  return new Promise((resolve, reject) => {
      if (lastSearches[name]) {
        return lastSearches[name];
       } 
        fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${name}&limit=1&appid=${API_KEY}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao obter os dados da API');
                }
                let result = response.json();
                return result;
            })
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
    });
}


/**
 * Função para abrir e fechar o pop up do config
 * @param {Event} event - Evento de click
 */
function onConfigIconClick(event) {
  event.stopPropagation();
  if (popup.style.transform === 'scale(0.8)') {
    popup.style.transform = 'scale(0)';
  } else {
    popup.style.transform = 'scale(0.8)';
  }
}


/**
 * Atualiza o autoComplete com as cidades salvas
 * chamando a função searchPlace para cada cidade no evento de click
 * @param {HTMLInputElement} searchInput - Input de busca
 */
function updateAutoComplete(searchInput){
  const autoComplete = document.getElementById('autoComplete');
  autoComplete.innerHTML = '';
  let list  = Object.keys(lastSearches)
  list.forEach((city) => {
    const cityElement = document.createElement('a');
    cityElement.textContent = city + ", " + lastSearches[city][0].country;
    cityElement.addEventListener('click', () => {
      searchPlace(city)
      searchInput.value = "";
      searchInput.placeholder = city + ", " + lastSearches[city][0].country;
      updateDataWithCity(lastSearches[city][0].lon, lastSearches[city][0].lat, city);
      autoComplete.style.display = 'none';
    });
    autoComplete.appendChild(cityElement);
  });

  localStorage.setItem('lastSearches', JSON.stringify(lastSearches));
}


function handleUnitChange(updateDataWithUnit, tempo, cityName) {
// Seleciona todos os radio buttons com o name "temperature"
const radioButtons = document.querySelectorAll('input[name="temperature"]');

// Itera sobre cada radio button e adiciona um event listener para o evento change
radioButtons.forEach(radioButton => {
    radioButton.addEventListener('change', function() {
        // Quando um radio button for alterado, imprime o valor do radio button selecionado
        updateDataWithUnit(tempo, this.value, cityName);
    });
});

}




// CHANGE MODE DARK/LIGHT

function darkMode(){
  document.getElementById("clock").classList.add("dark");
  document.querySelectorAll(".defaultBg").forEach((po) => {
    po.classList.add('darks');
  });
  document.getElementById("corpo").classList.add("escuridao");
  document.getElementById("upa").classList.add("maisescuro");
  document.getElementById("procura").classList.add("maisescuro");
  document.getElementById("searchTextField").classList.add("darks");
  document.getElementById("lupa").classList.add("lupacolor");
  document.getElementById("textoTempRise").classList.add("textoClaro");
  document.getElementById("textoTempSet").classList.add("textoClaro");
}

function lightMode(){
  document.getElementById("clock").classList.remove("dark");
  document.querySelectorAll(".defaultBg").forEach((po) => {
    po.classList.remove('darks');
  });
  document.getElementById("corpo").classList.remove("escuridao");
  document.getElementById("upa").classList.remove("maisescuro");
  document.getElementById("procura").classList.remove("maisescuro");
  document.getElementById("searchTextField").classList.remove("darks");
  document.getElementById("lupa").classList.remove("lupacolor");
  document.getElementById("textoTempRise").classList.remove("textoClaro");
  document.getElementById("textoTempSet").classList.remove("textoClaro");
}