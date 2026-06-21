import { EmptyView } from '../components/LoadingView.js';
import { MobileOrderCards, OrderRow } from '../components/OrderList.js';
import { runGlobalSearch } from '../search/searchService.js';

const TYPE_FILTERS = [
  ['all', 'Wszystko'],
  ['orders', 'Zlecenia'],
  ['customers', 'Klienci'],
  ['history', 'Historia'],
  ['attachments', 'Załączniki']
];

const STATUS_FILTERS = [
  ['all', 'Wszystkie'],
  ['open', 'Otwarte'],
  ['closed', 'Zamknięte'],
  ['voucher', 'Z voucherem'],
  ['needsVoucher', 'Voucher do sprawdzenia']
];

export async function SearchPage(params = new URLSearchParams()) {
  const query = params.get('q') || '';
  const type = params.get('type') || 'all';
  const status = params.get('status') || 'all';
  const results = await runGlobalSearch(query, { type, status });

  return `
    <div class="page search-page">
      <div class="page-title compact-title">
        <div>
          <h1>Wyszukiwarka</h1>
          <p>Jedno miejsce do szukania po numerze zlecenia, kliencie, telefonie, mieście, statusie, voucherze, historii i załącznikach.</p>
        </div>
      </div>

      <section class="panel search-main-panel">
        <form id="search-page-form" class="search-main-form" autocomplete="off">
          <span aria-hidden="true">⌕</span>
          <input id="search-page-input" name="q" type="search" value="${escapeHtml(query)}" placeholder="Wpisz numer, klienta, telefon, miasto, temat, voucher..." autofocus />
          <button class="primary-button" type="submit">Szukaj</button>
        </form>

        <div class="search-filter-group">
          <span>Zakres:</span>
          <div class="chip-row no-margin">
            ${TYPE_FILTERS.map(([value, label]) => filterLink({ q: query, type: value, status, active: value === type, label })).join('')}
          </div>
        </div>

        <div class="search-filter-group">
          <span>Status zleceń:</span>
          <div class="chip-row no-margin">
            ${STATUS_FILTERS.map(([value, label]) => filterLink({ q: query, type, status: value, active: value === status, label })).join('')}
          </div>
        </div>
      </section>

      ${query ? renderResultsSummary(query, results) : renderStartHints()}

      ${query ? renderResults(results, type) : ''}
    </div>
  `;
}

export function initSearchPage() {
  const form = document.querySelector('#search-page-form');
  const input = document.querySelector('#search-page-input');
  if (!form || !input) return;

  input.focus({ preventScroll: true });
  input.setSelectionRange(input.value.length, input.value.length);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
    const value = input.value.trim();

    if (value) params.set('q', value);
    else params.delete('q');

    window.location.hash = `#/search?${params.toString()}`;
  });
}

function renderResultsSummary(query, results) {
  return `
    <section class="search-summary-grid">
      <article class="stat-card stat-blue">
        <div><span>Wyniki razem</span><strong>${results.total}</strong><small>${escapeHtml(query)}</small></div><i>⌕</i>
      </article>
      <article class="stat-card stat-orange">
        <div><span>Zlecenia</span><strong>${results.orders.length}</strong><small>numery, statusy, vouchery</small></div><i>▣</i>
      </article>
      <article class="stat-card stat-purple">
        <div><span>Klienci</span><strong>${results.customers.length}</strong><small>nazwy, telefony, adresy</small></div><i>♙</i>
      </article>
      <article class="stat-card stat-green">
        <div><span>Pliki</span><strong>${results.attachments.length}</strong><small>vouchery i załączniki</small></div><i>▧</i>
      </article>
    </section>
  `;
}

function renderStartHints() {
  return `
    <section class="search-start-grid">
      <article class="panel">
        <h2>Co można wpisać?</h2>
        <div class="hint-grid">
          ${['104750', 'Mielec', '731021410', 'voucher', 'internet', 'Wolak', 'awaria', 'zamknięte'].map((item) => `
            <a href="#/search?q=${encodeURIComponent(item)}" class="hint-chip">${escapeHtml(item)}</a>
          `).join('')}
        </div>
      </article>
      <article class="panel">
        <h2>Jak działa etap 7?</h2>
        <p class="muted">Na razie wyszukiwarka działa po danych dostępnych w aplikacji: danych demo albo lokalnego cache. Szuka lokalnie po pobranych rekordach, z normalizacją polskich znaków, telefonu i prostą tolerancją literówek.</p>
      </article>
    </section>
  `;
}

function renderResults(results, type) {
  if (!results.total) {
    return EmptyView({ title: 'Brak wyników', text: 'Zmień frazę, usuń filtr albo wpisz sam numer telefonu/zlecenia.' });
  }

  return `
    <div class="search-results-stack">
      ${type === 'all' || type === 'orders' ? renderOrderResults(results.orders) : ''}
      ${type === 'all' || type === 'customers' ? renderCustomerResults(results.customers) : ''}
      ${type === 'all' || type === 'history' ? renderHistoryResults(results.history) : ''}
      ${type === 'all' || type === 'attachments' ? renderAttachmentResults(results.attachments) : ''}
    </div>
  `;
}

function renderOrderResults(orders) {
  if (!orders.length) return '';
  return `
    <section class="panel search-result-panel">
      <div class="panel-header">
        <h2>Zlecenia</h2>
        <span class="result-count">${orders.length}</span>
      </div>
      <div class="desktop-only-block order-list">
        ${orders.map((order) => SearchOrderRow(order)).join('')}
      </div>
      <div class="mobile-only">
        ${MobileOrderCards({ orders, mode: 'search' })}
      </div>
    </section>
  `;
}

function SearchOrderRow(order) {
  return `
    <div class="search-result-row-wrap">
      ${OrderRow(order)}
      ${renderReasons(order.reasons)}
    </div>
  `;
}

function renderCustomerResults(customers) {
  if (!customers.length) return '';
  return `
    <section class="panel search-result-panel">
      <div class="panel-header">
        <h2>Klienci</h2>
        <span class="result-count">${customers.length}</span>
      </div>
      <div class="customer-list">
        ${customers.map((customer) => `
          <article class="customer-card search-customer-card">
            <div>
              <strong>${escapeHtml(customer.name)}</strong>
              <p>${escapeHtml(customer.address || customer.city || '-')}</p>
              <small>Ostatnie zlecenie #${escapeHtml(customer.lastOrderId || customer.lastOrder || '-')} · ${escapeHtml(customer.lastTopic || '-')}</small>
              ${renderReasons(customer.reasons)}
            </div>
            <div class="customer-actions">
              <a href="tel:${String(customer.phone || '').replaceAll(' ', '')}" aria-label="Zadzwoń">☎</a>
              <span>${escapeHtml(customer.phone || '-')}</span>
            </div>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

function renderHistoryResults(history) {
  if (!history.length) return '';
  return `
    <section class="panel search-result-panel">
      <div class="panel-header">
        <h2>Historia</h2>
        <span class="result-count">${history.length}</span>
      </div>
      <div class="timeline search-timeline">
        ${history.map((item) => `
          <article>
            <span class="timeline-dot"></span>
            <div>
              <strong><a href="#/order/${escapeAttr(item.orderId)}?tab=history">#${escapeHtml(item.orderId)} · ${escapeHtml(item.title || 'Wpis historii')}</a></strong>
              <small>${escapeHtml(item.date || formatDate(item.createdAt))} · ${escapeHtml(item.author || '-')}</small>
              <p>${escapeHtml(item.text || '')}</p>
              ${renderReasons(item.reasons)}
            </div>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}


function renderAttachmentResults(attachments) {
  if (!attachments.length) return '';
  return `
    <section class="panel search-result-panel">
      <div class="panel-header">
        <h2>Załączniki</h2>
        <span class="result-count">${attachments.length}</span>
      </div>
      <div class="attachment-list">
        ${attachments.map((file) => `
          <article>
            <span class="file-icon">▧</span>
            <div>
              <strong><a href="#/order/${escapeAttr(file.orderId)}?tab=attachments">${escapeHtml(file.displayName || file.fileName || '-')}</a></strong>
              <small>#${escapeHtml(file.orderId)} · ${escapeHtml(file.fileKind || 'Plik')} · ${escapeHtml(file.sizeLabel || '-')}</small>
              ${renderReasons(file.reasons)}
            </div>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

function renderReasons(reasons = []) {
  if (!Array.isArray(reasons) || !reasons.length) return '';
  return `<div class="match-reasons">${reasons.map((reason) => `<span>${escapeHtml(reason)}</span>`).join('')}</div>`;
}

function filterLink({ q, type, status, active, label }) {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (type && type !== 'all') params.set('type', type);
  if (status && status !== 'all') params.set('status', status);
  return `<a class="chip ${active ? 'active' : ''}" href="#/search?${params.toString()}">${escapeHtml(label)}</a>`;
}

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeAttr(value = '') {
  return encodeURIComponent(String(value));
}
