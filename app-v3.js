(() => {
  const el = document.getElementById('photoJournalApp');
  if (!el) return;
  fetch('data/site-data.json?v=40', {cache:'no-store'})
    .then(r => { if(!r.ok) throw new Error('Could not load site data'); return r.json(); })
    .then(data => {
      const frag=document.createDocumentFragment();
      data.photoJournal.forEach(section => {
        const sec=document.createElement('section'); sec.className='gallery-section'; sec.id=section.id;
        const heading=document.createElement('div'); heading.className='section-heading';
        heading.innerHTML=`<h2>${escapeHtml(section.title)}</h2><span>${section.photos.length} photo${section.photos.length===1?'':'s'}</span>`;
        const gallery=document.createElement('div'); gallery.className='gallery';
        section.photos.forEach(photo => {
          const fig=document.createElement('figure');
          const info=photo.plantInfo ? `<a class="plant-info-link" href="${safeUrl(photo.plantInfo)}" aria-label="View plant information and growing guide">ⓘ Plant information</a>` : '';
          fig.innerHTML=`<a href="${safeUrl(photo.image)}"><img loading="lazy" src="${safeUrl(photo.image)}" alt="${escapeHtml(photo.alt||photo.caption)}"></a><figcaption>${escapeHtml(photo.caption)}${info}</figcaption>`;
          gallery.appendChild(fig);
        });
        sec.append(heading,gallery); frag.appendChild(sec);
      });
      el.replaceChildren(frag);
    })
    .catch(err => { el.innerHTML=`<div class="v3-error"><strong>Photos could not load.</strong><br>${escapeHtml(err.message)}</div>`; });
  function escapeHtml(s=''){ return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
  function safeUrl(s=''){ return encodeURI(String(s).replace(/["'<>]/g,'')); }
})();
