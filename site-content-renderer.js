(() => {
  const esc = (value = '') => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const safeUrl = (value = '') => encodeURI(String(value).replace(/["'<>]/g, ''));

  async function loadData() {
    const response = await fetch('site-content.json?v=2.1', { cache: 'no-store' });
    if (!response.ok) throw new Error('The website content file could not load.');
    return response.json();
  }

  function renderProjects(data) {
    const mount = document.getElementById('projectCards');
    if (!mount) return;
    mount.innerHTML = data.projectCards.map(card => {
      const eyebrow = card.eyebrow ? `<p class="project-eyebrow ${card.tone === 'gold' ? 'gold' : ''}">${esc(card.eyebrow)}</p>` : '';
      return `<article class="project-card"><img loading="lazy" alt="${esc(card.alt)}" src="${safeUrl(card.image)}"><div>${eyebrow}<h2>${esc(card.title)}</h2><p>${esc(card.description)}</p><a class="button" href="${safeUrl(card.href)}">${esc(card.button || 'Open Project')}</a></div></article>`;
    }).join('');
  }

  function renderJournal(data) {
    const mount = document.getElementById('journalGrid');
    if (!mount) return;
    mount.innerHTML = data.journalEntries.map(entry => {
      const search = [entry.title, entry.date, entry.summary, entry.category, entry.keywords || ''].join(' ');
      const action = entry.href ? `<a class="button" href="${safeUrl(entry.href)}">${esc(entry.button || 'Open entry')}</a>` : '';
      return `<article class="entry" data-search="${esc(search)}"><img alt="${esc(entry.alt || entry.title)}" loading="lazy" src="${safeUrl(entry.image)}"><div class="body"><div class="date">${esc(entry.date)}</div><h3>${esc(entry.title)}</h3><p>${esc(entry.summary)}</p><div class="chips"><span class="chip">${esc(entry.category)}</span></div>${action}</div></article>`;
    }).join('');

    const search = document.getElementById('journalSearch');
    if (search) search.addEventListener('input', () => {
      const value = search.value.trim().toLowerCase();
      mount.querySelectorAll('[data-search]').forEach(card => {
        card.classList.toggle('hidden', !card.dataset.search.toLowerCase().includes(value));
      });
    });
  }

  loadData().then(data => {
    renderProjects(data);
    renderJournal(data);
    document.querySelectorAll('[data-content-version]').forEach(el => { el.textContent = data.version; });
  }).catch(error => {
    const message = `<section class="notice"><h2>Content unavailable</h2><p>${esc(error.message)}</p><p>Refresh the page after the latest files finish uploading.</p></section>`;
    const projectMount = document.getElementById('projectCards');
    const journalMount = document.getElementById('journalGrid');
    if (projectMount) projectMount.innerHTML = message;
    if (journalMount) journalMount.innerHTML = message;
  });
})();
