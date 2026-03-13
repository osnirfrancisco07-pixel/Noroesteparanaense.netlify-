// Abrir e fechar Menu Mobile
document.getElementById('mobile-menu-btn').addEventListener('click', function() {
    document.getElementById('nav-links').classList.toggle('active');
});

// Fechar menu ao clicar em um link (bom para mobile)
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('nav-links').classList.remove('active');
    });
});

// Cotações e Notícias
function carregarConteudo() {
    // Letreiro
    const track = document.getElementById('ticker-values');
    const conteudo = `<span class="ticker-label">MOEDAS</span> <span class="ticker-value">USD: R$ 4,98 <i class="fas fa-caret-up"></i> | EUR: R$ 5,42</span> <span class="ticker-label">AGRO</span> <span class="ticker-value">SOJA: R$ 134,00 | MILHO: R$ 62,00</span> `;
    track.innerHTML = conteudo + conteudo + conteudo;

    // Notícias Teste
    const grid = document.getElementById('news-grid');
    grid.innerHTML = `
        <div class="card-white">
            <img src="posts/27317.jpg" style="width:100%; border-radius:5px;">
            <h4 style="margin-top:10px">Portal Noroeste: Informação regional atualizada.</h4>
        </div>
        <div class="card-white">
            <img src="https://images.unsplash.com/photo-1594743216145-92dc01431665?w=400" style="width:100%; border-radius:5px;">
            <h4 style="margin-top:10px">Mercado de Grãos tem alta no Noroeste do PR.</h4>
        </div>
    `;
}

// Calculadora
const taxas = { USD: 4.98, EUR: 5.42 };
function converterMoeda() {
    const valor = document.getElementById('valorInput').value;
    const moeda = document.getElementById('moedaSelect').value;
    if(valor > 0) {
        document.getElementById('resultadoCalc').innerText = `Resultado: ${moeda} ${(valor / taxas[moeda]).toFixed(2)}`;
    }
}

// Mapa
function iniciarMapa() {
    const mapa = L.map('map').setView([-23.4, -51.9], 9);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapa);
    let marker = L.marker([-23.4, -51.9]).addTo(mapa);
    
    mapa.on('click', async (e) => {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${e.latlng.lat}&longitude=${e.latlng.lng}&current_weather=true`);
        const data = await res.json();
        marker.setLatLng(e.latlng).bindPopup(`Temp: ${data.current_weather.temperature}°C`).openPopup();
    });
}

window.onload = () => {
    carregarConteudo();
    iniciarMapa();
    setInterval(() => {
        document.getElementById('relogio-digital').innerText = new Date().toLocaleTimeString();
    }, 1000);
};
