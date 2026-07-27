(() => {
  const el = document.getElementById('photoJournalApp');
  if (!el) return;
  const data = window.LOUGARDEN_JOURNAL_DATA;
  if (!data || !Array.isArray(data.photoJournal)) {
    el.innerHTML = '<div class="v3-error"><strong>Photos could not load.</strong><br>The journal data file is missing.</div>';
    return;
  }
  try {
    const frag = document.createDocumentFragment();
    data.photoJournal.forEach(section => {
      const sec = document.createElement('section'); sec.className='gallery-section'; sec.id=section.id;
      const heading=document.createElement('div'); heading.className='section-heading';
      heading.innerHTML=`<h2>${escapeHtml(section.title)}</h2><span>${section.photos.length} photo${section.photos.length===1?'':'s'}</span>`;
      const gallery=document.createElement('div'); gallery.className='gallery';
      section.photos.forEach(photo => {
        const fig=document.createElement('figure');
        const name=photo.plantName ? `<strong class="plant-name">${escapeHtml(photo.plantName)}</strong>` : '';
        const info=photo.plantInfo ? `<a class="plant-info-link" href="${safeUrl(photo.plantInfo)}" aria-label="View ${escapeHtml(photo.plantName || 'plant')} information">ⓘ View ${escapeHtml(photo.plantName || 'plant')} information</a>` : '';
        fig.innerHTML=`<a href="${safeUrl(photo.image)}"><img loading="lazy" src="${safeUrl(photo.image)}" alt="${escapeHtml(photo.alt || photo.caption)}"></a><figcaption>${name}<span>${escapeHtml(photo.caption)}</span>${info}</figcaption>`;
        gallery.appendChild(fig);
      });
      sec.append(heading,gallery); frag.appendChild(sec);
    });
    el.replaceChildren(frag);
  } catch(err) { el.innerHTML=`<div class="v3-error"><strong>Photos could not load.</strong><br>${escapeHtml(err.message)}</div>`; }
  function escapeHtml(s=''){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
  function safeUrl(s=''){return encodeURI(String(s).replace(/["'<>]/g,''));}
})();
