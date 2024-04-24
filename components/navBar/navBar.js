

let lastSearches = JSON.parse(localStorage.getItem('lastSearches')) || {};

function getNavBarData() {

  // Impedir que o click no popup feche o popup
document.getElementById('popup').addEventListener('click', (event) => {
  event.stopPropagation();
});
  
  document.getElementById("configIcon").addEventListener("click", onConfigIconClick);
  
  // Adiciona um evento de tecla ao input
  const searchInput = document.getElementById('searchTextField');
  
  const autoComplete = document.getElementById('autoComplete');

  const popup = document.getElementById('popup');
  
  
  updateAutoComplete(searchInput);
  
  
  searchInput.addEventListener('click', function() {
    autoComplete.style.display = "flex";
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

  searchInput.addEventListener('keydown', async function(event) {
    // Verifica se a tecla pressionada foi Enter (código 13)
    if (event.key === "Enter") {
      console.log(searchInput.value)
         let search = await searchPlace(searchInput.value);
        if (search) {
          searchInput.value = "";
          searchInput.placeholder = search[0].name + ", " + search[0].country;
          if (Object.keys(lastSearches).length >= 5) {
            delete lastSearches[Object.keys(lastSearches)[0]];
          }
          lastSearches[search[0].name] = search;
          updateAutoComplete(searchInput);
        }

    }
});
}




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


function onConfigIconClick(event) {
  event.stopPropagation();
  if (popup.style.transform === 'scale(0.8)') {
    popup.style.transform = 'scale(0)';
  } else {
    popup.style.transform = 'scale(0.8)';
  }
}



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
      autoComplete.style.display = 'none';
    });
    autoComplete.appendChild(cityElement);
  });

  localStorage.setItem('lastSearches', JSON.stringify(lastSearches));
}
