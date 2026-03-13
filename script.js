function initTicker() {
    const container = document.getElementById('ticker-values');
    const moedas = `USD: R$ 4,96 <i class="fas fa-caret-up up"></i> | EUR: R$ 5,38 <i class="fas fa-caret-down down"></i>`;
    const graos = `SOJA: R$ 134,50 <i class="fas fa-caret-up up"></i> | MILHO: R$ 62,20 <i class="fas fa-caret-down down"></i>`;
    const conteudo = `
        <span class="ticker-label">Moedas</span> <span class="ticker-value">${moedas}</span>
        <span class="ticker-label">Grãos</span> <span class="ticker-value">${graos}</span>
    `;
    container.innerHTML = conteudo + conteudo;
}

function initMap() {
    const mapa = L.map('map').setView([-23.4, -51.9], 9);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapa);
    let marker = L.marker([-23.4, -51.9]).addTo(mapa);

    async function getClima(lat, lng) {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`);
        const data = await res.json();
        marker.setLatLng([lat, lng]).bindPopup(`Temperatura: ${data.current_weather.temperature}°C`).openPopup();
    }
    mapa.on('click', (e) => getClima(e.latlng.lat, e.latlng.lng));
    getClima(-23.4, -51.9);
}

function atualizarTempo() {
    const agora = new Date();
    const display = document.getElementById('calendar-display');
    if (display) {
        display.innerHTML = `<div class="cal-header">${agora.toLocaleDateString('pt-br', {month:'long'})}</div>
        <div class="cal-date">${agora.getDate()}</div>
        <div style="font-weight:bold; color:var(--azul)">${agora.toLocaleTimeString()}</div>`;
    }
}

function toggleMenu() { document.getElementById('nav-links').classList.toggle('show'); }

window.onload = () => {
    initTicker();
    initMap();
    setInterval(atualizarTempo, 1000);
};

