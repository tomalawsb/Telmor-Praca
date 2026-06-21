import { getSyncDashboardStatus, keepCloudConflict, keepLocalConflict, performFullSync, pullFromCloud, pushPendingQueue, registerCurrentDevice } from '../sync/deviceSyncService.js';
import { clearConflicts } from '../sync/conflictResolver.js';
import { clearPendingQueue, getPendingQueue } from '../sync/syncQueue.js';

export async function SyncPage() {
  const status = await getSyncDashboardStatus();

  setTimeout(() => initSyncPage(), 0);

  return `
    <div class="page sync-page">
      <div class="page-title compact-title">
        <div>
          <h1>Synchronizacja</h1>
          <p>Ekran pokazuje lokalny cache urządzenia i dane zapisane w tej przeglądarce.</p>
        </div>
        <div class="desktop-only title-actions">
          <button id="sync-full-button" class="primary-button" type="button">Sprawdź lokalnie</button>
        </div>
      </div>

      <section class="sync-summary-grid">
        ${summaryCard('Połączenie', status.localOnly ? 'Tryb lokalny' : 'Zapis zewnętrzny', status.localOnly ? 'Dane zostają w tej przeglądarce.' : 'Dane mogą być synchronizowane zewnętrznie.', status.remoteActive ? 'green' : 'orange')}
        ${summaryCard('Internet', status.online ? 'Online' : 'Offline', status.online ? 'Aplikacja może działać online i offline.' : 'Dane nadal zostają lokalnie.', status.online ? 'green' : 'orange')}
        ${summaryCard('Kolejka', String(status.queue.count), status.queue.count ? 'Zmiany są zapisane lokalnie.' : 'Brak oczekujących zmian.', status.queue.count ? 'orange' : 'green')}
        ${summaryCard('Konflikty', String(status.conflicts.length), status.conflicts.length ? 'Wymagana decyzja użytkownika.' : 'Brak konfliktów.', status.conflicts.length ? 'red' : 'green')}
      </section>

      <section class="sync-grid">
        <article class="panel sync-device-panel">
          <div class="panel-header">
            <h2>To urządzenie</h2>
            <span class="local-status-badge" data-tone="${status.remoteActive ? 'success' : 'warning'}">${status.remoteActive ? 'może synchronizować' : 'tylko lokalnie'}</span>
          </div>
          <dl class="sync-definition-list">
            <div><dt>ID</dt><dd>${escapeHtml(status.device.deviceId)}</dd></div>
            <div><dt>Nazwa</dt><dd>${escapeHtml(status.device.name)}</dd></div>
            <div><dt>Platforma</dt><dd>${escapeHtml(status.device.platform)}</dd></div>
            <div><dt>Ostatnio</dt><dd>${formatDateTime(status.device.lastSeenAt)}</dd></div>
          </dl>
          <div class="button-row">
            <button id="register-device-button" class="secondary-button" type="button">Zarejestruj urządzenie</button>
            <button id="pull-cloud-button" class="secondary-button" type="button">Odśwież lokalnie</button>
            <button id="push-queue-button" class="secondary-button" type="button">Wyczyść kolejkę</button>
          </div>
          <div id="sync-message" class="settings-message" role="status"></div>
        </article>

        <article class="panel">
          <div class="panel-header">
            <h2>Lokalny cache danych</h2>
            <small>Ostatnie dane trzymane na urządzeniu do pracy offline.</small>
          </div>
          <div class="cache-table-wrap">
            <table class="orders-table compact-orders-table sync-cache-table">
              <thead>
                <tr><th>Kolekcja</th><th>Rekordy</th><th>Ostatni zapis cache</th></tr>
              </thead>
              <tbody>
                ${status.cache.map((item) => `
                  <tr>
                    <td><strong>${escapeHtml(item.collectionName)}</strong></td>
                    <td>${item.count}</td>
                    <td>${formatDateTime(item.cachedAt)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      <section class="sync-grid lower-sync-grid">
        <article class="panel">
          <div class="panel-header">
            <h2>Kolejka zmian lokalnych</h2>
            <span class="result-count">${status.queue.count}</span>
          </div>
          <div id="queue-list" class="sync-list muted">Ładowanie kolejki...</div>
          <div class="button-row">
            <button id="refresh-queue-button" class="secondary-button" type="button">Odśwież</button>
            <button id="clear-queue-button" class="danger-button" type="button">Wyczyść kolejkę</button>
          </div>
        </article>

        <article class="panel">
          <div class="panel-header">
            <h2>Konflikty lokalne</h2>
            <span class="result-count">${status.conflicts.length}</span>
          </div>
          <div id="conflict-list" class="sync-list">
            ${renderConflicts(status.conflicts)}
          </div>
          <div class="button-row">
            <button id="clear-conflicts-button" class="danger-button" type="button">Wyczyść konflikty</button>
          </div>
        </article>
      </section>
    </div>
  `;
}

function initSyncPage() {
  const message = document.querySelector('#sync-message');
  const setMessage = (text, tone = 'info') => {
    if (!message) return;
    message.textContent = text;
    message.dataset.tone = tone;
  };

  const runAction = async (button, label, action) => {
    if (button) button.disabled = true;
    setMessage(`${label}...`, 'info');
    try {
      const result = await action();
      setMessage(formatActionResult(label, result), 'success');
      await refreshQueueList();
      setTimeout(() => window.dispatchEvent(new HashChangeEvent('hashchange')), 350);
    } catch (error) {
      setMessage(error.message, 'error');
    } finally {
      if (button) button.disabled = false;
    }
  };

  document.querySelector('#sync-full-button')?.addEventListener('click', (event) => {
    runAction(event.currentTarget, 'Sprawdź lokalnie', performFullSync);
  });

  document.querySelector('#register-device-button')?.addEventListener('click', (event) => {
    runAction(event.currentTarget, 'Rejestracja urządzenia', registerCurrentDevice);
  });

  document.querySelector('#pull-cloud-button')?.addEventListener('click', (event) => {
    runAction(event.currentTarget, 'Odświeżanie lokalne', pullFromCloud);
  });

  document.querySelector('#push-queue-button')?.addEventListener('click', (event) => {
    runAction(event.currentTarget, 'Czyszczenie kolejki', pushPendingQueue);
  });

  document.querySelector('#refresh-queue-button')?.addEventListener('click', () => refreshQueueList());

  document.querySelector('#clear-queue-button')?.addEventListener('click', async () => {
    const confirmed = window.confirm('Wyczyścić lokalną kolejkę zmian?');
    if (!confirmed) return;
    await clearPendingQueue();
    await refreshQueueList();
    setMessage('Kolejka lokalna została wyczyszczona.', 'success');
  });

  document.querySelector('#clear-conflicts-button')?.addEventListener('click', async () => {
    const confirmed = window.confirm('Wyczyścić listę konfliktów bez rozstrzygania?');
    if (!confirmed) return;
    await clearConflicts();
    setMessage('Konflikty zostały wyczyszczone lokalnie.', 'success');
    setTimeout(() => window.dispatchEvent(new HashChangeEvent('hashchange')), 250);
  });

  document.querySelectorAll('[data-conflict-action]').forEach((button) => {
    button.addEventListener('click', async () => {
      const conflictId = button.dataset.conflictId;
      const action = button.dataset.conflictAction;
      runAction(button, action === 'local' ? 'Zapis lokalnej wersji' : 'Zostawienie drugiej wersji', () => {
        return action === 'local' ? keepLocalConflict(conflictId) : keepCloudConflict(conflictId);
      });
    });
  });

  refreshQueueList();
}

async function refreshQueueList() {
  const container = document.querySelector('#queue-list');
  if (!container) return;
  const queue = await getPendingQueue();
  if (!queue.length) {
    container.innerHTML = '<p class="muted">Brak zmian w kolejce lokalnej.</p>';
    return;
  }

  container.innerHTML = queue.map((item) => `
    <article class="sync-list-item">
      <div>
        <strong>${escapeHtml(item.collectionName)} / ${escapeHtml(item.documentId)}</strong>
        <small>${escapeHtml(item.reason || 'Zmiana zapisana lokalnie.')}</small>
        ${item.lastError ? `<small class="sync-error">${escapeHtml(item.lastError)}</small>` : ''}
      </div>
      <time>${formatDateTime(item.createdAt)}</time>
    </article>
  `).join('');
}

function renderConflicts(conflicts = []) {
  if (!conflicts.length) return '<p class="muted">Brak konfliktów lokalnych.</p>';
  return conflicts.map((item) => `
    <article class="sync-list-item conflict-item">
      <div>
        <strong>${escapeHtml(item.collectionName)} / ${escapeHtml(item.documentId)}</strong>
        <small>${escapeHtml(item.reason)}</small>
        <small>Lokalnie: ${formatDateTime(item.localDoc?.updatedAt)} · Druga wersja: ${formatDateTime(item.remoteDoc?.updatedAt)}</small>
      </div>
      <div class="conflict-actions">
        <button class="secondary-button" type="button" data-conflict-action="cloud" data-conflict-id="${escapeHtml(item.conflictId)}">Zostaw drugą wersję</button>
        <button class="primary-button" type="button" data-conflict-action="local" data-conflict-id="${escapeHtml(item.conflictId)}">Nadpisz lokalną</button>
      </div>
    </article>
  `).join('');
}

function summaryCard(label, value, note, tone) {
  return `
    <article class="sync-summary-card ${tone}">
      <span>${label}</span>
      <strong>${escapeHtml(value)}</strong>
      <small>${escapeHtml(note)}</small>
    </article>
  `;
}

function formatActionResult(label, result) {
  if (result?.message) return result.message;
  if (Array.isArray(result)) return `${label}: ${result.map((item) => `${item.collectionName}: ${item.count}`).join(', ')}`;
  if (result?.pushed && result?.pulled) {
    return `Sprawdź lokalnie zakończona. Wysłano: ${result.pushed.sent}/${result.pushed.attempted}, konflikty: ${result.pushed.conflicts}, pobrano kolekcji: ${result.pulled.length}.`;
  }
  if (result?.attempted !== undefined) {
    return `Kolejka lokalna: ${result.attempted}. Konflikty: ${result.conflicts}. Pozostało: ${result.left}.`;
  }
  return `${label} zakończone.`;
}

function formatDateTime(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
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
