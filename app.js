// CONFIGURAÇÃO DA API DO CLIMA
const API_KEY = '5aa79728';
const BASE_URL = 'https://api.hgbrasil.com/weather';

// Lista de emojis para cada tipo de clima
const ICONS = {
  storm: '⛈',
  snow: '🌨',
  hail: '🌧',
  rain: '🌧',
  fog: '🌫',
  clear_day: '☀️',
  clear_night: '🌙',
  cloud: '☁️',
  cloudly_day: '🌤',
  cloudly_night: '🌤',
  night_rain: '🌧',
  default: '🌡️'
};

// Dados da cidade pesquisada no momento
let currentCityData = null;


function getIcon(condition) {
  if (!condition) {
    return ICONS.default;
  }
  // Roda um loop para ver qual clima bate
  for (let key in ICONS) {
    if (condition.includes(key)) {
      return ICONS[key];
    }
  }
  return ICONS.default;
}

function setStatus(msg, isError = false) {
  const el = document.getElementById('status');
  if (el) {
    el.textContent = msg;
    if (isError) {
      el.className = 'error'; // Caso seja erro, fica vermelho
    } else {
      el.className = '';
    }
  }
}

function showCard() {
  const card = document.getElementById('weatherCard');
  if (card) {
    card.classList.add('visible');
  }
}

function updateElementText(elementId, content, suffix = '') {
  const el = document.getElementById(elementId);
  if (el) {
    el.textContent = content ? `${content}${suffix}` : '—';
  }
}


//  localStorage

// -- Favoritos --
function getFavorites() { // Chamada em isFavorite
  return JSON.parse(localStorage.getItem('clima_favorites') || '[]');
}

function saveFavorites(favorites) {
  localStorage.setItem('clima_favorites', JSON.stringify(favorites));
}

// Adiciona uma busca nova no histórico
function addHistory(city, temp, description, condition) {
  let history = getHistory();

  // Evitar duplicados na lista (remove anterior para colocar no topo)
  history = history.filter(item => (
    item.city.toLowerCase() !== city.toLowerCase()
  ));

  const now = new Date();
  const date = now.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  const time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  history = [
    {
      city,
      temp,
      description,
      condition,
      timestamp: `${date} às ${time}`
    },
    ...history
  ];


  // Limitar o histórico para as 5 últimas consultas
  if (history.length > 5) {
    history.pop();
  }

  saveHistory(history);
}

// Vê se a cidade já está favoritada ou não
function isFavorite(city) {
  const favorites = getFavorites();
  for (let i = 0; i < favorites.length; i++) {
    if (favorites[i].city.toLowerCase() === city.toLowerCase()) {
      return true;
    }
  }
  return false;
}

// Adiciona ou remove a cidade dos favoritos
function toggleFavorite() {
  if (!currentCityData) {
    return;
  }

  const favorites = getFavorites();
  let index = -1;
  // Acha o índice da cidade nos favoritos
  for (let i = 0; i < favorites.length; i++) {
    if (favorites[i].city.toLowerCase() === currentCityData.city.toLowerCase()) {
      index = i;
      break;
    }
  }

  // Se já estiver nos favoritos (index > -1), remove da lista. 
  if (index > -1) {
    favorites.splice(index, 1);
    setStatus('Removida dos favoritos!');
  } else { // Caso contrário, adiciona.
    favorites.push(currentCityData);
    setStatus('Adicionada aos favoritos!');
  }

  saveFavorites(favorites);
  updateFavoriteButton(currentCityData.city);
}

// Atualiza o botão da estrela dependendo se é favorita
function updateFavoriteButton(city) {
  const button = document.getElementById('favoriteBtn');

  const starSpan = button.querySelector('.star-icon');
  const favorito = isFavorite(city);

  if (favorito) {
    button.classList.add('favorited');
    starSpan.textContent = '★';
    button.title = 'Remover dos favoritos';
  } else {
    button.classList.remove('favorited');
    starSpan.textContent = '☆';

    button.title = 'Adicionar aos favoritos';
  }
}

// Pega o histórico do localStorage
function getHistory() {
  return JSON.parse(localStorage.getItem('clima_history') || '[]');
}

// Salva o histórico no localStorage
function saveHistory(history) {
  localStorage.setItem('clima_history', JSON.stringify(history));
}



// Preenche os dados no card principal do clima
function populateCard(data) {
  const { results } = data;

  updateElementText('cityName', results.city);

  const cityStateContent = results.city_name
    ? `${results.city_name}${results.country_code ? ' · ' + results.country_code : ''}`
    : '';

  updateElementText('cityState', cityStateContent);
  updateElementText('weatherIcon', getIcon(results.condition_slug));
  updateElementText('tempMain', results.temp);
  updateElementText('description', results.description);
  updateElementText('feelsLike', results.feels_like, ' °C');
  updateElementText('humidity', results.humidity, ' %');
  updateElementText('wind', results.wind_speedy);
  updateElementText('rain', results.rain, ' mm');
  updateElementText('tempMin', results.forecast?.[0].min);
  updateElementText('tempMax', results.forecast?.[0].max);

  const updatedAtContent = `Atualizado: ${results.date || ''} ${results.time || ''}`.trim();
  updateElementText('updatedAt', updatedAtContent);

  console.log(results)

  renderForecast(results.forecast || []);
}

// Mostra a previsão dos próximos 5 dias
function renderForecast(forecast) {
  const list = document.getElementById('forecastList');

  list.innerHTML = '';

  const days = forecast.slice(1, 6); // Próximos 5 dias, mas a api é gratuita então só mostra o de amanhã

  days.forEach(day => {
    const item = document.createElement('div');
    item.className = 'forecast-item';
    item.innerHTML = `
      <div class="f-day">${day.weekday || day.date}</div>
      <div class="f-icon">${getIcon(day.condition)}</div>
      <div class="f-max">${day.max}°</div>
      <div class="f-min">${day.min}°</div>
    `;
    list.appendChild(item);
  });
}

// Mostra as cidades favoritas na página de favoritos
function renderFavorites() {
  const grid = document.getElementById('favoritesGrid');

  const favorites = getFavorites();
  if (favorites.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⭐</div>
        <p>Você ainda não possui cidades favoritadas.</p>
        <a href="index.html" class="btn-primary">Buscar Cidades</a>
      </div>
    `;

    return;
  }

  grid.style.display = '';
  grid.innerHTML = '';

  favorites.forEach(fav => {
    const card = document.createElement('article');
    card.className = 'fav-card';

    const emoji = getIcon(fav.condition);

    card.innerHTML = `
      <div class="fav-header">
        <div>
          <h2 class="fav-city">${fav.city}</h2>
          <div style="font-size: 0.85rem; color: var(--suave); text-transform: capitalize;">${fav.description || ''}</div>
        </div>
        <div style="font-size: 2.2rem;">${emoji}</div>
      </div>
      <div class="fav-temp-row">
        <span class="fav-temp">${fav.temp != null ? fav.temp : '—'}</span>
        <span style="font-size: 1.1rem; color: var(--suave); font-weight: 600; padding-bottom: 0.3rem;">°C</span>
      </div>
      <div class="fav-actions">
        <a href="index.html?city=${fav.city}" class="btn-primary">Ver Clima</a>
        <button class="btn-danger-outline" onclick="removeFavorite('${fav.city}')">Remover</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Mostra o histórico na página de histórico
function renderHistory() {
  const list = document.getElementById('historyList');
  const actionsContainer = document.getElementById('historyActionsContainer');

  const history = getHistory();
  if (history.length === 0) {
    if (actionsContainer) {
      actionsContainer.style.display = 'none';
    }
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📜</div>
        <p>Nenhuma busca recente encontrada.</p>
        <a href="index.html" class="btn-primary">Consultar Clima</a>
      </div>
    `;
    return;
  }

  if (actionsContainer) {
    actionsContainer.style.display = '';
  }
  list.innerHTML = '';

  history.forEach((item, index) => {
    const card = document.createElement('article');
    card.className = 'history-item';

    const emoji = getIcon(item.condition);

    card.innerHTML = `
      <div class="history-info">
        <h2 class="history-city" style="font-size: 1.1rem;">${item.city}</h2>
        <div class="history-meta">${item.timestamp} · <span style="text-transform: capitalize;">${item.description || ''}</span></div>
      </div>
      <div class="history-right">
        <div class="history-temp">${item.temp != null ? item.temp + '°' : '—'}</div>
        <div style="font-size: 1.4rem;">${emoji}</div>
        <a href="index.html?city=${item.city}" class="btn-icon search-again" title="Pesquisar novamente" aria-label="Pesquisar novamente">
          🔍
        </a>
        <button class="btn-icon" onclick="removeHistory(${index})" title="Remover do histórico" aria-label="Remover item do histórico">
          🗑️
        </button>
      </div>
    `;
    list.appendChild(card);
  });
}

// Remove uma cidade favorita quando clica em Remover
window.removeFavorite = function (city) {
  let favorites = getFavorites();
  favorites = favorites.filter(fav => fav.city.toLowerCase() !== city.toLowerCase());
  saveFavorites(favorites);
  renderFavorites(); // Recarrega a tela de favoritos com a lista atualizada
};

// Remove um item do histórico
window.removeHistory = function (index) {
  let history = getHistory();
  history.splice(index, 1);
  saveHistory(history);
  renderHistory(); // Recarrega a lista do histórico com os dados atualizados
};

// Limpa todo o históricp
window.clearHistory = function () {
  const userConfirm = confirm('Deseja realmente limpar todo o histórico de consultas?');
  if (userConfirm) {
    saveHistory([]);
    renderHistory();
  }
};


//  Chamada à API
async function buscarClima(e) {
  if (e) {
    e.preventDefault();
  }

  const cityInput = document.getElementById('cityInput');
  const city = cityInput ? cityInput.value.trim() : '';

  if (!city) {
    setStatus('Digite o nome de uma cidade.', true);
    return;
  }

  setStatus('Buscando dados…');

  const url = `${BASE_URL}?key=${API_KEY}&city_name=${city}&format=json-cors`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Falha na requisição: ${res.status}`);
    }
    const data = await res.json();

    if (!data || !data.results) {
      throw new Error('Dados climáticos não encontrados.');
    }
    console.log(data)
    const { results } = data;

    populateCard(data);
    showCard();
    setStatus('');

    currentCityData = {
      city: results.city || city,
      temp: results.temp,
      description: results.description,
      condition: results.condition_slug
    };

    updateFavoriteButton(currentCityData.city);
    addHistory(currentCityData.city, currentCityData.temp, currentCityData.description, currentCityData.condition);

  } catch (err) {
    setStatus(`Erro: ${err.message}`, true);
    console.error('Erro de busca:', err);
  }
}


//  INICIALIZAÇÃO E EVENTOS

document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('searchForm');
  const favoritesGrid = document.getElementById('favoritesGrid');
  const historyList = document.getElementById('historyList');

  // Página Inicial
  if (searchForm) {
    searchForm.addEventListener('submit', buscarClima);

    const favBtn = document.getElementById('favoriteBtn');
    if (favBtn) {
      favBtn.addEventListener('click', toggleFavorite);
    }

    // Busca automática se tiver uma cidade na URL (ex: ?city=São Paulo)
    const params = new URLSearchParams(window.location.search);
    const cityParam = params.get('city');
    const cityInput = document.getElementById('cityInput');


    if (cityParam && cityInput) {
      cityInput.value = cityParam;
      buscarClima(); // Busca o clima apenas se tiver a cidade
    }
  }

  // Página de Favoritos
  if (favoritesGrid) {
    renderFavorites();
  }

  // Página de Histórico
  if (historyList) {
    renderHistory();
  }
});