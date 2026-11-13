const T = { products: ['name', 'price', 'category_id', 'affiliate_url'], categories: ['name', 'slug'], blog: ['title', 'body'], banners: ['title', 'link_url'], users: [] }; let cur = 'products';
async function load(t) {
    cur = t; document.querySelectorAll('.tabs button').forEach(b => b.classList.toggle('on', b.dataset.t === t));
    const f = T[t]; form.style.display = f.length ? 'grid' : 'none'; form.innerHTML = f.map(k => `<input name="${k}" placeholder="${k}" required>`).join('') + (f.length ? '<input type="file" name="image" accept="image/*"><button class="btn sm">Create</button><p class="err" id="aerr"></p>' : '');
    try { const d = await api('/admin/' + t); rows.innerHTML = (d.items || d).map(r => `<tr><td>${r.id}</td><td>${esc(r.name || r.title || r.email)}</td><td>${esc(r.role || r.price || '')}</td><td>${t === 'users' ? '' : `<button class="btn sm ghost" onclick="del(${r.id})">Delete</button>`}</td></tr>`).join('') } catch (e) { rows.innerHTML = `<tr><td colspan=4>${esc(e.message)}</td></tr>` }
}
async function del(id) { if (confirm('Delete?')) { await api(`/admin/${cur}/${id}`, { method: 'DELETE' }); load(cur) } }
form.onsubmit = async e => { e.preventDefault(); try { await api('/admin/' + cur, { method: 'POST', body: new FormData(form) }); form.reset(); load(cur) } catch (x) { aerr.textContent = x.message } };
document.querySelectorAll('.tabs button').forEach(b => b.onclick = () => load(b.dataset.t)); load('products');
(async () => { try { const a = await api('/admin/analytics'); an.textContent = `Clicks: ${a.clicks} · Verified conversions: ${a.conversions} · Earnings: ₹${Number(a.earnings).toFixed(2)}` } catch (e) { an.textContent = 'Analytics unavailable: ' + e.message } })();
