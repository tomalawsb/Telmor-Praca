import { StatCard } from '../components/StatCard.js';
import { OrderList, MobileOrderCards } from '../components/OrderList.js';
import { getOrders } from '../data/orderRepository.js';
import { getNotifications } from '../data/notificationRepository.js';

export async function DashboardPage() {
  const [openOrders, closedOrders, notifications] = await Promise.all([
    getOrders({ mode: 'open', limit: 20 }),
    getOrders({ mode: 'closed', limit: 20 }),
    getNotifications({ limit: 5 })
  ]);

  const stats = buildStats(openOrders, closedOrders);

  return `
    <div class="page dashboard-page">
      <div class="page-title dashboard-title">
        <div>
          <h1>Dzień dobry, Tomasz!</h1>
          <p>Na tym etapie aplikacja pracuje już przez repozytoria danych. Gdy lokalna baza jest pusta, używa danych demo.</p>
        </div>
        <div class="desktop-only title-actions">
          <a href="#/orders-open" class="secondary-button">Zlecenia</a>
          <a href="#/settings" class="primary-button-link">Ustawienia</a>
        </div>
      </div>

      <section class="stats-grid">
        ${StatCard({ label: 'Otwarte', value: stats.open, note: 'Do realizacji', tone: 'blue', icon: '▣' })}
        ${StatCard({ label: 'Nowe', value: stats.newOrders, note: 'Wymagają uwagi', tone: 'orange', icon: '↺' })}
        ${StatCard({ label: 'Vouchery', value: stats.vouchers, note: 'Do kontroli/obsługi', tone: 'purple', icon: '◆' })}
        ${StatCard({ label: 'Zamknięte', value: stats.closed, note: 'W danych lokalnych/demo', tone: 'green', icon: '✓' })}
      </section>

      <section class="mobile-section-title mobile-only">
        <h2>Najważniejsze zlecenia</h2>
        <a href="#/orders-open">Wszystkie</a>
      </section>
      <div class="mobile-only">
        ${MobileOrderCards({ orders: openOrders.slice(0, 5), mode: 'open' })}
      </div>

      <section class="content-grid desktop-only-grid">
        ${OrderList({ orders: openOrders.slice(0, 8), mode: 'open' })}
        <aside class="side-stack">
          <section class="panel notifications-panel">
            <div class="panel-header">
              <h2>Powiadomienia</h2>
              <a href="#/notifications">Wszystkie</a>
            </div>
            <div class="notification-list">
              ${notifications.map((item) => `
                <article>
                  <span class="dot ${item.tone || notificationTone(item.type)}"></span>
                  <div><strong>${item.title}</strong><small>${item.body || item.note || ''}</small></div>
                  <time>${formatTime(item.createdAt)}</time>
                </article>
              `).join('')}
            </div>
          </section>

          <section class="panel quick-panel">
            <div class="panel-header"><h2>Szybkie filtry</h2></div>
            <div class="chip-row">
              <a class="chip active" href="#/orders-open">Wszystkie</a>
              <a class="chip" href="#/orders-open?status=Nowe">Nowe</a>
              <a class="chip" href="#/orders-open?status=W%20toku">W toku</a>
              <a class="chip" href="#/orders-open?status=Oczekuje">Oczekuje</a>
              <a class="chip green" href="#/orders-closed">Zamknięte</a>
            </div>
          </section>
        </aside>
      </section>
    </div>
  `;
}

function buildStats(openOrders, closedOrders) {
  const all = [...openOrders, ...closedOrders];
  return {
    open: openOrders.length,
    closed: closedOrders.length,
    newOrders: all.filter((order) => order.status === 'Nowe').length,
    vouchers: all.filter((order) => order.hasVoucher || String(order.voucher || '').toLowerCase().includes('voucher')).length
  };
}

function formatTime(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit' });
}

function notificationTone(type) {
  if (type === 'message') return 'orange';
  if (type === 'status_changed') return 'purple';
  return 'blue';
}
