let ALL = []; const cmp = JSON.parse(localStorage.getItem('ap_cmp') || '[]');
const buy = p => p.affiliate_url === '#' ? '#' : API_BASE + '/clicks/go/' + p.id;
const card = p => `<article class="glass pcard reveal in">${p.discount ? `<span class="off">${p.discount}% OFF</span>` : ''}<img src="${esc(p.image_url)}" alt="${esc(p.name)}" loading="lazy"><div class="in"><span class="tag">${esc(p.category)}</span><h3>${esc(p.name)}</h3><div class="price">₹${Number(p.price).toLocaleString("en-IN")}${p.discount ? `<del>₹${Math.round(p.price / (1 - p.discount / 100)).toLocaleString("en-IN")}</del>` : ''}</div><div class="row"><a class="btn sm" href="product-details.html?id=${p.id}">Details</a><a class="btn sm ghost" rel="sponsored nofollow noopener" target="_blank" href="${buy(p)}">Buy Now</a><button class="btn sm ghost" onclick="addCmp(${p.id})">Compare</button><button class="btn sm ghost" onclick="fav(${p.id})">♡</button></div></div></article>`;
async function fav(id) { if (!tok()) return location.href = 'login.html'; try { await api('/favorites', { method: 'POST', body: { product_id: id } }); alert('Saved to favorites') } catch (e) { alert(e.message) } }
function addCmp(id) { if (!cmp.includes(id)) { if (cmp.length >= 3) cmp.shift(); cmp.push(id) } localStorage.setItem('ap_cmp', JSON.stringify(cmp)); showCmp() }
function showCmp() { const b = document.getElementById('cmp'); if (b) { b.style.display = cmp.length > 1 ? 'block' : 'none'; b.textContent = `Compare (${cmp.length})` } }
function openCmp() { const ps = ALL.filter(p => cmp.includes(p.id)); cmpBody.innerHTML = `<table><tr><th></th>${ps.map(p => `<th>${esc(p.name)}</th>`).join('')}</tr>${['price', 'category', 'rating'].map(k => `<tr><td>${k}</td>${ps.map(p => `<td>${esc(p[k])}</td>`).join('')}</tr>`).join('')}</table>`; cmpBox.style.display = 'block' }
function render() {
    const q = s.value.toLowerCase(), c = cat.value, mn = +pmin.value || 0, mx = +pmax.value || 1e12;
    let l = ALL.filter(p => p.name.toLowerCase().includes(q) && (!c || p.category === c) && p.price >= mn && p.price <= mx);
    const o = sort.value; l.sort((a, b) => o === 'lo' ? a.price - b.price : o === 'hi' ? b.price - a.price : o === 'rate' ? b.rating - a.rating : b.id - a.id);
    grid.innerHTML = l.map(card).join('') || '<p>No products found.</p>'
}
async function initList() {
    const { items, demo } = await getProducts(); ALL = items; if (demo) document.getElementById('demo').style.display = 'block';
    cat.innerHTML = '<option value="">All categories</option>' + [...new Set(ALL.map(p => p.category))].map(c => `<option>${esc(c)}</option>`).join('');
    ['s', 'cat', 'pmin', 'pmax', 'sort'].forEach(i => document.getElementById(i).oninput = render); render(); showCmp()
}
async function initDetail() {
    const id = +new URLSearchParams(location.search).get('id'); const { items } = await getProducts(); ALL = items; const p = items.find(x => x.id === id);
    if (!p) { det.innerHTML = '<p>Product not found.</p>'; return } document.title = p.name + ' | AffiliatePro';
    det.innerHTML = `<div class="glass" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:24px"><img src="${esc(p.image_url)}" alt="${esc(p.name)}" style="border-radius:14px"><div><span class="tag">${esc(p.category)}</span><h1>${esc(p.name)}</h1><p class="price" style="font-size:2rem">₹${Number(p.price).toLocaleString("en-IN")}</p><p>${esc(p.description)}</p><div class="row"><a class="btn glow" rel="sponsored nofollow noopener" target="_blank" href="${buy(p)}">Buy Now</a><button class="btn ghost" onclick="fav(${p.id})">♡ Favorite</button></div><p style="font-size:.8rem;color:var(--m);margin-top:14px">Affiliate link: we may earn a commission.</p></div></div>`;
    related.innerHTML = items.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4).map(card).join('')
}
async function initHome() { const { items } = await getProducts('?sort=deals&per_page=4'); const g = document.getElementById('deals'); if (g) g.innerHTML = items.slice(0, 4).map(card).join('') }
