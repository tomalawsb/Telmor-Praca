import { EmptyView } from './LoadingView.js';

export function OrderList({ orders = [], mode = 'open', compact = false } = {}) {
  const title = mode === 'closed' ? 'Zamknięte zlecenia' : 'Moje otwarte zlecenia';

  return `
    <section class="panel order-panel">
      <div class="panel-header">
        <h2>${title}</h2>
        <a href="${mode === 'closed' ? '#/orders-closed' : '#/orders-open'}">Wszystkie</a>
      </div>
      ${orders.length ? `
        <div class="order-list ${compact ? 'order-list-compact' : ''}">
          ${orders.map((order) => OrderRow(order)).join('')}
        </div>
        <div class="panel-footer">
          <span>1–${orders.length} z ${orders.length}</span>
          <a href="${mode === 'closed' ? '#/orders-closed' : '#/orders-open'}">Pokaż więcej</a>
        </div>
      ` : EmptyView({ title: 'Brak zleceń', text: 'Lista zostanie uzupełniona po synchronizacji albo po wgraniu danych demo.' })}
    </section>
  `;
}

export function OrderRow(order) {
  const id = order.id || order.number;
  return `
    <a href="#/order/${id}" class="order-row">
      <strong>#${order.number || id}</strong>
      <span class="order-client">${order.customerName || order.clientName || '-'}</span>
      <span class="order-city">${order.location || order.city || '-'}</span>
      <span class="order-topic">${order.shortTopic || order.topic || '-'}</span>
      <span class="order-date">${formatCompactDate(order.createdAt || order.registeredAt)}</span>
      <em class="pill pill-${order.statusTone || 'gray'}">${order.status || '-'}</em>
      <span class="row-arrow">›</span>
    </a>
  `;
}

export function MobileOrderCards({ orders = [], mode = 'open' } = {}) {
  if (!orders.length) {
    return EmptyView({ title: 'Brak zleceń', text: 'Dane pojawią się po synchronizacji albo po wgraniu danych demo.' });
  }

  return `
    <div class="mobile-order-cards">
      ${orders.map((order) => {
        const id = order.id || order.number;
        return `
          <a href="#/order/${id}" class="mobile-order-card">
            <div class="mobile-order-head">
              <strong>#${order.number || id}</strong>
              <em class="pill pill-${order.statusTone || 'gray'}">${order.status || '-'}</em>
            </div>
            <h3>${order.shortTopic || order.topic || '-'}</h3>
            <p>${order.customerName || order.clientName || '-'} · ${order.location || order.city || '-'}</p>
            <div class="mobile-order-meta">
              <span>◷ ${formatCompactDate(order.createdAt || order.registeredAt)}</span>
              <span>${order.priority || 'Standard'}</span>
            </div>
          </a>
        `;
      }).join('')}
    </div>
  `;
}

function formatCompactDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
