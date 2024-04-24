


function getNavBarData() {
  document.getElementById("configIcon").addEventListener("click", onConfigIconClick);

  // Adiciona um evento de tecla ao input
  const searchInput = document.getElementById('searchTextField');

  const autoComplete = document.getElementById('autoComplete');

  const popup = document.getElementById('popup');



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
        }

    }
});
}




function searchPlace(name) {
    return new Promise((resolve, reject) => {
        fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${name}&limit=1&appid=${API_KEY}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao obter os dados da API');
                }
                return response.json();
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

// Impedir que o click no popup feche o popup
document.getElementById('popup').addEventListener('click', (event) => {
  event.stopPropagation();
});
