import { AppHeader, initAppHeaderSearch } from './components/AppHeader.js';
import { Sidebar } from './components/Sidebar.js';
import { BottomNav } from './components/BottomNav.js';

export function createAppShell(root) {
  root.innerHTML = `
    <div class="app-shell">
      ${Sidebar()}
      <main class="main-area">
        ${AppHeader()}
        <section id="page-root" class="page-root" aria-live="polite"></section>
      </main>
      ${BottomNav()}
    </div>
  `;
  initAppHeaderSearch();
}
