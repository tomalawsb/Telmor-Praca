import { getLocalStoreStatus } from '../local/localStoreStatus.js';

export async function LocalDataPage() {
  const status = await getLocalStoreStatus();
  setTimeout(() => initLocalDataPage(), 0);

  return `
    <div class="page local-data-page">
      <div class="page-title compact-title">
        <div>
          <h1>Dane lokalne</h1>
          <p>Podgląd danych zapisanych w tej przeglądarce. Brak Firebase, chmury i synchronizacji zewnętrznej.</p>
        </div>
        <button id="refresh-local-data-button" class="primary-button" type="button">Odśwież</button>
      </div>

      <section class="sync-summary-grid">
        ${summaryCard('Tryb pracy', 'Lokalny', 'Dane zostają w tej przeglądarce.', 'green')}
        ${summaryCard('Rekordy', String(status.totalRecords), 'Łączna liczba lokalnych wpisów.', 'blue')}
        ${summaryCard('Internet', status.online ? 'Online' : 'Offline', 'Aplikacja nie wymaga połączenia do lokalnych danych.', status.online ? 'green' : 'orange')}
      </section>

      <section class="panel">
        <div class="panel-header">
          <h2>Kolekcje lokalne</h2>
          <small>Ostatnie sprawdzenie: ${formatDateTime(status.updatedAt)}</small>
        </div>
        <div class="desktop-table-wrapper">
          <table class="orders-table compact-orders-table sync-cache-table">
            <thead>
              <tr>
                <th>Dane</th>
                <th>Liczba wpisów</th>
                <th>Ostatni zapis</th>
              </tr>
            </thead>
            <tbody>
              ${status.collections.map((item) => `
                <tr>
                  <td>${escapeHtml(labelCollection(item.collectionName))}</td>
                  <td>${Number(item.count || 0)}</td>
                  <td>${formatDateTime(item.savedAt)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <p class="muted local-data-note">Ten ekran niczego nie wysyła. Służy tylko do kontroli lokalnej bazy PWA.</p>
      </section>
    </div>
  `;
}

function initLocalDataPage() {
  document.querySelector('#refresh-local-data-button')?.addEventListener('click', () => {
    window.location.reload();
  });
}

function summaryCard(label, value, description, tone) {
  return `
    <article class="sync-summary-card ${tone}">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
      <small>${escapeHtml(description)}</small>
    </article>
  `;
}

function labelCollection(name = '') {
  const labels = {
    orders: 'Zlecenia',
    customers: 'Klienci',
    orderHistory: 'Historia',
    attachments: 'Załączniki',
    notes: 'Notatki',
    notifications: 'Powiadomienia'
  };
  return labels[name] || name;
}

function formatDateTime(value) {
  if (!value) return 'brak';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('pl-PL', {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
  });
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
