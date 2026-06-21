import { OrderList, MobileOrderCards } from '../components/OrderList.js';
import { getOrders } from '../data/orderRepository.js';

const FILTERS = [
  ['all', 'Wszystkie'],
  ['Nowe', 'Nowe'],
  ['W toku', 'W toku'],
  ['Oczekuje', 'Oczekuje'],
  ['voucher', 'Voucher'],
  ['missingVoucher', 'Brak vouchera'],
  ['urgent', 'Pilne'],
  ['review', 'Do sprawdzenia']
];

export async function OrdersPage(type = 'open', selectedFilter = 'all') {
  const isOpen = type === 'open';
  const rawOrders = await getOrders({ mode: isOpen ? 'open' : 'closed', limit: 100 });
  const orders = applyFilter(rawOrders, selectedFilter);

  return `
    <div class="page orders-page">
      <div class="page-title compact-title">
        <div>
          <h1>${isOpen ? 'Otwarte zlecenia' : 'Zamknięte zlecenia'}</h1>
          <p>Lista pokazuje tylko najważniejsze dane. Pełne informacje są w szczegółach zlecenia.</p>
        </div>
      </div>

      <div class="filter-row">
        <a href="#/orders-open" class="filter ${isOpen ? 'active' : ''}">Otwarte</a>
        <a href="#/orders-closed" class="filter ${!isOpen ? 'active' : ''}">Zamknięte</a>
        ${FILTERS.map(([key, label]) => `
          <a class="filter ${selectedFilter === key ? 'active-soft' : ''}" href="#/${isOpen ? 'orders-open' : 'orders-closed'}?filter=${encodeURIComponent(key)}">${label}</a>
        `).join('')}
      </div>

      <div class="list-summary-box">
        <strong>${orders.length}</strong>
        <span>Widoczne zlecenia po filtrze: ${filterLabel(selectedFilter)}</span>
      </div>

      <div class="desktop-only-block">
        ${OrderList({ orders, mode: isOpen ? 'open' : 'closed' })}
      </div>
      <div class="mobile-only">
        ${MobileOrderCards({ orders, mode: isOpen ? 'open' : 'closed' })}
      </div>
    </div>
  `;
}

function applyFilter(orders, filter) {
  if (!filter || filter === 'all') return orders;
  if (filter === 'voucher') {
    return orders.filter((order) => order.hasVoucher || String(order.voucher || '').toLowerCase().includes('voucher'));
  }
  if (filter === 'missingVoucher') {
    return orders.filter((order) => !order.hasVoucher && String(`${order.voucher || ''} ${order.topic || ''}`).toLowerCase().includes('voucher'));
  }
  if (filter === 'urgent') {
    return orders.filter((order) => order.workStatus === 'pilne' || order.priority === 'Pilne');
  }
  if (filter === 'review') {
    return orders.filter((order) => order.workStatus === 'do_sprawdzenia' || String(`${order.status || ''} ${order.topic || ''} ${order.description || ''}`).toLowerCase().match(/sprawd|kontrol|brak|problem|oczekuje/));
  }
  return orders.filter((order) => order.status === filter);
}

function filterLabel(filter) {
  const found = FILTERS.find(([key]) => key === filter);
  return found ? found[1] : 'Wszystkie';
}
