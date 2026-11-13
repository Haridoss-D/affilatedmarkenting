window.API_BASE = window.API_BASE || 'http://localhost:5000/api';
const tok = () => localStorage.getItem('ap_token');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
async function api(path, o = {}) {
    const h = {}; const form = o.body instanceof FormData; if (!form) h['Content-Type'] = 'application/json';
    if (tok()) h.Authorization = 'Bearer ' + tok();
    const r = await fetch(API_BASE + path, { ...o, headers: h, body: o.body && !form ? JSON.stringify(o.body) : o.body });
    const d = await r.json().catch(() => ({})); if (!r.ok) throw new Error(d.error || r.statusText); return d
}
const IMG = e => `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect width='400' height='300' fill='#efeaff'/><text x='200' y='195' font-size='140' text-anchor='middle'>${e}</text></svg>`)}`;
const DEMO = [['Wireless Earbuds', 2499, 'Electronics', '🎧', 50], ['Smart Watch', 3999, 'Electronics', '⌚', 40], ['Running Sneakers', 2999, 'Fashion', '👟', 60], ['Gaming Console', 44999, 'Electronics', '🎮', 45], ['Online Course Bundle', 1999, 'Education', '🎓', 30], ['Pro Hosting Plan', 3499, 'Software', '💻', 35]].map((p, i) => ({ id: i + 1, name: p[0], price: p[1], category: p[2], rating: 4 + i % 2 * .5, image_url: IMG(p[3]), discount: p[4], description: 'Demo product shown because the backend API is offline.', affiliate_url: '#' }));
async function getProducts(q = '') { try { const d = await api('/products' + q); return { items: d.items || d, demo: false } } catch (e) { return { items: DEMO, demo: true } } }
