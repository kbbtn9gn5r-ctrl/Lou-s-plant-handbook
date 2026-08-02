(function () {
  'use strict';

  function addNavigation() {
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
