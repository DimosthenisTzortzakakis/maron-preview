/* MARON — shared behaviour (prototype). In WordPress the catalogue pages become WooCommerce templates;
   this file keeps only the UI parts (video, reels, menus, filters). */
(() => {
const PAGE = n => n + '.html';
const VER = ((document.currentScript && document.currentScript.src.split('?v=')[1]) || String(Date.now())).split('&')[0];
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const VIDP = 'assets/vid/';   // product / reel videos
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
  cinematic:{t:'Cinematic Brookie', ig:'DeZz0-Xgzbj', tt:null},
  vasilis:  {t:'Ο μικρός έπιασε δουλειά', ig:'DdT_742AJ7G', tt:'7685716657892805910'},
  candybar: {t:'Candy bars & events', ig:null, tt:'7687962389383236886'},
  team:     {t:'Η ομάδα μας', ig:null, tt:'7687639170822671618'},
  galatsi:  {t:'Τα Μαρόν παραμένουν ανοιχτά', ig:'Db-SMzZgy56', tt:'7673439278554303766'},
  happy:    {t:'What makes you happy', ig:null, tt:null},
  blindtaste:{t:'Blind taste challenge', ig:null, tt:'7690927463760710934'},
};
const igUrl = r => r.ig ? `https://www.instagram.com/reel/${r.ig}/` : IG;
const ttUrl = r => r.tt ? `${TT}/video/${r.tt}` : TT;
window.MARON = {REELS, igUrl, ttUrl, ICON, esc};

function reelHTML(key) {
  const r = REELS[key]; return reelItem({src: `assets/vid/${key}.mp4`, poster: `assets/vid/${key}.jpg`, t: r.t, ig: r.ig ? igUrl(r) : IG, tt: ttUrl(r)});
}
function reelItem(o) {
  return `<div class="reel">
    <button type="button" class="cover" data-play="${esc(o.src)}" data-poster="${esc(o.poster)}" data-t="${esc(o.t)}" data-ig="${esc(o.ig)}" data-tt="${esc(o.tt)}" aria-label="${esc(o.t)}, αναπαραγωγή"></button>
    <video src="${o.src}" poster="${o.poster}" muted loop playsinline preload="none" data-auto aria-hidden="true"></video>
    <span class="open">▶ Play</span>
    <span class="plats">
      <a href="${o.ig}" target="_blank" rel="noopener" aria-label="Instagram">${ICON.ig}</a>
      <a href="${o.tt}" target="_blank" rel="noopener" aria-label="TikTok">${ICON.tt}</a>
    </span>
    <span class="cap">${esc(o.t)}</span></div>`;
}
$$('[data-reels]').forEach(el => {
  el.innerHTML = el.dataset.reels.split(',').map(reelHTML).join('');
  if (el.hasAttribute('data-auto-reels')) fetch(`assets/reels.json?v=${VER}`).then(r => r.ok ? r.json() : []).then(list => {
    if (!list || list.length < 4) return;
    el.innerHTML = list.map(x => reelItem({src: `assets/vid/tt/${x.tt}.mp4`, poster: `assets/vid/tt/${x.tt}.jpg`, t: x.t,
      ig: x.ig ? `https://www.instagram.com/reel/${x.ig}/` : IG, tt: `${TT}/video/${x.tt}`})).join('');
    el.scrollLeft = 0; watch(el); el.dispatchEvent(new Event('scroll'));
  }).catch(() => {});
});
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
  v.muted = !turnOn; if (turnOn) { v.dataset.keep = '1'; if (v.paused) v.play().catch(() => {}); } else delete v.dataset.keep;   // keeps playing where it is
  b.setAttribute('aria-pressed', String(turnOn)); b.lastChild.textContent = turnOn ? 'Σίγαση' : 'Ήχος';
});

/* ---------- hero ---------- */
const hv = $('#heroVid');
if (hv) {
  const mq = matchMedia('(max-width:700px)');
  // same calm shop film everywhere; phones get the vertical crop of it (1 MB instead of 4 MB)
  const pick = () => { const k = mq.matches ? 'hero_p' : 'hero', src = VIDP + k + '.mp4';
    if (!hv.src.endsWith(src)) { hv.poster = VIDP + k + '.webp'; hv.src = src; if (!reduce) hv.play().catch(() => {}); } };
  pick(); mq.addEventListener?.('change', pick); if (reduce) hv.pause();
}

/* ---------- home: signature tabs — real products (rendered once the catalogue is loaded) ---------- */
function renderSig(card, byId) {
  const sig = $('#sigGrid'); if (!sig) return;
  const SIG = JSON.parse($('#sigData').textContent);
  const tabs = $('#sigTabs'), intro = $('#sigIntro');
  const render = id => { const c = SIG.find(x => x.id === id) || SIG[0];
    $$('.tab', tabs).forEach(b => b.setAttribute('aria-selected', b.dataset.id === c.id));
    intro.innerHTML = `${esc(c.intro)} <a class="textlink" style="margin:0 0 0 8px" href="${c.href}">Όλα (${c.total}) →</a>`;
    sig.innerHTML = c.ids ? c.ids.map(i => byId[i]).filter(Boolean).slice(0, 8).map(card).join('')
      : (c.items || []).slice(0, 8).map(it => `<a class="card" href="${it.href}"><div class="ph"><img src="${it.img}" alt="${esc(it.n)}" loading="lazy"></div><div class="cap">${esc(it.n)}</div></a>`).join(''); };
  tabs.innerHTML = SIG.map(c => `<button class="tab" role="tab" data-id="${c.id}">${esc(c.name)}</button>`).join('');
  tabs.onclick = e => { const b = e.target.closest('.tab'); if (b) render(b.dataset.id); };
  render(SIG[0].id);
}

/* ---------- catalogue (products / category / product pages) ---------- */
const page = document.body.dataset.page;
if (['catalogue', 'category', 'product'].includes(page) || $('#homeHot') || $('[data-evcat]')) {
  fetch(`assets/products.json?v=${VER}`).then(r => r.json()).then(DB => catalogue(DB)).catch(err => { const m = $('main'); m && m.insertAdjacentHTML('beforeend', `<p class="empty wrap">Δεν φορτώθηκε ο κατάλογος (${esc(err.message)}).</p>`); });
}
function catalogue(DB) {
  const A = DB.atlas, cats = {}; Object.values(DB.cats).forEach(c => { if (c.key && c.key !== 'other') cats[c.key] = c; });
  const anc = k => { const out = []; let c = cats[k]; while (c) { out.push(c.key); c = c.parentKey && cats[c.parentKey]; } return out; };
  const P = DB.products.map(p => ({...p, all: [...new Set(p.c.flatMap(anc))]}));
  const byId = Object.fromEntries(P.map(p => [p.id, p]));
  // ranking: signature collections first (interleaved wedding / diamond / vintage), then restyled photos, then the rest
  const COLK = ['gamou', 'diamond', 'vintage'], colIdx = {};
  COLK.forEach(k => P.filter(p => p.id >= 910000 && p.c.includes(k)).forEach((p, i) => colIdx[p.id] = i * 3 + COLK.indexOf(k)));
  const rank = p => p.id in colIdx ? colIdx[p.id] : (p.r ? 1000 : 100000);
  const inCat = k => P.filter(p => p.all.includes(k)).sort((a, b) => rank(a) - rank(b));
  const kids = k => Object.values(cats).filter(c => c.parentKey === k);
  const rows = Math.ceil(A.per / A.cols);
  const atl = t => { if (t == null) return 'background:var(--sand)'; const a = Math.floor(t / A.per), j = t % A.per, cx = j % A.cols, cy = Math.floor(j / A.cols);
    return `background-image:url(assets/atlas/a${String(a).padStart(2, '0')}.webp?v=${VER});background-size:${A.cols * 100}% ${rows * 100}%;background-position:${cx / (A.cols - 1) * 100}% ${cy / (rows - 1) * 100}%`; };
  $$('[data-evcat]').forEach(el => { const p = P.filter(x => x.all.includes(el.dataset.evcat)).find(x => x.r) || P.find(x => x.all.includes(el.dataset.evcat)); if (p) el.setAttribute('style', atl(p.t)); });   // events add-ons
  const card = p => `<a class="card" href="proion.html#p${p.id}"><div class="ph">${p.v && p.v.length ? '<span class="vbadge">▶ Βίντεο</span>' : ''}<div class="atl" role="img" aria-label="${esc(p.n)}" style="${atl(p.t)}"></div></div><div class="cap">${esc(p.n)}<small>${esc(cats[p.c[0]]?.name || '')}</small></div></a>`;
  const label = k => k === 'glyka-tourtes' ? 'Τούρτες (γλυκά)' : k === 'pagoto-tourtes' ? 'Τούρτες παγωτό' : cats[k]?.name;

  function listing(list, gridEl, countEl, moreEl, step = 48, pre = 0) {   // pre: cards the server already printed (same order) -> keep them
    let shown = pre; const draw = () => { const next = list.slice(shown, shown + step); gridEl.insertAdjacentHTML('beforeend', next.map(card).join('')); shown += next.length;
      moreEl.hidden = shown >= list.length; if (countEl) countEl.textContent = `${list.length} δημιουργίες`; };
    if (pre) { moreEl.hidden = shown >= list.length; if (countEl) countEl.textContent = `${list.length} δημιουργίες`; } else { gridEl.innerHTML = ''; draw(); }
    moreEl.onclick = draw; if (!list.length) gridEl.innerHTML = '<p class="empty" style="grid-column:1/-1">Δεν βρέθηκαν δημιουργίες. Δοκιμάστε άλλη λέξη.</p>';
  }
  const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  renderSig(card, byId);
  const hh = $('#homeHot');
  if (hh) {
    // photo first; the reel opens on demand (client: no autoplaying videos in Hot)
    const HOTIMG = {shakebox: 'assets/img/gen/hot-brookie.webp', fruits: 'assets/img/gen/hot-fruits.webp'};
    const vid = (k, n, sub) => `<button type="button" class="card hotvid" data-v="${k}" data-n="${esc(n)}" data-img="${HOTIMG[k]}"><div class="ph"><span class="hotbadge">Hot</span><img src="${HOTIMG[k]}" onerror="this.onerror=null;this.src='assets/vid/${k}.jpg'" alt="${esc(n)}" loading="lazy"><span class="playhint" aria-hidden="true">▶</span></div><div class="cap">${esc(n)}<small>${esc(sub)}</small></div></button>`;
    const prods = hh.dataset.ids.split(',').map(i => byId[+i]).filter(Boolean).map(p => card(p).replace('<div class="ph">', '<div class="ph"><span class="hotbadge">Hot</span>'));
    const hotP = id => byId[id] && card(byId[id]).replace('<div class="ph">', '<div class="ph"><span class="hotbadge">Hot</span>');
    hh.innerHTML = [hotP(910901) || vid('shakebox', 'Brookie', 'Το viral μας'), prods[0], hotP(910902) || vid('fruits', 'Viral fruits', 'Κάθε Τετάρτη νέες γεύσεις'), ...prods.slice(1)].filter(Boolean).join('');
    watch(hh);
  }
  if (page === 'catalogue') {
    const grid = $('#grid'), cnt = $('#count'), more = $('#more'), q = $('#q'), res = $('#results'), shelves = $('#shelves');
    $$('.shelf[data-cat]').forEach(el => { const list = inCat(el.dataset.cat); el.innerHTML = list.slice(0, 12).map(card).join(''); });
    $$('.shelf[data-ids]').forEach(el => { el.innerHTML = el.dataset.ids.split(',').map(i => byId[+i]).filter(Boolean)
      .map(p => card(p).replace('<div class="ph">', '<div class="ph"><span class="hotbadge">Hot</span>')).join(''); });
    const run = () => { const term = norm(q.value.trim());
      if (!term) { res.hidden = true; shelves.hidden = false; cnt.hidden = true; return; }
      res.hidden = false; shelves.hidden = true; cnt.hidden = false;
      listing(P.filter(p => { const hay = norm(p.n + ' ' + p.s + ' ' + p.alt + ' ' + (p.sub || '') + ' ' + p.all.map(label).join(' ') + ' ' + (p.code || '')); return q.value.trim().split(/\s+/).map(norm).every(w => hay.includes(w)); }), grid, cnt, more); };
    let tm; q.oninput = () => { clearTimeout(tm); tm = setTimeout(run, 160); };
    const qp = new URLSearchParams(location.search).get('q'); if (qp) { q.value = qp; q.scrollIntoView({block: 'center'}); }   // header search
    run();
  }
  if (page === 'category') {
    // parent categories (Τούρτες, Γλυκά …) show one row per sub-category in a fixed order (window.CAT_GROUPS); leaves and searches show the grid.
    // Chips switch in place (history.pushState): no page reload, no flash.
    const sec = $('#subchips').closest('section'), G = $('#catGroups');
    let navK = null, first = true;
    const groupsHTML = (k, list) => {
      const ks = (window.CAT_GROUPS && CAT_GROUPS[k]) || []; const seen = new Set();
      const row = (key, name, l) => `<div class="shelfrow"><div class="shelfhead"><h2>${esc(name)} <small>${l.length}</small></h2>${key ? `<a class="textlink" data-k="${key}" href="katigoria.html#${key}">Δείτε όλες →</a>` : ''}</div><div class="shelf">${l.slice(0, 12).map(card).join('')}</div></div>`;
      const out = ks.map(g => { const l = inCat(g); l.forEach(p => seen.add(p.id)); return l.length ? row(g, label(g), l) : ''; });
      const rest = list.filter(p => !seen.has(p.id)); if (rest.length) out.push(row('', 'Περισσότερες', rest));
      return out.join('');
    };
    const draw = () => {
      const k = navK || (location.hash.slice(1) || 'tourtes'); const c = cats[k];
      if (!c) { $('#catTitle').textContent = 'Η κατηγορία δεν βρέθηκε'; return; }
      const list = inCat(k); document.title = `${(window.CAT_THEME && CAT_THEME[k] && CAT_THEME[k].title) || label(k)} · MARON Patisserie Gelateria`;
      $('#catTitle').textContent = label(k);
      $('#catEyebrow').textContent = c.parentKey ? (label(c.parentKey)) : 'Προϊόντα';
      $('#catLead').textContent = (window.CAT_COPY && CAT_COPY[k]) || `Όλες οι δημιουργίες μας στην κατηγορία «${label(k)}». Πατήστε σε μία για λεπτομέρειες και παραγγελία.`;
      $('#crumbCat').textContent = label(k);
      applyTheme(k, c);
      const parent = c.parentKey && cats[c.parentKey]; $('#crumbParent').innerHTML = parent && parent.key !== 'proionta' ? `<a href="katigoria.html#${parent.key}">${esc(label(parent.key))}</a> <span aria-hidden="true">/</span>` : '';
      const sib = c.parentKey && c.parentKey !== 'proionta' ? [cats[c.parentKey], ...kids(c.parentKey)] : [c, ...kids(k)];
      const order = (window.CAT_GROUPS && CAT_GROUPS[sib[0] && sib[0].key]) || [];
      const pos = x => x === sib[0] ? -1 : (order.includes(x.key) ? order.indexOf(x.key) : 99);
      $('#subchips').innerHTML = sib.filter(x => x && inCat(x.key).length).sort((x, y) => pos(x) - pos(y)).map(x => `<a class="chip" data-k="${x.key}" href="katigoria.html#${x.key}" ${x.key === k ? 'aria-current="page"' : ''}>${esc(x.key === c.parentKey ? 'Όλα' : (x.key === k && !c.parentKey ? 'Όλα' : label(x.key)))} <small>${inCat(x.key).length}</small></a>`).join('');
      const grouped = !!(window.CAT_GROUPS && CAT_GROUPS[k]);
      const q = $('#q'); q.value = '';
      const ssr = first; first = false;   // first draw: keep what WordPress already printed for this category (data-ssr), no redraw
      const run = () => { const t = norm(q.value.trim());
        if (grouped && !t) { $('#grid').hidden = true; $('#more').hidden = true; G.hidden = false; $('#count').textContent = `${list.length} δημιουργίες`; if (!ssr || G.dataset.ssr !== k) G.innerHTML = groupsHTML(k, list); G.dataset.ssr = k; return; }
        G.hidden = true; $('#grid').hidden = false;
        const keep = !t && ssr && $('#grid').dataset.ssr === k ? $('#grid').children.length : 0; $('#grid').dataset.ssr = '';
        listing(t ? list.filter(p => norm(p.n + ' ' + p.s).includes(t)) : list, $('#grid'), $('#count'), $('#more'), 48, keep); };
      let tm; q.oninput = () => { clearTimeout(tm); tm = setTimeout(run, 160); }; run();
      $$('nav.main a.ml').forEach(a => a.toggleAttribute('aria-current', a.dataset.key && anc(k).includes(a.dataset.key)));
    };
    sec.addEventListener('click', e => { const a = e.target.closest('a[data-k]'); if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault(); navK = a.dataset.k; history.pushState({k: navK}, '', a.href); draw();
      const top = $('#subchips').getBoundingClientRect().top + scrollY - 110; if (scrollY > top) scrollTo({top, behavior: reduce ? 'auto' : 'smooth'}); });
    addEventListener('popstate', e => { navK = (e.state && e.state.k) || null; draw(); });
    addEventListener('hashchange', () => { navK = null; draw(); window.scrollTo(0, 0); }); draw();
  }
  if (page === 'product') {
    let pFirst = true;
    const galHTML = vs => `<div class="gal"><div class="gtrack"><figure class="gslide"><button type="button" class="gbadge" aria-label="Δείτε τα βίντεο">▶ ${vs.length} βίντεο</button></figure>${vs.map(k => { const r = REELS[k];
        return `<figure class="gslide gvid" data-v="${k}"><img src="${VIDP}${k}.jpg" alt="${esc(r.t)}" loading="lazy"><button type="button" class="gplay" aria-label="Αναπαραγωγή: ${esc(r.t)}"><span aria-hidden="true">▶</span> Βίντεο</button>
        <figcaption class="gsoc"><span>${esc(r.t)}</span>${r.ig ? `<a href="${igUrl(r)}" target="_blank" rel="noopener" aria-label="Δείτε το στο Instagram">${ICON.ig}</a>` : ''}${r.tt ? `<a href="${ttUrl(r)}" target="_blank" rel="noopener" aria-label="Δείτε το στο TikTok">${ICON.tt}</a>` : ''}</figcaption></figure>`; }).join('')}</div>
      <button type="button" class="garr gprev" aria-label="Προηγούμενο">←</button><button type="button" class="garr gnext" aria-label="Επόμενο">→</button>
      <div class="gdots">${[0, ...vs].map((_, i) => `<button type="button" aria-label="${i ? 'Βίντεο ' + i : 'Φωτογραφία'}"${i ? '' : ' aria-current="true"'}></button>`).join('')}</div></div>`;
    const go = (g, i) => { const tr = $('.gtrack', g); tr.scrollTo({left: i * tr.clientWidth, behavior: reduce ? 'auto' : 'smooth'}); };
    document.addEventListener('click', e => { const g = e.target.closest('.gal'); if (!g) return; const tr = $('.gtrack', g), at = Math.round(tr.scrollLeft / tr.clientWidth);
      if (e.target.closest('.gprev')) return go(g, Math.max(0, at - 1));
      if (e.target.closest('.gnext')) return go(g, Math.min(tr.children.length - 1, at + 1));
      if (e.target.closest('.gbadge')) return go(g, 1);
      const d = e.target.closest('.gdots button'); if (d) return go(g, [...d.parentNode.children].indexOf(d));
      const pl = e.target.closest('.gplay'); if (pl) { const f = pl.closest('.gvid'), k = f.dataset.v, v = document.createElement('video');
        Object.assign(v, {src: `${VIDP}${k}.mp4`, poster: `${VIDP}${k}.jpg`, controls: true, playsInline: true, autoplay: true}); $('img', f).replaceWith(v); pl.remove(); v.play().catch(() => {}); } });
    document.addEventListener('scroll', e => { const tr = e.target; if (!(tr instanceof Element) || !tr.classList.contains('gtrack')) return;
      const i = Math.round(tr.scrollLeft / tr.clientWidth); $$('.gdots button', tr.parentNode).forEach((b, j) => b.toggleAttribute('aria-current', j === i));
      [...tr.children].forEach((sl, j) => { if (j !== i) $$('video', sl).forEach(v => v.pause()); }); }, true);
    const draw = () => {
      const id = +(location.hash.match(/^#p(\d+)$/) || [])[1]; const p = byId[id] || P[0];
      const c0 = p.c.find(k => cats[k] && k !== 'proionta') || p.c[0]; const c = cats[c0];
      document.title = `${p.n} · MARON Patisserie Gelateria`;
      $('#pName').textContent = p.n; $('#pName').nextElementSibling?.classList.contains('pcode') && $('#pName').nextElementSibling.remove();
      if (p.code) $('#pName').insertAdjacentHTML('afterend', `<p class="pcode">Κωδ. ${esc(p.code)}</p>`); const ssr = pFirst; pFirst = false; const m = $('#pMedia');
      if (!(ssr && m.dataset.ssr)) m.innerHTML = `<div class="atl" role="img" aria-label="${esc(p.alt || p.n)}" style="${atl(p.t)}"></div>`;
      const vs = (p.v || []).filter(k => REELS[k]);
      if (vs.length) { const ph = m.firstElementChild; m.innerHTML = galHTML(vs); ph && $('.gslide', m).prepend(ph); }   // the photo node itself moves: no reload, no flash
      $('#pCat').textContent = label(c0) || 'Προϊόντα';
      $('#pDesc').innerHTML = p.d ? p.d.split(/\n+/).filter(Boolean).map(x => x.startsWith('<em>') ? `<p class="tagline">${x}</p>` : x.startsWith('<') ? x : `<p>${x}</p>`).join('') : `<p>Ρωτήστε μας για γεύσεις, μεγέθη και διαθεσιμότητα.</p>`;
      $('#pFacts').innerHTML = `<dt>Κατηγορία</dt><dd>${p.c.filter(k => cats[k] && k !== 'proionta').map(k => `<a href="katigoria.html#${k}">${esc(label(k))}</a>`).join(', ')}</dd><dt>Παραγγελία</dt><dd>Με μήνυμα στο Instagram ή στο τηλέφωνο</dd>`;
      $('#crumbs').innerHTML = `<a href="index.html">Αρχική</a> <span aria-hidden="true">/</span> <a href="proionta.html">Προϊόντα</a> <span aria-hidden="true">/</span> ${c && c.parentKey && c.parentKey !== 'proionta' ? `<a href="katigoria.html#${c.parentKey}">${esc(label(c.parentKey))}</a> <span aria-hidden="true">/</span> ` : ''}<a href="katigoria.html#${c0}">${esc(label(c0))}</a>`;
      const sibs = inCat(c0); const i = sibs.findIndex(x => x.id === p.id); const prev = sibs[(i - 1 + sibs.length) % sibs.length], next = sibs[(i + 1) % sibs.length];
      $('#pNav').innerHTML = `<a href="proion.html#p${prev.id}">← ${esc(prev.n)}</a><a href="proion.html#p${next.id}" style="text-align:right">${esc(next.n)} →</a>`;
      const rel = sibs.filter(x => x.id !== p.id); const start = Math.max(0, i);
      if (!(ssr && $('#related').dataset.ssr)) $('#related').innerHTML = rel.slice(start, start + 8).concat(rel.slice(0, Math.max(0, 8 - rel.slice(start).length))).slice(0, 8).map(card).join('');
      $('#relMore').href = `katigoria.html#${c0}`; $('#relMore').textContent = `Όλες οι ${label(c0)} (${sibs.length}) →`;
      $('#pOld').textContent = p.old; const ow = $('#pOldWrap'); if (ow) ow.hidden = !p.old;
      const of = $('#orderForm'); if (of) { const isCake = p.c.some(k => anc(k).includes('tourtes')); of.hidden = !isCake; $('#ofProduct').value = p.code ? `${p.n} · ${p.code}` : p.n; of.open = false; }
      window.scrollTo(0, 0);
    };
    addEventListener('hashchange', draw); draw();
  }
}

/* ---------- motion layer (home): intro, parallax, reveals, tilt, drag rows, counters ---------- */
if (document.body.dataset.page === 'home' && !reduce) {
  const root = document.documentElement; root.classList.add('js-motion');
  // hero: split MARON into letters, scroll cue
  const h1 = $('#heroTitle');
  if (h1) { const t = h1.textContent; h1.setAttribute('aria-label', t);
    h1.innerHTML = [...t].map((c, i) => `<span class="hl" aria-hidden="true" style="--i:${i}">${esc(c)}</span>`).join(''); }
  const hero = $('#hero'); hero && hero.insertAdjacentHTML('beforeend', '<span class="scrollcue" aria-hidden="true"></span>');
  document.body.insertAdjacentHTML('afterbegin', '<div class="scrollbar" aria-hidden="true"></div>');
  const bar = $('.scrollbar'), track = $('.mq-track');
  // scroll-linked: progress bar, hero parallax, marquee speed follows scroll velocity
  let lastY = scrollY, vel = 0, mx = 0, ticking = false;
  const onScroll = () => { if (ticking) return; ticking = true; requestAnimationFrame(() => {
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    bar.style.setProperty('--sp', max > 0 ? (y / max).toFixed(4) : 0);
    if (hero) hero.style.setProperty('--hp', Math.min(1, Math.max(0, y / hero.offsetHeight)).toFixed(3));
    vel += (y - lastY) * .35; lastY = y; ticking = false; }); };
  addEventListener('scroll', onScroll, {passive: true}); onScroll();
  if (track) { const loop = () => { const half = track.scrollWidth / 2; vel *= .92;
      mx -= .6 + Math.abs(vel) * .08 * Math.sign(vel || 1); if (mx < -half) mx += half; if (mx > 0) mx -= half;
      track.style.setProperty('--mx', mx.toFixed(1) + 'px'); requestAnimationFrame(loop); };
    requestAnimationFrame(loop); }
  // reveals
  const mark = (sel, cls = 'rv', stagger = true) => $$(sel).forEach((el, i) => { el.classList.add(cls); if (stagger) el.style.setProperty('--d', i % 4); });
  mark('main .head, main .shelfhead', 'rvl', false); $$('main .head, main .shelfhead').forEach(el => el.classList.add('rv'));
  mark('.cats .cattile'); mark('.posts .post'); mark('.stores > *'); mark('#istoria .split > *'); mark('.galatsi .split > *');
  $$('.galatsi').forEach(el => el.classList.add('rvg'));
  const rio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); } }), {threshold: .18, rootMargin: '0px 0px -6% 0px'});
  $$('.rv, .rvl, .rvg').forEach(el => rio.observe(el));
  // counters
  const count = el => { const to = +el.dataset.count, t0 = performance.now(), d = 1600;
    const step = now => { const k = Math.min(1, (now - t0) / d), e = 1 - Math.pow(1 - k, 3); el.textContent = Math.round(to * e).toLocaleString('el-GR'); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step); };
  const cio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { count(e.target); cio.unobserve(e.target); } }), {threshold: .6});
  $$('[data-count]').forEach(el => { el.textContent = '0'; cio.observe(el); });
  // category tiles: 3D tilt + glare (fine pointers only)
  if (matchMedia('(hover:hover) and (pointer:fine)').matches) $$('.cattile').forEach(t => {
    t.insertAdjacentHTML('beforeend', '<span class="glare" aria-hidden="true"></span>');
    t.addEventListener('pointermove', e => { const r = t.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      t.classList.add('tilting'); t.style.setProperty('--rx', ((x - .5) * 10).toFixed(2) + 'deg'); t.style.setProperty('--ry', ((.5 - y) * 10).toFixed(2) + 'deg');
      t.style.setProperty('--gx', (x * 100).toFixed(1) + '%'); t.style.setProperty('--gy', (y * 100).toFixed(1) + '%'); });
    t.addEventListener('pointerleave', () => { t.classList.remove('tilting'); t.style.setProperty('--rx', '0deg'); t.style.setProperty('--ry', '0deg'); });
  });
  // signature tabs: stagger the cards on every switch
  const sg = $('#sigGrid'); sg && new MutationObserver(() => $$('.card', sg).forEach((c, i) => c.style.setProperty('--d', i))).observe(sg, {childList: true});
  sg && $$('.card', sg).forEach((c, i) => c.style.setProperty('--d', i));
}
/* ---------- motion layer (about / blog / post / contact) — products pages stay static on purpose ---------- */
if (['about', 'blog', 'post', 'contact', 'seasonal', 'events'].includes(document.body.dataset.page) && !reduce) {
  const pg = document.body.dataset.page; document.documentElement.classList.add('js-motion');
  document.body.insertAdjacentHTML('afterbegin', '<div class="scrollbar" aria-hidden="true"></div>');
  const bar = $('.scrollbar');
  const io2 = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io2.unobserve(e.target); } }), {threshold: .15, rootMargin: '0px 0px -8% 0px'});
  const mark = (sel, cls = 'rv') => $$(sel).forEach((el, i) => { el.classList.add(cls); el.style.setProperty('--d', i % 3); io2.observe(el); });
  mark('main .head'); mark('.posts .post'); mark('.stores > *'); mark('.contacts .box'); mark('form.f > *'); mark('main .split > div > h2'); mark('.seasgrid .seascard');
  $$('.prose > *').forEach(el => io2.observe(el));
  // timeline chapters: reveal + count the year up from the previous chapter
  const chs = $$('.ch'); let prevYear = 1983;
  const yio = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; const el = e.target; yio.unobserve(el);
    const to = +el.dataset.year, from = +el.dataset.from, t0 = performance.now();
    const step = now => { const k = Math.min(1, (now - t0) / 1300), v = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3))); el.textContent = v; if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step); }), {threshold: .3});
  chs.forEach(c => { const tio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { c.classList.add('in'); tio.disconnect(); } }), {threshold: .12}); tio.observe(c);
    const y = $('[data-year]', c); if (y) { y.dataset.from = prevYear === +y.dataset.year ? prevYear - 30 : prevYear; prevYear = +y.dataset.year; yio.observe(y); } });
  const hero = $('.ahero'), tl = $('.tline'), cover = $('.pcover');
  let tk = false;
  const frame = () => { tk = false; const y = scrollY, vh = innerHeight, max = document.documentElement.scrollHeight - vh;
    bar.style.setProperty('--sp', max > 0 ? (y / max).toFixed(4) : 0);
    if (hero) hero.style.setProperty('--hp', Math.min(1, y / hero.offsetHeight).toFixed(3));
    if (tl) { const r = tl.getBoundingClientRect(); tl.style.setProperty('--tp', Math.min(1, Math.max(0, (vh * .55 - r.top) / r.height)).toFixed(4));
      chs.forEach(c => { const b = c.getBoundingClientRect(); if (b.bottom < -200 || b.top > vh + 200) return; const k = (b.top + b.height / 2 - vh / 2) / vh;
        c.style.setProperty('--iy', (-8 - k * 8).toFixed(2)); const yr = $('.ch-year', c); yr && yr.style.setProperty('--py', (k * 36).toFixed(1)); }); }
    if (cover) { const r = cover.getBoundingClientRect(); cover.style.setProperty('--cp', Math.min(1, Math.max(0, 1 - r.bottom / (vh + r.height))).toFixed(3)); } };
  addEventListener('scroll', () => { if (!tk) { tk = true; requestAnimationFrame(frame); } }, {passive: true}); addEventListener('resize', frame); frame();
}
/* horizontal rows (hot shelf, reels): mouse drag + arrow buttons */
$$('#homeHot, #celebRow, [data-reels]').forEach(row => {
  row.classList.add('dragrow');
  const ctl = document.createElement('div'); ctl.className = 'rowctl';
  ctl.innerHTML = '<button type="button" aria-label="Προηγούμενα">←</button><button type="button" aria-label="Επόμενα">→</button>';
  row.before(ctl); const [pv, nx] = $$('button', ctl);
  const by = dir => { row.style.scrollSnapType = 'none'; row.scrollBy({left: dir * row.clientWidth * .8, behavior: reduce ? 'auto' : 'smooth'}); clearTimeout(row._snap); row._snap = setTimeout(() => row.style.scrollSnapType = '', 700); };
  pv.onclick = e => { e.preventDefault(); e.stopPropagation(); by(-1); }; nx.onclick = e => { e.preventDefault(); e.stopPropagation(); by(1); };
  const upd = () => { pv.disabled = row.scrollLeft < 4; nx.disabled = row.scrollLeft + row.clientWidth >= row.scrollWidth - 4; };
  row.addEventListener('scroll', upd, {passive: true}); addEventListener('resize', upd); setTimeout(upd, 600);
  let down = false, sx = 0, sl = 0, moved = 0;
  row.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; moved = 0; sx = e.clientX; sl = row.scrollLeft; });
  addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - sx; moved = Math.max(moved, Math.abs(dx));
    if (moved > 5) { row.classList.add('dragging'); row.scrollLeft = sl - dx; } });
  addEventListener('pointerup', () => { if (!down) return; down = false; setTimeout(() => row.classList.remove('dragging'), 0); });
  row.addEventListener('dragstart', e => e.preventDefault());
});


/* ---------- category character: themed hero, decorations, wedding invitation ---------- */
function decoHTML(kind, n) {
  const rnd = (a, b) => (a + Math.random() * (b - a)).toFixed(2);
  const G = {hearts: '♥', sparkle: '✦', balloons: '', candles: '', petals: '', confetti: '', clouds: '☁', sprinkles: '', ribbons: '', drips: '', bats: '', snow: '❄', letters: ''};
  if (!(kind in G)) return '';
  return Array.from({length: n}, (_, i) => `<i class="d d-${kind}" style="--x:${rnd(0, 100)}%;--y:${rnd(0, 100)}%;--s:${rnd(.6, 1.4)};--t:${rnd(5, 12)}s;--dl:-${rnd(0, 12)}s;--h:${Math.floor(Math.random() * 360)}">${G[kind]}</i>`).join('');
}
window.MARON_deco = decoHTML;
function applyTheme(k, c) {
  const T = (window.CAT_THEME || {})[k] || (window.CAT_THEME || {})[c.parentKey] || {};
  document.body.dataset.cat = k; document.body.dataset.deco = T.deco || '';
  if (T.title) $('#catTitle').textContent = T.title;
  if (T.eyebrow) $('#catEyebrow').textContent = T.eyebrow;
  if (T.lead) $('#catLead').textContent = T.lead;
  $('#catSub').textContent = T.sub || '';
  const counts = {hearts: 10, sparkle: 16, petals: 10, confetti: 14};
  $('#catDeco').innerHTML = reduce ? '' : decoHTML(T.deco, counts[T.deco] || 0);
  $('#catSteps').innerHTML = (T.steps || []).map((x, i) => `<div><b>${String(i + 1).padStart(2, '0')}</b><span>${esc(x)}</span></div>`).join('');
  $('#catCtas').innerHTML = T.invite ? '<button class="darkbtn line" type="button" id="invAgain">Η πρόσκληση</button>' : '';
  const hero = $('#catHero'); hero.classList.remove('in'); void hero.offsetWidth; hero.classList.add('in');
  if (T.invite) { $('#invAgain').onclick = () => openInvite(true); let seen = false; try { seen = sessionStorage.getItem('maronInvite') === '1'; } catch (e) {} if (!seen) openInvite(false); }
}
function openInvite(again) {
  const inv = $('#invite'); if (!inv) return;
  inv.hidden = false; document.documentElement.style.overflow = 'hidden';
  requestAnimationFrame(() => requestAnimationFrame(() => inv.classList.add('open')));
  const close = () => { inv.classList.add('leaving'); try { sessionStorage.setItem('maronInvite', '1'); } catch (e) {}
    setTimeout(() => { inv.hidden = true; inv.classList.remove('open', 'leaving'); document.documentElement.style.overflow = ''; $('#grid').scrollIntoView({behavior: reduce ? 'auto' : 'smooth', block: 'start'}); }, reduce ? 0 : 700); };
  $('#invOpen').onclick = close; $('#invOpen').focus({preventScroll: true});
  inv.onkeydown = e => { if (e.key === 'Escape') close(); };
}

/* ---------- seasonal pages: themed decorations + valentine letters ---------- */
const seasonMeta = document.querySelector('meta[name="maron-season"]');
if (seasonMeta) {
  document.body.dataset.season = seasonMeta.content;
  const h = $('.seashero'); const kind = h && h.dataset.deco;
  const n = {snow: 24, petals: 10, bats: 5, hearts: 12, confetti: 16}[kind] || 0;
  if (h && !reduce) $('.catdeco', h).innerHTML = decoHTML(kind, n);
  h && h.classList.add('in');
  $$('.letter').forEach(l => l.addEventListener('click', () => l.classList.toggle('open')));
}

/* ---------- one video player for the whole site: full vertical frame (never cropped), plays with sound,
   mute / unmute bottom-left like the page videos — toggling never restarts the clip ---------- */
const SND = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
function modal() {
  let m = $('#vmodal'); if (!m) { document.body.insertAdjacentHTML('beforeend', '<div class="vmodal" id="vmodal" hidden role="dialog" aria-modal="true"><div class="vbox"><button class="vclose" type="button" aria-label="Κλείσιμο">×</button><div class="vmedia"></div><div class="vtx"></div></div></div>'); m = $('#vmodal'); }
  const media = $('.vmedia', m);
  const close = () => { m.classList.remove('open'); $$('video', media).forEach(v => v.pause()); setTimeout(() => { m.hidden = true; media.innerHTML = ''; media.classList.remove('isvid'); }, 300); };
  $('.vclose', m).onclick = close; m.onclick = ev => { if (ev.target === m) close(); };
  const esc_ = ev => { if (ev.key === 'Escape') { close(); removeEventListener('keydown', esc_); } }; addEventListener('keydown', esc_);
  const show = () => { m.hidden = false; requestAnimationFrame(() => m.classList.add('open')); };
  return {m, media, show};
}
function playIn(media, src, poster) {
  // pause the page's own loops so only one sound plays
  $$('video').forEach(v => { if (!media.contains(v) && !v.muted) { v.muted = true; delete v.dataset.keep; } });
  media.classList.add('isvid');
  media.innerHTML = `<figure class="vplayer"><video src="${src}" poster="${poster}" autoplay loop playsinline></video>
    <button class="sound on" type="button" data-psound aria-pressed="true">${SND}<span>Σίγαση</span></button></figure>`;
  const v = $('video', media), b = $('[data-psound]', media);
  v.play().catch(() => { v.muted = true; v.play().catch(() => {}); sync(); });
  const sync = () => { b.setAttribute('aria-pressed', String(!v.muted)); b.classList.toggle('on', !v.muted); b.lastChild.textContent = v.muted ? 'Ήχος' : 'Σίγαση'; };
  b.onclick = () => { v.muted = !v.muted; if (v.paused) v.play().catch(() => {}); sync(); };   // same position, no restart
  v.onclick = () => v.paused ? v.play() : v.pause();
}
const vbtns = links => `<div class="vbtns">${links.map(l => `<a class="darkbtn line" href="${l[0]}" target="_blank" rel="noopener">${l[1]} ↗</a>`).join('')}</div>`;

/* hot items: photo first, the reel on demand */
document.addEventListener('click', e => {
  const b = e.target.closest('.hotvid'); if (!b) return;
  const k = b.dataset.v, r = REELS[k] || {}, {m, media, show} = modal();
  media.innerHTML = `<img src="${b.dataset.img}" onerror="this.onerror=null;this.src='assets/vid/${k}.jpg'" alt="">`;
  $('.vtx', m).innerHTML = `<h3>${esc(b.dataset.n)}</h3><div class="vbtns"><button class="darkbtn" type="button" id="vplay">▶ Δείτε το βίντεο</button><a class="darkbtn line" href="${r.ig ? igUrl(r) : ttUrl(r)}" target="_blank" rel="noopener">${r.ig ? 'Instagram' : 'TikTok'} ↗</a></div>`;
  show(); $('#vplay').onclick = () => playIn(media, `assets/vid/${k}.mp4`, `assets/vid/${k}.jpg`);
});
/* celebrity cakes */
document.addEventListener('click', e => {
  const b = e.target.closest('.celebvid'); if (!b) return;
  const {m, media, show} = modal(), k = b.dataset.k;
  $('.vtx', m).innerHTML = `<p class="label">Τούρτες διασήμων</p><h3>${esc(b.dataset.n)}</h3>${vbtns([[b.dataset.link, esc(b.dataset.where)]])}`;
  show(); playIn(media, `assets/vid/${k}.mp4`, `assets/vid/${k}.jpg`);
});
/* Maron on screen reels */
document.addEventListener('click', e => {
  const b = e.target.closest('.reel .cover[data-play]'); if (!b || b.closest('.dragging')) return;
  const {m, media, show} = modal();
  $('.vtx', m).innerHTML = `<p class="label">Maron on screen</p><h3>${esc(b.dataset.t)}</h3>${vbtns([[b.dataset.ig, 'Instagram'], [b.dataset.tt, 'TikTok']])}`;
  show(); playIn(media, b.dataset.play, b.dataset.poster);
});
/* ---------- forms (prototype: no backend yet) ---------- */
$$('form.f').forEach(f => f.addEventListener('submit', e => { e.preventDefault(); const ok = f.querySelector('.ok') || f.appendChild(Object.assign(document.createElement('p'), {className: 'ok full'}));
  ok.textContent = 'Το draft δεν στέλνει ακόμα: στο WordPress η φόρμα θα πηγαίνει στα info@maron-glykos.gr, maron1983@yahoo.com και glykoskyriakos9@gmail.com.'; }));

/* ---------- events form: «Διοργάνωση event» from a category page arrives with ?type=… ticked ---------- */
if ($('#eventForm')) {
  const t = new URLSearchParams(location.search).get('type');
  if (t) $$('#eventForm input[name="type"]').forEach(i => { if (i.value === t) i.checked = true; });
}
/* ---------- header search (icon opens the field on narrow screens) ---------- */
$$('.hsbtn').forEach(b => b.onclick = () => { const h = $('header.top'), o = h.classList.toggle('sopen'); if (o) setTimeout(() => $('.hsearch input', h)?.focus(), 30); });
/* ---------- cookies: Google Analytics only after «Αποδοχή» (Consent Mode default = denied, set in the page head) ---------- */
(() => {
  const KEY = 'maron_consent', priv = (typeof PAGE === 'function') ? PAGE('privacy') : 'privacy.html';
  const get = () => { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
  const apply = v => { if (typeof window.gtag === 'function') window.gtag('consent', 'update', {analytics_storage: v === 'granted' ? 'granted' : 'denied'}); };
  const show = () => {
    if ($('#cookiebar')) return;
    document.body.insertAdjacentHTML('beforeend', `<div class="cookiebar" id="cookiebar" role="dialog" aria-live="polite" aria-label="Cookies"><p>Χρησιμοποιούμε cookies για στατιστικά επισκεψιμότητας, μόνο αν τα αποδεχτείτε. <a href="${priv}">Πολιτική απορρήτου</a></p><div><button type="button" class="darkbtn line" data-c="denied">Απόρριψη</button><button type="button" class="darkbtn" data-c="granted">Αποδοχή</button></div></div>`);
    $('#cookiebar').addEventListener('click', e => { const b = e.target.closest('[data-c]'); if (!b) return; try { localStorage.setItem(KEY, b.dataset.c); } catch (err) {} apply(b.dataset.c); $('#cookiebar').remove(); });
  };
  const v = get(); if (v) apply(v); else setTimeout(show, 900);
  document.addEventListener('click', e => { if (e.target.closest('[data-cookie-settings]')) { try { localStorage.removeItem(KEY); } catch (err) {} show(); } });
  // a short privacy note under every form
  $$('form.f').forEach(f => { if (!f.querySelector('.fpriv')) f.insertAdjacentHTML('beforeend', `<p class="fpriv full">Τα στοιχεία σας χρησιμοποιούνται μόνο για να απαντήσουμε στο αίτημά σας. <a href="${priv}">Πολιτική απορρήτου</a></p>`); });
})();

/* ---------- menu ---------- */
const header = $('header.top'), mb = $('#menuBtn');
mb && (mb.onclick = () => { const o = header.classList.toggle('open'); mb.setAttribute('aria-expanded', o); });
})();
