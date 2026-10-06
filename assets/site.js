/* MARON — shared behaviour (prototype). In WordPress the catalogue pages become WooCommerce templates;
   this file keeps only the UI parts (video, reels, menus, filters). */
(() => {
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const IG = 'https://www.instagram.com/maron_greece/', TT = 'https://www.tiktok.com/@maron_greece';
const ICON = {
  ig: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor"/></svg>',
  tt: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M16.6 3c.3 2.3 1.7 3.9 4 4.1v3.1c-1.5.1-2.8-.4-4-1.2v5.9c0 3.9-3.3 6.3-6.5 5.9-3.4-.4-5.5-3.6-4.8-6.8.6-2.7 3.2-4.6 6.1-4.2v3.2c-.4-.1-.8-.2-1.2-.1-1.4.1-2.5 1.3-2.3 2.8.1 1.3 1.3 2.3 2.6 2.2 1.3 0 2.3-1.1 2.3-2.4V3h3.8z"/></svg>',
};

/* ---------- reels: every video links to its own Instagram / TikTok post ---------- */
const REELS = {
  giouzel:  {t:'Γκιουζέλ', ig:'Dddujb0A3k6', tt:'7686109472988597526'},
  brookie:  {t:'Brookie · how it’s made', ig:'Dd37LzXA31S', tt:'7689075169658178838'},
  cakeprep: {t:'Your cake is calling', ig:'DctiiBygEKI', tt:'7680236387102166294'},
  lotus:    {t:'Lotus lovers', ig:null, tt:'7686902821161045250'},
  shakebox: {t:'Brookie is calling', ig:'Dc0uzcDAUcR', tt:'7680901413173611798'},
  fruits:   {t:'Viral fruits', ig:'DcvlUz6A2Om', tt:'7680524646722145558'},
  autumn:   {t:'Birthday cake in the making', ig:null, tt:'7682404350261562646'},
  hands:    {t:'Original Brookie', ig:'DdO9bEjg7Kb', tt:'7684231554696252674'},
  showcase: {t:'Το original Brookie', ig:null, tt:'7691656444575304982'},
  vasilis:  {t:'Ο μικρός έπιασε δουλειά', ig:'DdT_742AJ7G', tt:'7685716657892805910'},
  candybar: {t:'Candy bars & events', ig:null, tt:'7687962389383236886'},
  team:     {t:'Η ομάδα μας', ig:null, tt:'7687639170822671618'},
  galatsi:  {t:'Τα Μαρόν παραμένουν ανοιχτά', ig:'Db-SMzZgy56', tt:'7673439278554303766'},
  happy:    {t:'What makes you happy', ig:null, tt:null},
};
const igUrl = r => r.ig ? `https://www.instagram.com/reel/${r.ig}/` : IG;
const ttUrl = r => r.tt ? `${TT}/video/${r.tt}` : TT;
window.MARON = {REELS, igUrl, ttUrl, ICON, esc};

function reelHTML(key) {
  const r = REELS[key]; const main = r.ig ? igUrl(r) : ttUrl(r); const where = r.ig ? 'Instagram' : (r.tt ? 'TikTok' : 'Instagram');
  return `<div class="reel">
    <a class="cover" href="${main}" target="_blank" rel="noopener" aria-label="${esc(r.t)}, άνοιγμα στο ${where}"></a>
    <video src="assets/vid/${key}.mp4" poster="assets/vid/${key}.jpg" muted loop playsinline preload="none" data-auto aria-hidden="true"></video>
    <span class="open">▶ ${where}</span>
    <span class="plats">
      <a href="${igUrl(r)}" target="_blank" rel="noopener" aria-label="Instagram">${ICON.ig}</a>
      <a href="${ttUrl(r)}" target="_blank" rel="noopener" aria-label="TikTok">${ICON.tt}</a>
    </span>
    <span class="cap">${esc(r.t)}</span></div>`;
}
$$('[data-reels]').forEach(el => { el.innerHTML = el.dataset.reels.split(',').map(reelHTML).join(''); });
$$('[data-vlinks]').forEach(el => { const r = REELS[el.dataset.vlinks]; if (!r) return;
  el.innerHTML = `<a href="${igUrl(r)}" target="_blank" rel="noopener" aria-label="Δείτε στο Instagram">${ICON.ig}</a><a href="${ttUrl(r)}" target="_blank" rel="noopener" aria-label="Δείτε στο TikTok">${ICON.tt}</a>`; });

/* ---------- autoplay muted loops while visible ---------- */
const io = ('IntersectionObserver' in window && !reduce) ? new IntersectionObserver(es => es.forEach(e => {
  const v = e.target; if (e.isIntersecting) v.play().catch(() => {}); else if (!v.dataset.keep) v.pause();
}), {threshold: .35}) : null;
const watch = (root = document) => $$('video[data-auto]', root).forEach(v => io && io.observe(v));
watch();

/* ---------- sound toggles ---------- */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-sound]'); if (!b) return;
  const v = b.parentElement.querySelector('video'); const turnOn = v.muted;
  $$('[data-sound]').forEach(o => { const ov = o.parentElement.querySelector('video'); if (ov !== v) { ov.muted = true; delete ov.dataset.keep; o.setAttribute('aria-pressed', 'false'); o.lastChild.textContent = 'Ήχος'; } });
  v.muted = !turnOn; if (turnOn) { v.currentTime = 0; v.dataset.keep = '1'; v.play().catch(() => {}); } else delete v.dataset.keep;
  b.setAttribute('aria-pressed', String(turnOn)); b.lastChild.textContent = turnOn ? 'Σίγαση' : 'Ήχος';
});

/* ---------- hero ---------- */
const hv = $('#heroVid');
if (hv) {
  const mq = matchMedia('(max-width:700px)');
  const pick = () => { const src = mq.matches ? 'assets/vid/hero_m.mp4' : 'assets/vid/hero.mp4';
    if (!hv.src.endsWith(src)) { hv.poster = mq.matches ? 'assets/vid/hero_m.jpg' : 'assets/vid/hero.jpg'; hv.src = src; if (!reduce) hv.play().catch(() => {}); } };
  pick(); mq.addEventListener?.('change', pick); if (reduce) hv.pause();
  const hc = $('#heroCtl'), P = '<svg viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" fill="currentColor"/><rect x="14" y="5" width="4" height="14" fill="currentColor"/></svg>', Y = '<svg viewBox="0 0 24 24"><path d="M7 5l12 7-12 7z" fill="currentColor"/></svg>';
  const sync = () => { hc.innerHTML = hv.paused ? Y : P; hc.setAttribute('aria-label', hv.paused ? 'Αναπαραγωγή βίντεο' : 'Παύση βίντεο'); };
  hc.onclick = () => hv.paused ? hv.play() : hv.pause(); hv.addEventListener('play', sync); hv.addEventListener('pause', sync); sync();
}

/* ---------- home: signature tabs (curated photos & videos → category pages) ---------- */
const sig = $('#sigGrid');
if (sig) {
  const SIG = JSON.parse($('#sigData').textContent);
  const tabs = $('#sigTabs'), intro = $('#sigIntro');
  const render = id => { const c = SIG.find(x => x.id === id) || SIG[0];
    $$('.tab', tabs).forEach(b => b.setAttribute('aria-selected', b.dataset.id === c.id));
    intro.innerHTML = `${esc(c.intro)} <a class="textlink" style="margin:0 0 0 8px" href="${c.href}">Όλα (${c.total}) →</a>`;
    sig.innerHTML = c.items.map(it => it.v
      ? `<a class="card" href="${REELS[it.v].ig ? igUrl(REELS[it.v]) : ttUrl(REELS[it.v])}" target="_blank" rel="noopener"><div class="ph"><video src="assets/vid/${it.v}.mp4" poster="assets/vid/${it.v}.jpg" muted loop playsinline preload="none" data-auto aria-hidden="true"></video><span class="badge"><i></i>Video</span></div><div class="cap">${esc(it.n)}<small>Δείτε το βίντεο</small></div></a>`
      : `<a class="card" href="${it.href || c.href}"><div class="ph"><img src="${it.img}" alt="${esc(it.n)}" loading="lazy"></div><div class="cap">${esc(it.n)}</div></a>`).join('');
    watch(sig); };
  tabs.innerHTML = SIG.map(c => `<button class="tab" role="tab" data-id="${c.id}">${esc(c.name)}</button>`).join('');
  tabs.onclick = e => { const b = e.target.closest('.tab'); if (b) render(b.dataset.id); };
  render(SIG[0].id);
}

/* ---------- catalogue (products / category / product pages) ---------- */
const page = document.body.dataset.page;
if (['catalogue', 'category', 'product'].includes(page)) {
  fetch('assets/products.json').then(r => r.json()).then(DB => catalogue(DB)).catch(err => { const m = $('main'); m && m.insertAdjacentHTML('beforeend', `<p class="empty wrap">Δεν φορτώθηκε ο κατάλογος (${esc(err.message)}).</p>`); });
}
function catalogue(DB) {
  const A = DB.atlas, cats = {}; Object.values(DB.cats).forEach(c => { if (c.key && c.key !== 'other') cats[c.key] = c; });
  const anc = k => { const out = []; let c = cats[k]; while (c) { out.push(c.key); c = c.parentKey && cats[c.parentKey]; } return out; };
  const P = DB.products.map(p => ({...p, all: [...new Set(p.c.flatMap(anc))]}));
  const byId = Object.fromEntries(P.map(p => [p.id, p]));
  const inCat = k => P.filter(p => p.all.includes(k));
  const kids = k => Object.values(cats).filter(c => c.parentKey === k);
  const rows = Math.ceil(A.per / A.cols);
  const atl = t => { if (t == null) return 'background:var(--sand)'; const a = Math.floor(t / A.per), j = t % A.per, cx = j % A.cols, cy = Math.floor(j / A.cols);
    return `background-image:url(assets/atlas/a${String(a).padStart(2, '0')}.webp);background-size:${A.cols * 100}% ${rows * 100}%;background-position:${cx / (A.cols - 1) * 100}% ${cy / (rows - 1) * 100}%`; };
  const card = p => `<a class="card" href="proion.html#p${p.id}"><div class="ph"><div class="atl" role="img" aria-label="${esc(p.n)}" style="${atl(p.t)}"></div></div><div class="cap">${esc(p.n)}<small>${esc(cats[p.c[0]]?.name || '')}</small></div></a>`;
  const label = k => k === 'glyka-tourtes' ? 'Τούρτες (γλυκά)' : k === 'pagoto-tourtes' ? 'Τούρτες παγωτό' : cats[k]?.name;

  function listing(list, gridEl, countEl, moreEl, step = 48) {
    let shown = 0; const draw = () => { const next = list.slice(shown, shown + step); gridEl.insertAdjacentHTML('beforeend', next.map(card).join('')); shown += next.length;
      moreEl.hidden = shown >= list.length; if (countEl) countEl.textContent = `${list.length} δημιουργίες`; };
    gridEl.innerHTML = ''; draw(); moreEl.onclick = draw; if (!list.length) gridEl.innerHTML = '<p class="empty" style="grid-column:1/-1">Δεν βρέθηκαν δημιουργίες. Δοκιμάστε άλλη λέξη.</p>';
  }
  const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  if (page === 'catalogue') {
    const grid = $('#grid'), cnt = $('#count'), more = $('#more'), q = $('#q'), res = $('#results'), shelves = $('#shelves');
    $$('.shelf[data-cat]').forEach(el => { const list = inCat(el.dataset.cat); el.innerHTML = list.slice(0, 12).map(card).join(''); });
    $$('.shelf[data-ids]').forEach(el => { el.innerHTML = el.dataset.ids.split(',').map(i => byId[+i]).filter(Boolean)
      .map(p => card(p).replace('<div class="ph">', '<div class="ph"><span class="hotbadge">Hot</span>')).join(''); });
    const run = () => { const term = norm(q.value.trim());
      if (!term) { res.hidden = true; shelves.hidden = false; cnt.hidden = true; return; }
      res.hidden = false; shelves.hidden = true; cnt.hidden = false;
      listing(P.filter(p => norm(p.n + ' ' + p.s + ' ' + p.alt).includes(term)), grid, cnt, more); };
    let tm; q.oninput = () => { clearTimeout(tm); tm = setTimeout(run, 160); };
    run();
  }
  if (page === 'category') {
    const draw = () => {
      const k = (location.hash.slice(1) || 'tourtes'); const c = cats[k];
      if (!c) { $('#catTitle').textContent = 'Η κατηγορία δεν βρέθηκε'; return; }
      const list = inCat(k); document.title = `${label(k)} · Patisserie MARON`;
      $('#catTitle').textContent = label(k);
      $('#catEyebrow').textContent = c.parentKey ? (label(c.parentKey)) : 'Προϊόντα';
      $('#catLead').textContent = (window.CAT_COPY && CAT_COPY[k]) || `Όλες οι δημιουργίες μας στην κατηγορία «${label(k)}». Πατήστε σε μία για λεπτομέρειες και παραγγελία.`;
      $('#crumbCat').textContent = label(k);
      const parent = c.parentKey && cats[c.parentKey]; $('#crumbParent').innerHTML = parent && parent.key !== 'proionta' ? `<a href="katigoria.html#${parent.key}">${esc(label(parent.key))}</a> <span aria-hidden="true">/</span>` : '';
      const sib = c.parentKey && c.parentKey !== 'proionta' ? [cats[c.parentKey], ...kids(c.parentKey)] : [c, ...kids(k)];
      $('#subchips').innerHTML = sib.filter(x => x && inCat(x.key).length).map(x => `<a class="chip" href="katigoria.html#${x.key}" ${x.key === k ? 'aria-current="page"' : ''}>${esc(x.key === c.parentKey ? 'Όλα' : (x.key === k && !c.parentKey ? 'Όλα' : label(x.key)))} <small>${inCat(x.key).length}</small></a>`).join('');
      const q = $('#q'); q.value = '';
      const run = () => { const t = norm(q.value.trim()); listing(t ? list.filter(p => norm(p.n + ' ' + p.s).includes(t)) : list, $('#grid'), $('#count'), $('#more')); };
      let tm; q.oninput = () => { clearTimeout(tm); tm = setTimeout(run, 160); }; run();
      $$('nav.main a.ml').forEach(a => a.toggleAttribute('aria-current', a.dataset.key && anc(k).includes(a.dataset.key)));
      window.scrollTo(0, 0);
    };
    addEventListener('hashchange', draw); draw();
  }
  if (page === 'product') {
    const draw = () => {
      const id = +(location.hash.match(/^#p(\d+)$/) || [])[1]; const p = byId[id] || P[0];
      const c0 = p.c.find(k => cats[k] && k !== 'proionta') || p.c[0]; const c = cats[c0];
      document.title = `${p.n} · Patisserie MARON`;
      $('#pName').textContent = p.n; $('#pMedia').innerHTML = `<div class="atl" role="img" aria-label="${esc(p.alt || p.n)}" style="${atl(p.t)}"></div>`;
      $('#pCat').textContent = label(c0) || 'Προϊόντα';
      $('#pDesc').innerHTML = p.d ? p.d.split(/\n+/).filter(Boolean).map(x => x.startsWith('<') ? x : `<p>${x}</p>`).join('') : `<p>Ρωτήστε μας για γεύσεις, μεγέθη και διαθεσιμότητα.</p>`;
      $('#pFacts').innerHTML = `<dt>Κατηγορία</dt><dd>${p.c.filter(k => cats[k] && k !== 'proionta').map(k => `<a href="katigoria.html#${k}">${esc(label(k))}</a>`).join(', ')}</dd><dt>Κωδικός</dt><dd>${esc(p.s.toUpperCase().slice(0, 40))}</dd><dt>Παραγγελία</dt><dd>Με μήνυμα στο Instagram ή στο τηλέφωνο</dd>`;
      $('#crumbs').innerHTML = `<a href="index.html">Αρχική</a> <span aria-hidden="true">/</span> <a href="proionta.html">Προϊόντα</a> <span aria-hidden="true">/</span> ${c && c.parentKey && c.parentKey !== 'proionta' ? `<a href="katigoria.html#${c.parentKey}">${esc(label(c.parentKey))}</a> <span aria-hidden="true">/</span> ` : ''}<a href="katigoria.html#${c0}">${esc(label(c0))}</a>`;
      const sibs = inCat(c0); const i = sibs.findIndex(x => x.id === p.id); const prev = sibs[(i - 1 + sibs.length) % sibs.length], next = sibs[(i + 1) % sibs.length];
      $('#pNav').innerHTML = `<a href="proion.html#p${prev.id}">← ${esc(prev.n)}</a><a href="proion.html#p${next.id}" style="text-align:right">${esc(next.n)} →</a>`;
      const rel = sibs.filter(x => x.id !== p.id); const start = Math.max(0, i); $('#related').innerHTML = rel.slice(start, start + 8).concat(rel.slice(0, Math.max(0, 8 - rel.slice(start).length))).slice(0, 8).map(card).join('');
      $('#relMore').href = `katigoria.html#${c0}`; $('#relMore').textContent = `Όλες οι ${label(c0)} (${sibs.length}) →`;
      $('#pOld').textContent = p.old;
      window.scrollTo(0, 0);
    };
    addEventListener('hashchange', draw); draw();
  }
}

/* ---------- forms (prototype: no backend yet) ---------- */
$$('form.f').forEach(f => f.addEventListener('submit', e => { e.preventDefault(); const ok = f.querySelector('.ok') || f.appendChild(Object.assign(document.createElement('p'), {className: 'ok full'}));
  ok.textContent = 'Το draft δεν στέλνει ακόμα: στο WordPress η φόρμα θα πηγαίνει στο info@maron-glykos.gr.'; }));

/* ---------- menu ---------- */
const header = $('header.top'), mb = $('#menuBtn');
mb && (mb.onclick = () => { const o = header.classList.toggle('open'); mb.setAttribute('aria-expanded', o); });
})();
