import { getUserInitials } from '../local/authService.js';

export function AppHeader() {
  const initials = getUserInitials();
  const currentQuery = getCurrentSearchQuery();

  return `
    <header class="app-header">
      <div class="mobile-header-row mobile-only">
        <a class="icon-button" href="#/search" aria-label="Szukaj">⌕</a>
        <a class="mobile-brand" href="#/dashboard">TELMOR PRACA</a>
        <a class="notification-button" href="#/notifications" aria-label="Powiadomienia">
          🔔
          <span class="badge">3</span>
        </a>
      </div>

      <form id="app-search-form" class="search-box" role="search" autocomplete="off">
        <span aria-hidden="true">⌕</span>
        <input id="app-search-input" type="search" value="${escapeHtml(currentQuery)}" placeholder="Szukaj zlecenia, klienta, telefonu, miasta..." />
        <kbd>Ctrl K</kbd>
      </form>

      <div class="header-status desktop-only">
        <span class="status-dot"></span>
        <span>PWA lokalne · GitHub Pages</span>
      </div>
      <a class="notification-button desktop-only" href="#/notifications" aria-label="Powiadomienia">
        🔔
        <span class="badge">3</span>
      </a>
      <a class="user-pill desktop-only" href="#/settings" aria-label="Ustawienia użytkownika">${initials}</a>
    </header>
  `;
}

export function initAppHeaderSearch() {
  const form = document.querySelector('#app-search-form');
  const input = document.querySelector('#app-search-input');
  if (!form || !input) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = input.value.trim();
    window.location.hash = value ? `#/search?q=${encodeURIComponent(value)}` : '#/search';
  });

  input.addEventListener('focus', () => {
    if (!window.location.hash.startsWith('#/search')) {
      window.location.hash = '#/search';
    }
  });

  document.addEventListener('keydown', (event) => {
    const isShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k';
    if (!isShortcut) return;

    event.preventDefault();
    input.focus();
    input.select();
  });
}

function getCurrentSearchQuery() {
  if (!window.location.hash.startsWith('#/search')) return '';
  return new URLSearchParams(window.location.hash.split('?')[1] || '').get('q') || '';
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
