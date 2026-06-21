import { DashboardPage } from './pages/DashboardPage.js';
import { OrdersPage } from './pages/OrdersPage.js';
import { OrderDetailsPage } from './pages/OrderDetailsPage.js';
import { CustomersPage } from './pages/CustomersPage.js';
import { HistoryPage } from './pages/HistoryPage.js';
import { NotificationsPage } from './pages/NotificationsPage.js';
import { SettingsPage } from './pages/SettingsPage.js';
import { NotFoundPage } from './pages/NotFoundPage.js';
import { SearchPage, initSearchPage } from './pages/SearchPage.js';
import { TelmorSyncPage } from './pages/TelmorSyncPage.js';
import { SyncPage } from './pages/SyncPage.js';
import { WorkPage } from './pages/WorkPage.js';
import { DiagnosticsPage } from './pages/DiagnosticsPage.js';
import { LoadingView, ErrorView } from './components/LoadingView.js';

const routes = {
  '#/': DashboardPage,
  '#/dashboard': DashboardPage,
  '#/search': SearchPage,
  '#/work': WorkPage,
  '#/telmor-sync': TelmorSyncPage,
  '#/sync': SyncPage,
  '#/customers': CustomersPage,
  '#/history': HistoryPage,
  '#/notifications': NotificationsPage,
  '#/diagnostics': DiagnosticsPage,
  '#/settings': SettingsPage
};

let routerInitialized = false;
let renderCounter = 0;

export function initRouter() {
  if (!routerInitialized) {
    window.addEventListener('hashchange', renderRoute);
    routerInitialized = true;
  }
  renderRoute();
}

async function renderRoute() {
  const pageRoot = document.querySelector('#page-root');
  if (!pageRoot) return;

  const currentRender = ++renderCounter;
  const hash = window.location.hash || '#/dashboard';
  pageRoot.innerHTML = LoadingView();

  try {
    const html = await resolveRoute(hash);
    if (currentRender !== renderCounter) return;
    pageRoot.innerHTML = html;
    markActiveNavigation(hash);
    initializeRoute(hash);
    window.scrollTo({ top: 0, behavior: 'instant' });
  } catch (error) {
    console.error(error);
    if (currentRender !== renderCounter) return;
    pageRoot.innerHTML = ErrorView(error);
  }
}

async function resolveRoute(hash) {
  const path = getPath(hash);
  const params = getParams(hash);

  if (path.startsWith('#/order/')) {
    const id = path.replace('#/order/', '') || '104750';
    return OrderDetailsPage(id, params.get('tab') || 'details');
  }

  if (path === '#/orders-open') {
    return OrdersPage('open', params.get('filter') || params.get('status') || 'all');
  }

  if (path === '#/orders-closed') {
    return OrdersPage('closed', params.get('filter') || params.get('status') || 'all');
  }

  const render = routes[path] || NotFoundPage;
  if (path === '#/search') return render(params);
  return render();
}

function getPath(hash) {
  return hash.split('?')[0] || '#/dashboard';
}

function getParams(hash) {
  const queryPart = hash.split('?')[1] || '';
  return new URLSearchParams(queryPart);
}


function initializeRoute(hash) {
  const path = getPath(hash);
  if (path === '#/search') initSearchPage();
}

function markActiveNavigation(hash) {
  const path = getPath(hash);
  document.querySelectorAll('[data-route]').forEach((link) => {
    const route = link.dataset.route;
    const isOrdersRoute = route === '#/orders-open' && path.startsWith('#/order/');
    link.classList.toggle('active', route === path || isOrdersRoute);
  });
}
