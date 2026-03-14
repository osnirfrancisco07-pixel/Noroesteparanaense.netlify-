/**
 * PORTAL NOROESTE PARANAENSE - SCRIPT OFICIAL CONSOLIDADO
 * Versão: 3.1 (Estável)
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('Sistema Noroeste Paranaense iniciado com sucesso!');

    // --- 1. CONTROLO DO MENU MOBILE ---
    const btnMenu = document.getElementById('btn-menu-mobile');
    const navLinks = document.getElementById('nav-links');

    if (btnMenu && navLinks) {
        btnMenu.onclick = (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
        };

        // Fecha o menu ao clicar fora dele
        document.onclick = () => navLinks.classList.remove('active');

        // Fecha o menu ao clicar num link (âncora)
        navLinks.querySelectorAll('a').forEach(link => {
            link.onclick = () => navLinks.classList.remove('active');
        });
    }

    // --- 2. INTEGRAÇÃO DE NOTÍCIAS (RSS G1 NOROESTE) ---
    async function carregarNoticias() {
        const container = document.getElementById('rss-news-container');
        if (!container) return;

        const imagemPadrao = 'posts/27317.jpg';

        // Utilizamos a API rss2json para converter o feed XML do G1 em JSON
        const rssUrl = 'https://g1.globo.com/rss/g1/pr/norte-noroeste/';
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`Falha HTTP ao carregar RSS: ${response.status}`);
            }

            const data = await response.json();

            if (data.status === 'ok') {
                const items = Array.isArray(data.items) ? data.items : [];

                if (items.length === 0) {
                    container.innerHTML = '<p style="padding:20px;">Nenhuma notícia encontrada no momento.</p>';
                    return;
                }

                container.innerHTML = ''; // Limpa o carregando

                items.slice(0, 6).forEach(item => {
                    const imagem = item?.enclosure?.link || imagemPadrao;

                    const article = document.createElement('article');
                    article.className = 'card-white';

                    const imgBox = document.createElement('div');
                    imgBox.className = 'img-box';
                    const img = document.createElement('img');
                    img.src = imagem;
                    img.alt = item?.title || 'Imagem da notícia';
                    img.loading = 'lazy';
                    img.onerror = () => {
                        img.src = imagemPadrao;
                    };
                    imgBox.appendChild(img);

                    const title = document.createElement('h4');
                    title.style.margin = '10px 0';
                    title.style.fontSize = '16px';
                    title.style.color = '#004a8d';
                    title.textContent = item?.title || 'Notícia sem título';

                    const link = document.createElement('a');
                    link.href = item?.link || '#';
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    link.style.color = '#666';
                    link.style.fontWeight = 'bold';
                    link.style.textDecoration = 'none';
                    link.style.fontSize = '12px';
                    link.style.display = 'block';
                    link.style.marginTop = '5px';
                    link.textContent = 'Ler notícia completa →';

                    article.appendChild(imgBox);
                    article.appendChild(title);
                    article.appendChild(link);
                    container.appendChild(article);
                });
            } else {
                throw new Error('Resposta inesperada da API de RSS.');
            }
        } catch (error) {
            container.innerHTML = '<p style="padding:20px;">Não foi possível sincronizar as notícias agora. Verifique a sua ligação.</p>';
            console.error('Erro ao carregar notícias:', error);
        }
    }

    // --- 3. CLIMA E MAPA INTERATIVO (COM CHANCE DE CHUVA) ---
    function initMapaClima() {
        const mapDiv = document.getElementById('map');
        if (!mapDiv) return;

        // Coordenadas centrais (Região de Maringá)
        const latPadrao = -23.42;
        const lngPadrao = -51.93;

        // Inicializa o mapa Leaflet
        const mapa = L.map('map').setView([latPadrao, lngPadrao], 9);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapa);

        let marker = L.marker([latPadrao, lngPadrao]).addTo(mapa);

        async function obterPrevisao(lat, lng) {
            try {
                // API Open-Meteo para Clima e Probabilidade de Chuva
                const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&hourly=precipitation_probability`;
                const res = await fetch(url);
                const d = await res.json();

                const horaAtual = new Date().getHours();
                const chuvaProb = d?.hourly?.precipitation_probability?.[horaAtual] ?? 0;
                const temp = d?.current_weather?.temperature ?? '--';

                // Atualiza os campos no HTML
                document.getElementById('temp-atual').innerText = temp + '°C';
                document.getElementById('valor-chuva').innerText = chuvaProb;

                // Atualiza o marcador
                marker.setLatLng([lat, lng])
                    .bindPopup(`<b>Localização Selecionada</b><br>Temperatura: ${temp}°C<br>Prob. de Chuva: ${chuvaProb}%`)
                    .openPopup();

            } catch (err) {
                console.error('Erro ao obter clima:', err);
            }
        }

        // Ao clicar no mapa, atualiza o clima daquela posição
        mapa.on('click', e => {
            obterPrevisao(e.latlng.lat, e.latlng.lng);
        });

        // Carrega o clima inicial
        obterPrevisao(latPadrao, lngPadrao);
    }

    // --- 4. RELÓGIO DIGITAL ---
    function iniciarRelogio() {
        const relogio = document.getElementById('relogio-digital');
        if (!relogio) return;

        const renderizarHora = () => {
            relogio.innerText = new Date().toLocaleTimeString('pt-BR');
        };

        renderizarHora();
        setInterval(renderizarHora, 1000);
    }

    // --- 5. LETREIRO (TICKER) FINANCEIRO ---
    function configurarTicker() {
        const track = document.getElementById('ticker-values');
        if (!track) return;

        const itens = `
            <span class="ticker-group">MOEDAS</span>
            <span class="ticker-label">DÓLAR</span><span class="ticker-value">R$ 4,98</span>
            <span class="ticker-label">EURO</span><span class="ticker-value">R$ 5,42</span>
            <span class="ticker-label">LIBRA</span><span class="ticker-value">R$ 6,34</span>
            <span class="ticker-label">IENE</span><span class="ticker-value">R$ 0,033</span>
            <span class="ticker-brand">NOROESTE PARANAENSE</span>
            <span class="ticker-group">GRÃOS</span>
            <span class="ticker-label">SOJA</span><span class="ticker-value">R$ 134,80</span>
            <span class="ticker-label">MILHO</span><span class="ticker-value">R$ 61,50</span>
            <span class="ticker-label">TRIGO</span><span class="ticker-value">R$ 69,20</span>
            <span class="ticker-label">ARROZ</span><span class="ticker-value">R$ 112,40</span>
        `;
        // Triplicamos o conteúdo para o efeito de loop infinito ser suave
        track.innerHTML = itens + itens + itens;
    }

    // Execução das funções de inicialização
    carregarNoticias();
    initMapaClima();
    iniciarRelogio();
    configurarTicker();
});

// --- 6. FUNÇÕES GLOBAIS (Chamadas via 'onclick' no HTML) ---

// Conversor Agro
function converterMoeda() {
    const valor = parseFloat(document.getElementById('valorInput').value);
    const moeda = document.getElementById('moedaSelect').value;
    const resultadoDiv = document.getElementById('resultadoCalc');

    // Taxas fixas (Exemplo)
    const taxaDolar = 4.98;
    const taxaEuro = 5.42;

    if (!valor || valor <= 0) {
        resultadoDiv.innerText = 'Insira um valor válido.';
        return;
    }

    const taxa = (moeda === 'USD') ? taxaDolar : taxaEuro;
    const calculado = (valor / taxa).toFixed(2);

    resultadoDiv.innerText = `Total: ${moeda} ${calculado}`;
}

// Atualizar Horóscopo
function atualizarHoroscopo() {
    const signo = document.getElementById('signoSelect').value;
    const textoDiv = document.getElementById('horoscopo-texto');

    const previsoes = {
        'Áries': 'Energia em alta para novos projetos profissionais.',
        'Touro': 'Momento de focar na estabilidade financeira e poupar.',
        'Gêmeos': 'Dia ideal para resolver pendências de comunicação.',
        'Câncer': 'A intuição será sua melhor guia nos relacionamentos.',
        'Leão': 'Seu brilho pessoal atrairá boas oportunidades hoje.',
        'Virgem': 'A organização do seu espaço trará paz mental.',
        'Libra': 'Procure o equilíbrio entre o trabalho e o lazer.',
        'Escorpião': 'Mudanças profundas podem trazer renovação positiva.',
        'Sagitário': 'Dia favorável para expandir conhecimentos e viagens.',
        'Capricórnio': 'O esforço no trabalho será reconhecido em breve.',
        'Aquário': 'Ideias inovadoras podem resolver problemas antigos.',
        'Peixes': 'Momento de introspeção e cuidado com a saúde mental.'
    };

    textoDiv.innerText = previsoes[signo] || 'Selecione um signo para ver a previsão.';
}
