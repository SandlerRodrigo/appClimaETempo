/**
 * Esta função carrega elementos HTML, CSS e JavaScript de cada um dos componentes,
 * e os insere no documento. Para isso os elementos devem ter o atributo 'component' e
 * um id que corresponda ao nome da pasta do componente assim como o nome do arquivo html, css e js.
 * 
 * Exemplo:
 *  <div id="dailyTemp" component></div>
 * 
 * Neste caso, o componente 'dailyTemp' deve possuir os seguintes arquivos:
 * - components/dailyTemp/dailyTemp.html
 * - components/dailyTemp/dailyTemp.css
 * - components/dailyTemp/dailyTemp.js
 * */
function loadComponents() {
    var elementos = document.querySelectorAll('div[component]');
    var promises = [];

    elementos.forEach(elemento => {
        // Carregar o CSS do componente
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

        // Carregar o JavaScript do componente
        var loadJsPromise = new Promise((resolve, reject) => {
            var script = document.createElement('script');
            script.src = `components/${elemento.id}/${elemento.id}.js`;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });

        // Carregar o HTML do componente
        var loadHtmlPromise = fetch(`components/${elemento.id}/${elemento.id}.html`)
            .then(response => response.text())
            .then(html => {
                document.querySelector(`#${elemento.id}`).innerHTML = html;
            });

        promises.push(loadCssPromise, loadJsPromise, loadHtmlPromise);
    });

    return Promise.all(promises);
}
