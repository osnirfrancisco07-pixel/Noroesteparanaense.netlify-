const cotacoes = { USD: 4.96, EUR: 5.38 };

function toggleMenu() {
    document.getElementById('nav-links').classList.toggle('show');
}

// BUSCA DE NOTÍCIAS
async function fetchNoticias() {
    const grid = document.getElementById('news-grid');
    try {
        const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://g1.globo.com/rss/g1/economia/');
        const data = await res.json();
        grid.innerHTML = data.items.slice(0, 3).map(item => `
            <div class="news-card">
                <div class="img-box"><img src="${item.thumbnail || 'posts/27317.jpg'}"></div>
                <div class="news-body">
                    <span class="tag">NOTÍCIA</span>
                    <h4>${item.title}</h4>
                    <a href="${item.link}" target="_blank" class="btn-link">Ver mais</a>
                </div>
            </div>
        `).join('');
    } catch (e) { grid.innerHTML = "<p>Erro ao carregar notícias.</p>"; }
}

// CALCULADORA
function convertCurrency() {
    const valor = document.getElementById('inputValue').value;
    const moeda = document.getElementById('currencySelect').value;
    const taxa = cotacoes[moeda];
    const display = document.getElementById('resultValue');
    display.innerHTML = valor > 0 ? `Conversão: <strong>${moeda} ${(valor / taxa).toFixed(2)}</strong>` : "Resultado: $ 0,00";
}

// TICKER TV
function initTicker() {
    const container = document.getElementById('ticker-values');
    const texto = "DÓLAR: R$ 4,96 • EURO: R$ 5,38 • SOJA: R$ 134,50 • MILHO: R$ 62,20 • BOI: R$ 232,00 • ";
    container.innerHTML = `<span>${texto}</span><span>${texto}</span>`;
}

// MAPA DO CLIMA (Configurado para o Noroeste do PR)
function initMap() {
    const map = L.map('map').setView([-23.4, -51.9], 8); // Coordenadas médias da região
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    L.marker([-23.4, -51.9]).addTo(map).bindPopup('Previsão para o Noroeste Paranaense').openPopup();
}

window.onload = () => {
    fetchNoticias();
    initTicker();
    initMap();
};
