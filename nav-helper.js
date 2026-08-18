(function () {
  'use strict';

  function isHomePage() {
    const path = window.location.pathname.replace(/\/+$/, '');
    return path === '' || path.endsWith('/index.html') || path.endsWith('/Lou-s-plant-handbook');
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
  }

  function addNavigation() {
    updateHomePage();

    // The Home screen already has full site navigation, so do not show
    // the floating Back and Home controls there.
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
