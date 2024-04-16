var elementos = document.querySelectorAll('div[component]');

elementos.forEach(elemento => {
    // Carregar o CSS do componente
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.media = 'screen';
    link.href = `components/${elemento.id}/${elemento.id}.css`;

    // Adicionar o link do CSS antes de qualquer manipulação do HTML
    document.head.appendChild(link);

    // Carregar o JavaScript do componente
    var script = document.createElement('script');
    script.src = `components/${elemento.id}/${elemento.id}.js`;
    document.body.appendChild(script);
  
    // Carregar o HTML do componente
    fetch(`components/${elemento.id}/${elemento.id}.html`)
        .then(response => response.text())
        .then(html => {
            document.querySelector(`#${elemento.id}`).innerHTML = html;
        });
});