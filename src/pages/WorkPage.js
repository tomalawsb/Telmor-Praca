import { getOrders } from '../data/orderRepository.js';
import { getNotifications } from '../data/notificationRepository.js';
import { getRecentOrders, getWorkPreferences } from '../local/workPreferencesStore.js';
import { WORK_STATUS, getWorkStatusLabel } from '../data/workActions.js';
import { EmptyView } from '../components/LoadingView.js';

export async function WorkPage() {
  const [openOrders, closedOrders, notifications] = await Promise.all([
    getOrders({ mode: 'open', limit: 200 }),
    getOrders({ mode: 'closed', limit: 80 }),
    getNotifications({ limit: 8 })
  ]);

  const allOrders = [...openOrders, ...closedOrders];
  const prefs = getWorkPreferences();
  const recent = getRecentOrders();
  const urgent = openOrders.filter((order) => order.workStatus === WORK_STATUS.URGENT || order.priority === 'Pilne');
  const review = openOrders.filter((order) => order.workStatus === WORK_STATUS.REVIEW || needsReview(order));
  const voucher = openOrders.filter((order) => missingVoucher(order));
  const today = buildTodayList(openOrders);

  return `
    <div class="page work-page">
      <div class="page-title compact-title">
        <div>
          <h1>Praca dzienna</h1>
          <p>Jeden uporządkowany ekran do codziennej obsługi. Szczegóły dalej są schowane w zleceniu, żeby nie robić bałaganu.</p>
        </div>
        <div class="desktop-only title-actions">
          <a href="#/orders-open" class="secondary-button">Lista zleceń</a>
          <a href="#/search" class="primary-button-link">Szukaj</a>
        </div>
      </div>

      <section class="work-summary-grid">
        ${summaryCard('Dzisiaj', today.length, 'Najbliższe lub nowe sprawy', '#/work')}
        ${summaryCard('Pilne', urgent.length, 'Oznaczone roboczo', '#/orders-open?filter=urgent')}
        ${summaryCard('Do sprawdzenia', review.length, 'Wymagają kontroli', '#/orders-open?filter=review')}
        ${summaryCard('Vouchery', voucher.length, 'Brak albo do potwierdzenia', '#/orders-open?filter=missingVoucher')}
      </section>

      <section class="work-grid">
        <article class="panel work-main-panel">
          <div class="panel-header">
            <h2>Najpierw do zrobienia</h2>
            <span>${today.length} pozycji</span>
          </div>
          ${today.length ? renderCompactOrders(today) : EmptyView({ title: 'Brak pilnych spraw na liście', text: 'Po synchronizacji pojawią się tu nowe, pilne i oczekujące zlecenia.' })}
        </article>

        <aside class="work-side-stack">
          <article class="panel">
            <div class="panel-header"><h2>Szybkie filtry</h2></div>
            <div class="saved-filter-grid">
              ${prefs.savedFilters.map((filter) => `<a class="saved-filter" href="${filter.route}">${filter.label}<span>›</span></a>`).join('')}
            </div>
          </article>

          <article class="panel">
            <div class="panel-header"><h2>Ostatnio otwarte</h2></div>
            ${recent.length ? renderRecent(recent) : '<p class="muted">Po wejściu w szczegóły zlecenia pojawi się tu krótka historia ostatnio otwieranych spraw.</p>'}
          </article>

          <article class="panel">
            <div class="panel-header"><h2>Ostatnie powiadomienia</h2><a href="#/notifications">Wszystkie</a></div>
            <div class="mini-notification-list">
              ${notifications.slice(0, 5).map((item) => `
                <a href="${item.orderId ? `#/order/${item.orderId}` : '#/notifications'}">
                  <strong>${escapeHtml(item.title || 'Powiadomienie')}</strong>
                  <small>${escapeHtml(item.body || item.note || '')}</small>
                </a>
              `).join('') || '<p class="muted">Brak powiadomień.</p>'}
            </div>
          </article>
        </aside>
      </section>
    </div>
  `;
}

function buildTodayList(openOrders) {
  return [...openOrders]
    .sort((a, b) => scoreOrder(b) - scoreOrder(a))
    .slice(0, 12);
}

function scoreOrder(order) {
  let score = 0;
  if (order.status === 'Nowe') score += 50;
  if (order.workStatus === WORK_STATUS.URGENT || order.priority === 'Pilne') score += 40;
  if (order.workStatus === WORK_STATUS.REVIEW || needsReview(order)) score += 25;
  if (missingVoucher(order)) score += 20;
  if (order.status === 'Oczekuje') score += 10;
  return score;
}

function needsReview(order) {
  const text = `${order.status || ''} ${order.topic || ''} ${order.description || ''}`.toLowerCase();
  return /sprawd|kontrol|brak|problem|oczekuje/.test(text);
}

function missingVoucher(order) {
  const text = `${order.voucher || ''} ${order.topic || ''}`.toLowerCase();
  return !order.hasVoucher && /voucher|bon|kupon/.test(text);
}

function summaryCard(label, value, note, route) {
  return `
    <a class="work-summary-card" href="${route}">
      <span>${label}</span>
      <strong>${value}</strong>
      <small>${note}</small>
    </a>
  `;
}

function renderCompactOrders(orders) {
  return `
    <div class="work-order-list">
      ${orders.map((order) => `
        <a class="work-order-item" href="#/order/${order.id}">
          <div>
            <strong>#${escapeHtml(order.number || order.id)}</strong>
            <span>${escapeHtml(order.customerName || '-')}</span>
            <small>${escapeHtml([order.city, order.topic].filter(Boolean).join(' · '))}</small>
          </div>
          <div class="work-order-badges">
            <em class="pill pill-${order.statusTone || 'gray'}">${escapeHtml(order.status || '-')}</em>
            ${order.workStatus && order.workStatus !== WORK_STATUS.NORMAL ? `<small>${getWorkStatusLabel(order.workStatus)}</small>` : ''}
          </div>
        </a>
      `).join('')}
    </div>
  `;
}

function renderRecent(recent) {
  return `
    <div class="recent-list">
      ${recent.slice(0, 6).map((order) => `
        <a href="#/order/${order.id}">
          <strong>#${escapeHtml(order.number || order.id)}</strong>
          <span>${escapeHtml(order.customerName || '-')}</span>
          <small>${formatShortDate(order.openedAt)}</small>
        </a>
      `).join('')}
    </div>
  `;
}

function formatShortDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit' });
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
