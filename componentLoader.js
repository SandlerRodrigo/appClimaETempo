function loadComponents() {
    var elementos = document.querySelectorAll('div[component]');
    var promises = [];

    elementos.forEach(elemento => {
        // Promessa para carregar o CSS do componente
        var loadCssPromise = new Promise((resolve, reject) => {
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.media = 'screen';
            link.href = `components/${elemento.id}/${elemento.id}.css`;
            link.onload = resolve;
            link.onerror = reject;
            document.head.appendChild(link);
        });

        // Promessa para carregar o JavaScript do componente
        var loadJsPromise = new Promise((resolve, reject) => {
            var script = document.createElement('script');
            script.src = `components/${elemento.id}/${elemento.id}.js`;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });

        // Promessa para carregar o HTML do componente
        var loadHtmlPromise = fetch(`components/${elemento.id}/${elemento.id}.html`)
            .then(response => response.text())
            .then(html => {
                document.querySelector(`#${elemento.id}`).innerHTML = html;
            });

        // Adicionando as promessas ao array de promessas
        promises.push(loadCssPromise, loadJsPromise, loadHtmlPromise);
    });

    // Retornando uma única promessa que será resolvida quando todas as promessas individuais forem resolvidas
    return Promise.all(promises);
}
