(async () => {
    let d = { clicks: 0, conversions: 0, approved: 0, pending: 0, balance: 0, series: { labels: [], clicks: [], earnings: [] }, recent: [], links: [], favorites: [] };
    try { d = await api('/earnings/summary') } catch (e) { note.textContent = 'Showing zeros: ' + e.message }
    const m = v => '₹' + Number(v).toFixed(2);
    Object.entries({ tc: d.clicks, vc: d.conversions, ae: m(d.approved), pe: m(d.pending), ab: m(d.balance) }).forEach(([k, v]) => document.getElementById(k).textContent = v);
    const o = { responsive: true, plugins: { legend: { labels: { color: '#e8ecff' } } }, scales: { x: { ticks: { color: '#9aa3c7' } }, y: { ticks: { color: '#9aa3c7' }, beginAtZero: true } } };
    new Chart(c1, { type: 'line', data: { labels: d.series.labels, datasets: [{ label: 'Clicks', data: d.series.clicks, borderColor: '#a855f7', tension: .4 }] }, options: o });
    new Chart(c2, { type: 'bar', data: { labels: d.series.labels, datasets: [{ label: 'Verified earnings (₹)', data: d.series.earnings, backgroundColor: '#3b82f6' }] }, options: o });
    const li = (a, f, e = '<p style="color:var(--m)">Nothing yet.</p>') => a.length ? a.map(f).join('') : e;
    recent.innerHTML = li(d.recent, r => `<p>${esc(r.text)} <small>${esc(r.at)}</small></p>`);
    links.innerHTML = li(d.links, l => `<tr><td>${esc(l.product)}</td><td>${l.clicks}</td><td>${l.conversions}</td><td><code>${esc(l.url)}</code></td></tr>`, '<tr><td colspan=4>No links yet.</td></tr>');
    favs.innerHTML = li(d.favorites, f => `<p><a href="product-details.html?id=${f.id}">${esc(f.name)}</a></p>`)
})();
