const items = [
  ['#/dashboard', '⌂', 'Start'],
  ['#/orders-open', '▣', 'Zlecenia'],
  ['#/search', '⌕', 'Szukaj'],
  ['#/work', '◈', 'Praca'],
  ['#/history', '↺', 'Historia']
];

export function BottomNav() {
  return `
    <nav class="bottom-nav mobile-only" aria-label="Dolne menu">
      ${items.map(([route, icon, label], index) => `
        <a href="${route}" data-route="${route}" class="bottom-link ${index === 2 ? 'bottom-link-main' : ''}">
          <span>${icon}</span>
          <small>${label}</small>
        </a>
      `).join('')}
    </nav>
  `;
}
