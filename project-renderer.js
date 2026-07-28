(() => {
  const mount = document.getElementById('projectApp');
  if (!mount) return;
  const esc = (v='') => String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const url = (v='') => encodeURI(String(v).replace(/["'<>]/g,''));
  fetch('data/projects.json?v=40',{cache:'no-store'})
    .then(r=>{if(!r.ok) throw new Error('Project information could not load'); return r.json();})
    .then(data=>{
      const p=data.projects.find(x=>x.projectId==='eagle-stump-carving') || data.projects[0];
      document.title=`${p.title} | Lou's Garden Guide`;
      const links=(p.artist.links||[]).map(l=>`<a href="${url(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join(' · ');
      const days=p.days.map(day=>{
        const figs=day.photos.map((ph,i)=>`<figure class="${i===0?'wide':''}"><a href="${url(ph.image)}"><img loading="lazy" src="${url(ph.image)}" alt="${esc(ph.alt)}"></a><figcaption><strong>${esc(ph.alt)}</strong><br>${esc(ph.caption)}</figcaption></figure>`).join('');
        return `<section class="day-card"><div class="day-heading"><div><span class="eyebrow">Day ${day.day} · ${esc(day.date||'')}</span><h2>${esc(day.title)}</h2></div><span class="status">${esc(day.status)}</span></div><p>${esc(day.summary)}</p><div class="gallery">${figs}</div></section>`;
      }).join('');
      const future=(p.futureDays||[]).map(d=>`<span class="pill future">Day ${d} · Coming later</span>`).join('');
      mount.innerHTML=`<section class="project-hero" style="background-image:linear-gradient(90deg,rgba(16,42,27,.72),rgba(16,42,27,.08)),url('${url(p.hero)}')"><div><span class="eyebrow">Lou’s Featured Projects</span><h1>${esc(p.title)}</h1><p>${esc(p.subtitle)}</p><a class="button" href="#timeline">View Day 1</a></div></section><section class="day-card artist"><h2>Meet the Artist</h2><h3>${esc(p.artist.name)} · ${esc(p.artist.business)}</h3><p><strong>${esc(p.artist.location)}</strong></p><p>${esc(p.artist.bio)}</p><p class="sources">${links}</p></section><div id="timeline">${days}</div><section class="day-card"><h2>Project Timeline</h2><div class="progress"><span class="pill">Day 1 · Complete</span>${future}<span class="pill future">Final reveal · Planned</span></div><p class="small">Future updates only require the new photographs and an updated <code>data/projects.json</code> file.</p></section>`;
    })
    .catch(err=>mount.innerHTML=`<section class="day-card"><h2>Project unavailable</h2><p>${esc(err.message)}</p></section>`);
})();