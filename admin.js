(() => {
  'use strict';
  let data = { version: '2.1', updated: '', projectCards: [], journalCards: [] };
  const $ = id => document.getElementById(id);
  const status = msg => { $('status').textContent = msg; };
  const clean = value => String(value || '').trim();

  function normalizeData(obj) {
    obj = obj && typeof obj === 'object' ? obj : {};
    obj.projectCards = Array.isArray(obj.projectCards) ? obj.projectCards : [];
    obj.journalCards = Array.isArray(obj.journalCards) ? obj.journalCards : [];
    obj.version = obj.version || '2.1';
    obj.updated = obj.updated || new Date().toISOString().slice(0, 10);
    return obj;
  }

  function refresh() {
    data.updated = new Date().toISOString().slice(0, 10);
    $('jsonPreview').value = JSON.stringify(data, null, 2);
    renderList('projectsList', data.projectCards, 'project');
    renderList('journalList', data.journalCards, 'journal');
  }

  function renderList(targetId, items, type) {
    const target = $(targetId);
    target.innerHTML = '';
    if (!items.length) {
      target.innerHTML = '<p class="small">No entries yet.</p>';
      return;
    }
    items.forEach((item, index) => {
      const row = document.createElement('div');
      row.className = 'item';
      const text = document.createElement('div');
      const title = document.createElement('strong');
      title.textContent = item.title || 'Untitled';
      const detail = document.createElement('small');
      detail.textContent = type === 'journal' ? (item.date || '') : (item.eyebrow || item.href || '');
      text.append(title, detail);
      const button = document.createElement('button');
      button.className = 'btn danger';
      button.textContent = 'Remove';
      button.addEventListener('click', () => {
        if (!confirm(`Remove “${item.title || 'this entry'}”?`)) return;
        items.splice(index, 1);
        refresh();
      });
      row.append(text, button);
      target.appendChild(row);
    });
  }

  async function loadCurrent() {
    try {
      status('Loading site-content.json…');
      const response = await fetch(`site-content.json?editor=${Date.now()}`, { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      data = normalizeData(await response.json());
      refresh();
      status(`Loaded ${data.projectCards.length} projects and ${data.journalCards.length} journal entries.`);
    } catch (error) {
      status('Could not load automatically. Open this page from the live website, or paste JSON into the preview box and click outside it.');
      console.error(error);
    }
  }

  function addProject() {
    const title = clean($('pTitle').value);
    if (!title) return alert('Please enter a project title.');
    data.projectCards.unshift({
      eyebrow: clean($('pEyebrow').value),
      title,
      description: clean($('pDescription').value),
      image: clean($('pImage').value),
      alt: clean($('pAlt').value) || title,
      href: clean($('pHref').value) || '#',
      button: clean($('pButton').value) || 'Open Project'
    });
    clearProject(); refresh(); status(`Added project: ${title}`);
  }

  function addJournal() {
    const title = clean($('jTitle').value);
    if (!title) return alert('Please enter a journal title.');
    data.journalCards.unshift({
      date: clean($('jDate').value),
      title,
      description: clean($('jDescription').value),
      image: clean($('jImage').value),
      alt: clean($('jAlt').value) || title,
      href: clean($('jHref').value) || '#',
      button: clean($('jButton').value) || 'View Entry'
    });
    clearJournal(); refresh(); status(`Added journal entry: ${title}`);
  }

  function clearProject() { ['pTitle','pEyebrow','pDescription','pImage','pAlt','pHref','pButton'].forEach(id => $(id).value = ''); }
  function clearJournal() { ['jDate','jTitle','jDescription','jImage','jAlt','jHref','jButton'].forEach(id => $(id).value = ''); }

  function download(filename, text) {
    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  $('loadBtn').addEventListener('click', loadCurrent);
  $('backupBtn').addEventListener('click', () => download(`site-content-backup-${new Date().toISOString().slice(0,10)}.json`, JSON.stringify(data, null, 2)));
  $('addProjectBtn').addEventListener('click', addProject);
  $('clearProjectBtn').addEventListener('click', clearProject);
  $('addJournalBtn').addEventListener('click', addJournal);
  $('clearJournalBtn').addEventListener('click', clearJournal);
  $('downloadBtn').addEventListener('click', () => { refresh(); download('site-content.json', JSON.stringify(data, null, 2)); status('Downloaded site-content.json.'); });
  $('copyBtn').addEventListener('click', async () => { refresh(); await navigator.clipboard.writeText($('jsonPreview').value); status('JSON copied.'); });
  $('jsonPreview').addEventListener('change', () => {
    try { data = normalizeData(JSON.parse($('jsonPreview').value)); refresh(); status('JSON preview accepted.'); }
    catch { status('The JSON preview contains an error and was not accepted.'); }
  });
  loadCurrent();
})();
