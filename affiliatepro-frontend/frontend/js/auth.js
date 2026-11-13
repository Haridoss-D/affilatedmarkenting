const me = () => { try { return JSON.parse(localStorage.getItem('ap_user')) } catch { return null } };
function logout() { localStorage.removeItem('ap_token'); localStorage.removeItem('ap_user'); location.href = 'login.html' }
(function () { const g = document.body.dataset.guard; if (!g) return; const u = me(); if (!tok() || !u || (g === 'admin' && u.role !== 'admin')) location.href = 'login.html' })();
async function submitAuth(e, kind) {
    e.preventDefault(); const f = Object.fromEntries(new FormData(e.target)), er = document.getElementById('err'); er.textContent = '';
    try {
        const d = await api('/auth/' + kind, { method: 'POST', body: f });
        if (kind === 'register') { location.href = 'login.html'; return }
        localStorage.setItem('ap_token', d.access_token); localStorage.setItem('ap_user', JSON.stringify(d.user)); location.href = d.user.role === 'admin' ? 'admin.html' : 'dashboard.html'
    }
    catch (x) { er.textContent = x.message === 'Failed to fetch' ? 'Backend not reachable. Start the Flask API.' : x.message }
}
async function forgot() { const email = prompt('Your account email:'); if (!email) return; try { await api('/auth/forgot-password', { method: 'POST', body: { email } }) } catch { } alert('If the email exists, a reset link has been sent.') }
