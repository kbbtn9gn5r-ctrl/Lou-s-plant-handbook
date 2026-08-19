(function () {
  'use strict';

  function isHomePage() {
    const path = window.location.pathname.replace(/\/+$/, '');
    return path === '' || path.endsWith('/index.html') || path.endsWith('/Lou-s-plant-handbook');
  }

  function weatherCodeToText(code) {
    const map = {
      0: 'Clear', 1: 'Mostly clear', 2: 'Partly cloudy', 3: 'Cloudy',
      45: 'Fog', 48: 'Rime fog', 51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle',
      56: 'Freezing drizzle', 57: 'Freezing drizzle', 61: 'Light rain', 63: 'Rain', 65: 'Heavy rain',
      66: 'Freezing rain', 67: 'Freezing rain', 71: 'Light snow', 73: 'Snow', 75: 'Heavy snow',
      77: 'Snow grains', 80: 'Rain showers', 81: 'Rain showers', 82: 'Heavy showers',
      85: 'Snow showers', 86: 'Snow showers', 95: 'Thunderstorms', 96: 'Thunderstorms', 99: 'Thunderstorms'
    };
    return map[code] || 'Forecast';
  }

  function shortDay(dateString, index) {
    if (index === 0) return 'Today';
    const d = new Date(dateString + 'T12:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short' });
  }

  function addHomeEnhancements() {
    if (!isHomePage()) return;

    const style = document.createElement('style');
    style.id = 'louHomeEnhancements';
    style.textContent = `
      .hero:before {
        background: linear-gradient(90deg, rgba(22,48,31,.08) 0%, rgba(22,48,31,.04) 38%, rgba(22,48,31,.015) 68%, rgba(22,48,31,0) 100%) !important;
      }
      .hero-panel h1 { text-shadow: 0 3px 18px rgba(0,0,0,.72) !important; }
      .hero-panel p, .hero-panel .quote, .hero-panel .eyebrow { text-shadow: 0 2px 9px rgba(0,0,0,.72) !important; }
      .three-day-forecast {
        display: grid;
        grid-template-columns: repeat(3, minmax(0,1fr));
        gap: 8px;
        margin-top: 12px;
      }
      .forecast-day {
        background: rgba(255,253,248,.78);
        border: 1px solid #E4DAB8;
        border-radius: 12px;
        padding: 10px 8px;
        text-align: center;
      }
      .forecast-day strong {
        display: block;
        font: 700 .95rem -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
        color: #315D3F;
        margin-bottom: 3px;
      }
      .forecast-day .forecast-condition { font-size: .78rem; min-height: 2.1em; color: #4f5d53; }
      .forecast-day .forecast-temp { font-weight: 800; margin-top: 5px; }
      .forecast-day .forecast-rain { font-size: .78rem; color: #59695d; margin-top: 4px; }
      .forecast-heading {
        margin-top: 14px;
        font-weight: 800;
        color: #315D3F;
        font-size: .9rem;
      }
      @media(max-width:520px){
        .three-day-forecast { grid-template-columns: 1fr; }
        .forecast-day .forecast-condition { min-height: 0; }
      }
    `;
    document.head.appendChild(style);

    const weatherCard = document.getElementById('wayneWeather');
    if (weatherCard && !document.getElementById('threeDayForecast')) {
      const heading = document.createElement('div');
      heading.className = 'forecast-heading';
      heading.textContent = '3-Day Forecast · Rain Amounts';

      const forecast = document.createElement('div');
      forecast.id = 'threeDayForecast';
      forecast.className = 'three-day-forecast';
      forecast.innerHTML = '<div class="forecast-day">Loading forecast…</div>';

      const source = weatherCard.querySelector('small');
      if (source) {
        weatherCard.insertBefore(heading, source);
        weatherCard.insertBefore(forecast, source);
      } else {
        weatherCard.append(heading, forecast);
      }

      loadThreeDayForecast();
    }
  }

  async function loadThreeDayForecast() {
    const target = document.getElementById('threeDayForecast');
    if (!target) return;

    const url = 'https://api.open-meteo.com/v1/forecast?latitude=44.3487&longitude=-70.0662&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,sunrise,sunset&temperature_unit=fahrenheit&precipitation_unit=inch&timezone=America%2FNew_York&forecast_days=3';

    try {
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) throw new Error('Weather request failed');
      const data = await response.json();
      const d = data.daily;
      if (!d || !d.time || !d.time.length) throw new Error('Forecast unavailable');

      const cards = d.time.slice(0, 3).map((date, i) => {
        const high = Math.round(d.temperature_2m_max[i]);
        const low = Math.round(d.temperature_2m_min[i]);
        const chance = Math.round(d.precipitation_probability_max[i] || 0);
        const amount = Number(d.precipitation_sum[i] || 0);
        const amountText = amount < 0.005 ? '0.00' : amount.toFixed(2);
        return `
          <div class="forecast-day">
            <strong>${shortDay(date, i)}</strong>
            <div class="forecast-condition">${weatherCodeToText(d.weather_code[i])}</div>
            <div class="forecast-temp">${high}° / ${low}°</div>
            <div class="forecast-rain">Rain ${chance}% · ${amountText} in</div>
          </div>`;
      }).join('');
      target.innerHTML = cards;
    } catch (err) {
      target.innerHTML = '<div class="forecast-day">3-day forecast temporarily unavailable.</div>';
    }
  }

  function updateHomePage() {
    if (!isHomePage()) return;

    const todayItems = document.querySelectorAll('.today-strip .task-list li');
    const todayText = [
      '<strong>Sunflower:</strong> approximately 12 feet tall; continue documenting it while it remains at peak height.',
      '<strong>Blueberry cuttings:</strong> continue gradual hardening-off and watch closely for wilting.',
      'Harvest ripe tomatoes and King of the North peppers regularly.',
      'Inspect pumpkin, squash, and cucumber foliage for beetles, eggs, and new feeding damage.'
    ];
    todayItems.forEach((item, i) => { if (todayText[i]) item.innerHTML = todayText[i]; });

    const banner = document.querySelector('.update-banner');
    if (banner) {
      banner.setAttribute('aria-label', 'Latest garden update dated August 18, 2026');
      const heading = banner.querySelector('h2');
      const summary = banner.querySelector('p');
      if (heading) heading.textContent = 'Latest Garden Update · August 18, 2026';
      if (summary) summary.textContent = 'Today’s garden photos document blueberry propagation hardening-off, dahlias, tomatoes, peppers, pumpkin, carrots, marigolds, and an approximately 12-foot sunflower.';

      const statuses = banner.querySelectorAll('.status-item');
      const statusText = [
        '<strong>🌻 Sunflower</strong>Approximately 12 feet tall and still a major August garden feature.<br><span>Peak height</span>',
        '<strong>🫐 Blueberry Cuttings</strong>Continue gradual hardening-off and increase uncovered time only when the cuttings stay firm.<br><span>Hardening off</span>',
        '<strong>🌺 Dahlias</strong>Flowering now; keep deadheading and watch moisture during dry weather.<br><span>Blooming</span>',
        '<strong>🍅 Tomatoes</strong>Heavy crop developing; harvest ripe fruit regularly and maintain even watering.<br><span>Fruiting</span>',
        '<strong>🫑 King of the North</strong>Peppers are setting and sizing up; harvest mature fruit to keep production moving.<br><span>Fruiting</span>',
        '<strong>🎃 Pumpkins &amp; Squash</strong>Continue inspecting leaves for beetles, eggs, and feeding damage; water at soil level.<br><span>Pest watch</span>'
      ];
      statuses.forEach((item, i) => { if (statusText[i]) item.innerHTML = statusText[i]; });
    }

    const upcomingItems = document.querySelectorAll('.upcoming ul li');
    const upcomingText = [
      'Continue blueberry-cutting hardening-off gradually.',
      'Harvest tomatoes and peppers as they mature.',
      'Inspect squash, pumpkin, and cucumber leaves for beetles, eggs, and vine damage.',
      'Photograph the 12-foot sunflower and late-summer harvests for the journal.'
    ];
    upcomingItems.forEach((item, i) => { if (upcomingText[i]) item.textContent = upcomingText[i]; });

    const footer = document.querySelector('footer');
    if (footer) footer.textContent = 'Lou’s Garden Guide · Updated August 18, 2026';

    addHomeEnhancements();
  }

  function addNavigation() {
    updateHomePage();

    if (isHomePage()) return;
    if (document.getElementById('louQuickNavigation')) return;

    const style = document.createElement('style');
    style.textContent = `
      .lou-quick-nav {
        position: fixed;
        left: max(12px, env(safe-area-inset-left));
        bottom: max(12px, env(safe-area-inset-bottom));
        z-index: 99999;
        display: flex;
        gap: 10px;
        align-items: center;
        padding: 8px;
        border-radius: 18px;
        background: rgba(255,255,255,.96);
        box-shadow: 0 5px 22px rgba(0,0,0,.28);
        border: 1px solid rgba(31,79,45,.22);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
      }
      .lou-quick-nav button,
      .lou-quick-nav a {
        min-width: 52px;
        min-height: 48px;
        box-sizing: border-box;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 10px 14px;
        border: 0;
        border-radius: 13px;
        background: #245c36;
        color: #fff !important;
        font: 700 16px/1.1 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        text-decoration: none !important;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
      }
      .lou-quick-nav button:active,
      .lou-quick-nav a:active { transform: scale(.96); }
      .lou-quick-nav .lou-nav-icon { font-size: 23px; line-height: 1; }
      @media (max-width: 520px) {
        .lou-quick-nav { right: max(12px, env(safe-area-inset-right)); justify-content: center; }
        .lou-quick-nav button, .lou-quick-nav a { flex: 1; padding: 10px 12px; }
      }
      @media print { .lou-quick-nav { display: none !important; } }
    `;
    document.head.appendChild(style);

    const nav = document.createElement('nav');
    nav.id = 'louQuickNavigation';
    nav.className = 'lou-quick-nav';
    nav.setAttribute('aria-label', 'Quick page navigation');

    const back = document.createElement('button');
    back.type = 'button';
    back.setAttribute('aria-label', 'Go back to the previous screen');
    back.innerHTML = '<span class="lou-nav-icon" aria-hidden="true">←</span><span>Back</span>';
    back.addEventListener('click', function () {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = 'index.html';
      }
    });

    const home = document.createElement('a');
    home.href = 'index.html';
    home.setAttribute('aria-label', "Go to Lou's Garden Guide home page");
    home.innerHTML = '<span class="lou-nav-icon" aria-hidden="true">⌂</span><span>Home</span>';

    nav.append(back, home);
    document.body.appendChild(nav);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addNavigation, { once: true });
  } else {
    addNavigation();
  }
})();
