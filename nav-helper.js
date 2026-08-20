(function () {
  'use strict';

  const NAV_ITEMS = [
    ['index.html', 'Home'],
    ['all-plants.html', 'Plants'],
    ['journal.html', 'Photo Journal'],
    ['projects.html', 'Projects'],
    ['garden-friends.html', 'Garden Friends'],
    ['harvest-log.html', 'Harvest Log'],
    ['calendar.html', 'Calendar']
  ];

  function isHomePage() {
    const path = window.location.pathname.replace(/\/+$/, '');
    return path === '' || path.endsWith('/index.html') || path.endsWith('/Lou-s-plant-handbook');
  }

  function currentFile() {
    const file = window.location.pathname.split('/').pop();
    return file || 'index.html';
  }

  function currentSectionHref() {
    const file = currentFile();
    if (file === 'index.html') return 'index.html';
    if (file === 'all-plants.html' || file === 'indoor-plants.html' || file === 'garden-vegetables.html' || file === 'fruit-berries.html' || file === 'flowers-outdoor.html' || file === 'trees-shrubs.html' || file.includes('plant') || file.includes('care')) return 'all-plants.html';
    if (file === 'journal.html' || file.includes('journal') || file.includes('update') || file.includes('late-july') || file.includes('august-')) return 'journal.html';
    if (file === 'garden-friends.html' || file.includes('pollinator') || file.includes('friend') || file.includes('bird')) return 'garden-friends.html';
    if (file === 'harvest-log.html') return 'harvest-log.html';
    if (file === 'calendar.html') return 'calendar.html';
    if (file === 'projects.html' || file.includes('project') || file.includes('burns-bear') || file.includes('grape-arbor') || file.includes('poulin')) return 'projects.html';
    return '';
  }

  function installUnifiedHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const activeHref = currentSectionHref();
    const links = NAV_ITEMS.map(([href, label]) => {
      const active = href === activeHref ? ' class="active" aria-current="page"' : '';
      return `<a href="${href}"${active}>${label}</a>`;
    }).join('');

    header.innerHTML = `
      <div class="topbar lou-unified-topbar">
        <a class="brand" href="index.html" aria-label="Lou's Garden Guide home">
          <img src="icon-512.png?v=31" alt="Lou's Garden Guide">
          <div><strong>Lou’s Garden Guide</strong><span class="lou-brand-tagline">Grow beautiful. Live well.</span></div>
        </a>
        <div class="top-search lou-global-search"><input id="topSearch" type="search" placeholder="Search plants, pests, notes…" aria-label="Search Lou's Garden Guide" autocomplete="off"></div>
      </div>
      <nav aria-label="Main navigation"><div class="nav lou-main-nav">${links}</div></nav>`;

    if (!document.getElementById('louUnifiedNavStyles')) {
      const style = document.createElement('style');
      style.id = 'louUnifiedNavStyles';
      style.textContent = `
        .site-header{background:#fffdf8!important;border-bottom:1px solid #d9ded1!important;position:sticky;top:0;z-index:1000}
        .lou-unified-topbar{max-width:1180px;margin:auto;display:flex;align-items:center;justify-content:space-between;gap:18px;padding:14px 18px!important}
        .lou-unified-topbar .brand{display:flex;align-items:center;gap:13px;text-decoration:none;min-width:0}
        .lou-unified-topbar .brand img{width:70px!important;height:70px!important;border-radius:15px;object-fit:cover;flex:none}
        .lou-unified-topbar .brand strong{display:block;color:#315d3f;font:700 clamp(1.4rem,3vw,2.05rem) Georgia,serif;white-space:nowrap}
        .lou-brand-tagline{display:block;font-size:.78rem;letter-spacing:.12em;color:#68806a;text-transform:uppercase;margin-top:2px;white-space:nowrap}
        .lou-global-search{min-width:250px;max-width:350px;flex:1;position:relative}
        .lou-global-search input{width:100%;padding:12px 15px;border:1px solid #b9c4b7;border-radius:999px;background:#fffefa;font-size:16px}
        .site-header nav{background:#fffdf8;border-top:1px solid #eff1eb;overflow:hidden}
        .site-header .lou-main-nav{max-width:1180px;margin:auto;display:flex;gap:22px;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding:11px 18px 12px!important}
        .site-header .lou-main-nav::-webkit-scrollbar{display:none}
        .site-header .lou-main-nav a{flex:0 0 auto;text-decoration:none;color:#315d3f;font-weight:750;white-space:nowrap;padding-bottom:3px;border-bottom:3px solid transparent}
        .site-header .lou-main-nav a.active{color:#244832;border-bottom-color:#315d3f}
        .lou-search-popover{display:none;position:absolute;left:0;right:0;top:calc(100% + 7px);z-index:100000;background:#fffdf8;border:1px solid #cbd5c9;border-radius:15px;box-shadow:0 12px 30px rgba(0,0,0,.18);padding:7px;max-height:min(52vh,420px);overflow-y:auto}
        .lou-search-popover.open{display:block}
        .lou-search-popover a{display:block;padding:12px 13px;border-radius:10px;text-decoration:none;color:#244832;font-weight:750;border-bottom:1px solid #edf0e9}
        .lou-search-popover a:last-child{border-bottom:0}
        .lou-search-popover a:active,.lou-search-popover a:focus{background:#e8f0e5;outline:none}
        .lou-search-empty{padding:12px 13px;color:#6b746e}
        @media(max-width:950px){
          .lou-unified-topbar{align-items:flex-start;flex-direction:column;gap:12px}
          .lou-global-search{width:100%;max-width:none;min-width:0}
          .lou-search-popover{position:fixed;left:18px;right:18px;top:164px;max-height:48vh}
        }
        @media(max-width:520px){
          .lou-unified-topbar .brand img{width:58px!important;height:58px!important}
          .lou-unified-topbar .brand strong{font-size:clamp(1.35rem,6vw,1.8rem)}
          .lou-brand-tagline{font-size:.68rem;letter-spacing:.09em}
          .site-header .lou-main-nav{gap:20px;padding-left:16px!important;padding-right:16px!important}
        }
      `;
      document.head.appendChild(style);
    }
  }

  function getHomeSearchLinks() {
    return [...document.querySelectorAll('.search-results a')];
  }

  function setupSearch() {
    const input = document.getElementById('topSearch');
    if (!input || document.getElementById('louSearchPopover')) return;

    const popover = document.createElement('div');
    popover.id = 'louSearchPopover';
    popover.className = 'lou-search-popover';
    popover.setAttribute('role', 'listbox');
    popover.setAttribute('aria-label', 'Search results');
    input.parentElement.appendChild(popover);

    function matchesFor(value) {
      const q = value.trim().toLowerCase();
      if (!q) return [];
      return getHomeSearchLinks().filter(link => {
        const terms = (link.dataset.search || '').toLowerCase();
        const label = (link.textContent || '').toLowerCase();
        return terms.includes(q) || label.includes(q);
      });
    }

    function render(value) {
      const q = value.trim();
      if (!q) {
        popover.classList.remove('open');
        popover.innerHTML = '';
        return [];
      }

      if (!isHomePage()) {
        popover.innerHTML = `<a role="option" href="index.html?search=${encodeURIComponent(q)}">Search the full Garden Guide for “${q.replace(/[<>&"]/g, '')}”</a>`;
        popover.classList.add('open');
        return [];
      }

      const matches = matchesFor(q);
      popover.innerHTML = matches.length
        ? matches.map(link => `<a role="option" href="${link.getAttribute('href')}">${link.textContent}</a>`).join('')
        : '<div class="lou-search-empty">No matching plant or topic found.</div>';
      popover.classList.add('open');
      return matches;
    }

    input.addEventListener('input', e => render(e.target.value));
    input.addEventListener('focus', e => { if (e.target.value.trim()) render(e.target.value); });
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const q = input.value.trim();
        if (!q) return;
        if (!isHomePage()) {
          window.location.href = `index.html?search=${encodeURIComponent(q)}`;
          return;
        }
        const matches = matchesFor(q);
        if (matches.length) window.location.href = matches[0].getAttribute('href');
      } else if (e.key === 'Escape') {
        popover.classList.remove('open');
      }
    });

    document.addEventListener('click', e => {
      if (!input.parentElement.contains(e.target)) popover.classList.remove('open');
    });

    if (isHomePage()) {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('search');
      if (q) {
        input.value = q;
        setTimeout(() => render(q), 0);
      }
    }
  }

  function weatherCodeToText(code) {
    const map = {
      0:'Clear',1:'Mostly clear',2:'Partly cloudy',3:'Cloudy',45:'Fog',48:'Rime fog',
      51:'Light drizzle',53:'Drizzle',55:'Heavy drizzle',56:'Freezing drizzle',57:'Freezing drizzle',
      61:'Light rain',63:'Rain',65:'Heavy rain',66:'Freezing rain',67:'Freezing rain',
      71:'Light snow',73:'Snow',75:'Heavy snow',77:'Snow grains',80:'Rain showers',81:'Rain showers',
      82:'Heavy showers',85:'Snow showers',86:'Snow showers',95:'Thunderstorms',96:'Thunderstorms',99:'Thunderstorms'
    };
    return map[code] || 'Forecast';
  }

  function shortDay(dateString, index) {
    if (index === 0) return 'Today';
    return new Date(dateString + 'T12:00:00').toLocaleDateString('en-US',{weekday:'short'});
  }

  async function loadThreeDayForecast() {
    const target = document.getElementById('threeDayForecast');
    if (!target) return;
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=44.3487&longitude=-70.0662&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,sunrise,sunset&temperature_unit=fahrenheit&precipitation_unit=inch&timezone=America%2FNew_York&forecast_days=3';
    try {
      const response = await fetch(url,{cache:'no-store'});
      if (!response.ok) throw new Error('Weather request failed');
      const data = await response.json();
      const d = data.daily;
      target.innerHTML = d.time.slice(0,3).map((date,i) => {
        const high = Math.round(d.temperature_2m_max[i]);
        const low = Math.round(d.temperature_2m_min[i]);
        const chance = Math.round(d.precipitation_probability_max[i] || 0);
        const amount = Number(d.precipitation_sum[i] || 0);
        return `<div class="forecast-day"><strong>${shortDay(date,i)}</strong><div class="forecast-condition">${weatherCodeToText(d.weather_code[i])}</div><div class="forecast-temp">${high}° / ${low}°</div><div class="forecast-rain">Rain ${chance}% · ${amount < .005 ? '0.00' : amount.toFixed(2)} in</div></div>`;
      }).join('');
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
    todayItems.forEach((item,i) => { if (todayText[i]) item.innerHTML = todayText[i]; });

    const banner = document.querySelector('.update-banner');
    if (banner) {
      banner.setAttribute('aria-label','Latest garden update dated August 18, 2026');
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
      statuses.forEach((item,i) => { if (statusText[i]) item.innerHTML = statusText[i]; });
    }

    const upcomingItems = document.querySelectorAll('.upcoming ul li');
    const upcomingText = [
      'Continue blueberry-cutting hardening-off gradually.',
      'Harvest tomatoes and peppers as they mature.',
      'Inspect squash, pumpkin, and cucumber leaves for beetles, eggs, and vine damage.',
      'Photograph the 12-foot sunflower and late-summer harvests for the journal.'
    ];
    upcomingItems.forEach((item,i) => { if (upcomingText[i]) item.textContent = upcomingText[i]; });

    const footer = document.querySelector('footer');
    if (footer) footer.textContent = 'Lou’s Garden Guide · Updated August 18, 2026';

    if (!document.getElementById('louHomeEnhancements')) {
      const style = document.createElement('style');
      style.id = 'louHomeEnhancements';
      style.textContent = `
        .hero:before{background:linear-gradient(90deg,rgba(22,48,31,.08) 0%,rgba(22,48,31,.04) 38%,rgba(22,48,31,.015) 68%,rgba(22,48,31,0) 100%)!important}
        .hero-panel h1{text-shadow:0 3px 18px rgba(0,0,0,.72)!important}
        .hero-panel p,.hero-panel .quote,.hero-panel .eyebrow{text-shadow:0 2px 9px rgba(0,0,0,.72)!important}
        .three-day-forecast{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:12px}
        .forecast-day{background:rgba(255,253,248,.78);border:1px solid #e4dab8;border-radius:12px;padding:10px 8px;text-align:center}
        .forecast-day strong{display:block;font:700 .95rem -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#315d3f;margin-bottom:3px}
        .forecast-day .forecast-condition{font-size:.78rem;min-height:2.1em;color:#4f5d53}
        .forecast-day .forecast-temp{font-weight:800;margin-top:5px}
        .forecast-day .forecast-rain{font-size:.78rem;color:#59695d;margin-top:4px}
        .forecast-heading{margin-top:14px;font-weight:800;color:#315d3f;font-size:.9rem}
        @media(max-width:520px){.three-day-forecast{grid-template-columns:1fr}.forecast-day .forecast-condition{min-height:0}}
      `;
      document.head.appendChild(style);
    }

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
        weatherCard.insertBefore(heading,source);
        weatherCard.insertBefore(forecast,source);
      } else {
        weatherCard.append(heading,forecast);
      }
      loadThreeDayForecast();
    }
  }

  function addQuickNavigation() {
    if (isHomePage() || document.getElementById('louQuickNavigation')) return;
    const style = document.createElement('style');
    style.textContent = `
      .lou-quick-nav{position:fixed;left:max(12px,env(safe-area-inset-left));bottom:max(12px,env(safe-area-inset-bottom));z-index:99999;display:flex;gap:10px;align-items:center;padding:8px;border-radius:18px;background:rgba(255,255,255,.96);box-shadow:0 5px 22px rgba(0,0,0,.28);border:1px solid rgba(31,79,45,.22);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
      .lou-quick-nav button,.lou-quick-nav a{min-width:52px;min-height:48px;box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:10px 14px;border:0;border-radius:13px;background:#245c36;color:#fff!important;font:700 16px/1.1 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;text-decoration:none!important;cursor:pointer;-webkit-tap-highlight-color:transparent}
      .lou-quick-nav button:active,.lou-quick-nav a:active{transform:scale(.96)}
      .lou-quick-nav .lou-nav-icon{font-size:23px;line-height:1}
      @media(max-width:520px){.lou-quick-nav{right:max(12px,env(safe-area-inset-right));justify-content:center}.lou-quick-nav button,.lou-quick-nav a{flex:1;padding:10px 12px}}
      @media print{.lou-quick-nav{display:none!important}}
    `;
    document.head.appendChild(style);

    const nav = document.createElement('nav');
    nav.id = 'louQuickNavigation';
    nav.className = 'lou-quick-nav';
    nav.setAttribute('aria-label','Quick page navigation');
    const back = document.createElement('button');
    back.type = 'button';
    back.setAttribute('aria-label','Go back to the previous screen');
    back.innerHTML = '<span class="lou-nav-icon" aria-hidden="true">←</span><span>Back</span>';
    back.addEventListener('click',function(){
      if (window.history.length > 1) window.history.back();
      else window.location.href = 'index.html';
    });
    const home = document.createElement('a');
    home.href = 'index.html';
    home.setAttribute('aria-label',"Go to Lou's Garden Guide home page");
    home.innerHTML = '<span class="lou-nav-icon" aria-hidden="true">⌂</span><span>Home</span>';
    nav.append(back,home);
    document.body.appendChild(nav);
  }

  function initialize() {
    installUnifiedHeader();
    updateHomePage();
    setupSearch();
    addQuickNavigation();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',initialize,{once:true});
  else initialize();
})();