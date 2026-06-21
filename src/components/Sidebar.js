import { getAuthModeLabel, getUserEmail } from '../local/authService.js';

const items = [
  ['#/dashboard', '⌂', 'Dashboard'],
  ['#/search', '⌕', 'Szukaj'],
  ['#/work', '◈', 'Praca'],
  ['#/telmor-sync', '⇄', 'Telmor'],
  ['#/sync', '⟳', 'Sync'],
  ['#/orders-open', '▣', 'Otwarte'],
  ['#/orders-closed', '▤', 'Zamknięte'],
  ['#/customers', '♙', 'Klienci'],
  ['#/history', '↺', 'Historia'],
  ['#/notifications', '🔔', 'Powiadomienia'],
  ['#/diagnostics', '✓', 'Diagnostyka'],
  ['#/settings', '⚙', 'Ustawienia']
];

export function Sidebar() {
  return `
    <aside class="sidebar desktop-only">
      <a class="brand" href="#/dashboard" aria-label="Telmor Praca">
        <span class="brand-mark">✣</span>
        <span>TELMOR<br />PRACA</span>
      </a>
      <nav class="side-nav">
        ${items.map(([route, icon, label]) => `
          <a href="${route}" data-route="${route}" class="nav-link">
            <span class="nav-icon">${icon}</span>
            <span>${label}</span>
            ${label === 'Powiadomienia' ? '<em class="nav-badge">3</em>' : ''}
          </a>
        `).join('')}
      </nav>
      <section class="sync-card">
        <div><span class="status-dot"></span> Konto aplikacji</div>
        <strong>${getAuthModeLabel()}</strong>
        <small>Zalogowano jako: ${getUserEmail()}. Wszystkie dane tej wersji zostają lokalnie w przeglądarce.</small>
      </section>
    </aside>
  `;
}
