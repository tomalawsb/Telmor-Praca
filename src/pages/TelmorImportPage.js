import { getTelmorModuleStatus, testLocalTelmorCredentials } from '../telmor/telmorStatus.js';
import { TELMOR_IMPORT_TYPES, TELMOR_IMPORT_TYPE_LABELS } from '../telmor/telmorConfig.js';
import { analyzeTelmorSnapshot, getLastTelmorImportSummary, saveTelmorImportLocally } from '../telmor/telmorImportService.js';

let lastParseResult = null;

export function TelmorImportPage() {
  setTimeout(() => initTelmorImportPage(), 0);

  return `
    <div class="page telmor-sync-page">
      <div class="page-title compact-title">
        <div>
          <h1>Import Telmor</h1>
          <p>Ręczne wklejanie HTML albo tekstu z portalu Telmor. Dane są zapisywane tylko lokalnie.</p>
        </div>
        <a class="secondary-button" href="#/settings">Dane logowania</a>
      </div>

      <section class="telmor-grid">
        <article class="panel telmor-status-panel">
          <div class="panel-header settings-panel-header">
            <div>
              <h2>Status modułu</h2>
              <p class="muted">Hasło Telmor zostaje lokalnie na urządzeniu. Ta wersja nie wysyła danych do zewnętrznych usług.</p>
            </div>
            <span id="telmor-ready-badge" class="local-status-badge">Sprawdzanie</span>
          </div>
          <div id="telmor-status-list" class="status-list compact-status-list"></div>
          <div class="button-row">
            <button id="test-telmor-credentials-button" class="secondary-button" type="button">Sprawdź lokalny sejf</button>
          </div>
          <div id="telmor-status-message" class="settings-message" role="status"></div>
        </article>

        <article class="panel telmor-import-panel">
          <div class="panel-header settings-panel-header">
            <div>
              <h2>Ręczny import HTML / tekstu</h2>
              <p class="muted">Wklej źródło strony z Telmoru albo tekst skopiowany z listy. Parser spróbuje wyciągnąć zlecenia, klientów i historię.</p>
            </div>
          </div>

          <form id="telmor-import-form" class="settings-form telmor-import-form">
            <label for="telmor-import-type">Rodzaj danych</label>
            <select id="telmor-import-type" name="sourceType">
              ${Object.entries(TELMOR_IMPORT_TYPE_LABELS).map(([value, label]) => `<option value="${value}">${label}</option>`).join('')}
            </select>

            <label for="telmor-html-input">HTML albo tekst z portalu Telmor</label>
            <textarea id="telmor-html-input" name="input" rows="12" placeholder="Tu wklej HTML strony, tabelę zleceń albo tekst skopiowany z portalu..."></textarea>

            <div class="button-row">
              <button class="primary-button" type="submit">Analizuj dane</button>
              <button id="load-sample-telmor-button" class="secondary-button" type="button">Wstaw przykład</button>
              <button id="clear-telmor-input-button" class="secondary-button" type="button">Wyczyść</button>
              <button id="save-telmor-import-button" class="secondary-button" type="button" disabled>Zapisz wynik</button>
            </div>
          </form>
          <div id="telmor-import-message" class="settings-message" role="status"></div>
        </article>
      </section>

      <section class="panel telmor-preview-panel">
        <div class="panel-header settings-panel-header">
          <div>
            <h2>Podgląd wyniku</h2>
            <p class="muted">Wynik importu jest zapisywany lokalnie w tej przeglądarce. Nie ma zewnętrznej synchronizacji ani zapisu na serwer.</p>
          </div>
        </div>
        <div id="telmor-preview-summary" class="preview-summary empty-preview">Brak przeanalizowanych danych.</div>
        <div id="telmor-preview-table" class="telmor-preview-table"></div>
      </section>
    </div>
  `;
}

async function initTelmorImportPage() {
  const statusMessage = document.querySelector('#telmor-status-message');
  const importMessage = document.querySelector('#telmor-import-message');
  const form = document.querySelector('#telmor-import-form');
  const input = document.querySelector('#telmor-html-input');
  const typeSelect = document.querySelector('#telmor-import-type');
  const saveButton = document.querySelector('#save-telmor-import-button');
  const sampleButton = document.querySelector('#load-sample-telmor-button');
  const clearButton = document.querySelector('#clear-telmor-input-button');
  const testButton = document.querySelector('#test-telmor-credentials-button');

  await refreshTelmorStatus();
  await showLastImportSummary();

  testButton?.addEventListener('click', async () => {
    setMessage(statusMessage, 'Sprawdzanie lokalnego sejfu Telmor...', 'info');
    try {
      const result = await testLocalTelmorCredentials();
      setMessage(statusMessage, `Sejf działa. Login: ${result.login}. Hasło jest zapisane lokalnie i nie jest pokazywane.`, 'success');
      await refreshTelmorStatus();
    } catch (error) {
      setMessage(statusMessage, error.message, 'error');
    }
  });

  sampleButton?.addEventListener('click', () => {
    input.value = sampleTelmorHtml();
    typeSelect.value = TELMOR_IMPORT_TYPES.OPEN_ORDERS;
    setMessage(importMessage, 'Wstawiono przykładową tabelę do testu parsera.', 'info');
  });

  clearButton?.addEventListener('click', () => {
    input.value = '';
    lastParseResult = null;
    saveButton.disabled = true;
    renderPreview(null);
    setMessage(importMessage, 'Wyczyszczono pole importu.', 'info');
  });

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    setMessage(importMessage, 'Analizowanie danych Telmor...', 'info');
    try {
      lastParseResult = await analyzeTelmorSnapshot({
        input: input.value,
        sourceType: typeSelect.value
      });
      renderPreview(lastParseResult);
      saveButton.disabled = !lastParseResult.orders.length;
      const tone = lastParseResult.orders.length ? 'success' : 'warning';
      setMessage(importMessage, `Analiza zakończona. Zlecenia: ${lastParseResult.stats.orders}, klienci: ${lastParseResult.stats.customers}, historia: ${lastParseResult.stats.history}.`, tone);
    } catch (error) {
      saveButton.disabled = true;
      setMessage(importMessage, error.message, 'error');
    }
  });

  saveButton?.addEventListener('click', async () => {
    if (!lastParseResult) return;
    saveButton.disabled = true;
    setMessage(importMessage, 'Zapisywanie wyniku importu...', 'info');
    try {
      const result = await saveTelmorImportLocally(lastParseResult);
      setMessage(importMessage, result.message, result.saved ? 'success' : 'warning');
      await showLastImportSummary();
    } catch (error) {
      setMessage(importMessage, error.message, 'error');
    } finally {
      saveButton.disabled = false;
    }
  });
}

async function refreshTelmorStatus() {
  const badge = document.querySelector('#telmor-ready-badge');
  const list = document.querySelector('#telmor-status-list');
  if (!badge || !list) return;

  const status = await getTelmorModuleStatus();
  badge.textContent = status.readyForManualImport ? 'Import ręczny' : 'Wymaga sprawdzenia';
  badge.dataset.tone = status.readyForManualImport ? 'success' : 'warning';

  list.innerHTML = `
    ${statusItem('Sejf lokalny', status.vaultSupported ? 'obsługiwany' : 'brak obsługi', status.vaultSupported)}
    ${statusItem('Dane Telmor', status.credentialsSaved ? `zapisane lokalnie: ${escapeHtml(status.loginHint)}` : 'brak zapisanych danych', status.credentialsSaved)}
    ${statusItem('Sesja Telmor', status.sessionActive ? `aktywna lokalnie: ${formatDateTime(status.sessionLastCheckAt)}` : 'nieaktywna / niesprawdzona', status.sessionActive)}
    ${statusItem('Import ręczny', 'aktywny', true)}
    ${statusItem('Połączenie z serwerem', 'brak - aplikacja działa lokalnie', true)}
  `;
}

async function showLastImportSummary() {
  const summary = await getLastTelmorImportSummary();
  if (!summary) return;
  const target = document.querySelector('#telmor-preview-summary');
  if (!target) return;
  target.classList.remove('empty-preview');
  target.innerHTML = `
    <strong>Ostatni import:</strong>
    tryb: ${escapeHtml(summary.mode)},
    data: ${formatDateTime(summary.parsedAt)},
    zlecenia: ${Number(summary.stats?.orders || 0)},
    klienci: ${Number(summary.stats?.customers || 0)},
    historia: ${Number(summary.stats?.history || 0)}.
  `;
}

function renderPreview(result) {
  const summary = document.querySelector('#telmor-preview-summary');
  const table = document.querySelector('#telmor-preview-table');
  if (!summary || !table) return;

  if (!result) {
    summary.classList.add('empty-preview');
    summary.textContent = 'Brak przeanalizowanych danych.';
    table.innerHTML = '';
    return;
  }

  summary.classList.remove('empty-preview');
  summary.innerHTML = `
    <div class="preview-stat-row">
      <span>Zlecenia: <strong>${result.stats.orders}</strong></span>
      <span>Klienci: <strong>${result.stats.customers}</strong></span>
      <span>Historia: <strong>${result.stats.history}</strong></span>
      <span>Tabele HTML: <strong>${result.stats.tables}</strong></span>
    </div>
    ${result.warnings.length ? `<div class="preview-warnings">${result.warnings.map(escapeHtml).join('<br>')}</div>` : ''}
  `;

  if (!result.orders.length) {
    table.innerHTML = '<p class="muted">Brak zleceń do pokazania.</p>';
    return;
  }

  table.innerHTML = `
    <div class="desktop-table-wrapper">
      <table class="orders-table compact-orders-table">
        <thead>
          <tr>
            <th>Nr</th>
            <th>Klient</th>
            <th>Miasto</th>
            <th>Telefon</th>
            <th>Status</th>
            <th>Temat</th>
          </tr>
        </thead>
        <tbody>
          ${result.orders.slice(0, 20).map((order) => `
            <tr>
              <td>${escapeHtml(order.number)}</td>
              <td>${escapeHtml(order.customerName || '-')}</td>
              <td>${escapeHtml(order.city || '-')}</td>
              <td>${escapeHtml(order.phone || '-')}</td>
              <td>${escapeHtml(order.sourceStatus || order.status || '-')}</td>
              <td>${escapeHtml(order.topic || '-')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function statusItem(label, value, ok) {
  return `
    <div class="status-item">
      <span class="status-dot ${ok ? '' : 'status-dot-warning'}"></span>
      <div>
        <strong>${escapeHtml(label)}</strong>
        <small>${escapeHtml(value)}</small>
      </div>
    </div>
  `;
}

function setMessage(element, text, tone = 'info') {
  if (!element) return;
  element.textContent = text;
  element.dataset.tone = tone;
}

function formatDateTime(value) {
  if (!value) return 'brak';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('pl-PL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
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

function sampleTelmorHtml() {
  return `<table>
    <thead>
      <tr>
        <th>Nr zlecenia</th>
        <th>Status</th>
        <th>Data zlecenia</th>
        <th>Klient</th>
        <th>Telefon</th>
        <th>Miasto</th>
        <th>Adres</th>
        <th>Temat</th>
        <th>Voucher</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>104750</td>
        <td>Otwarte</td>
        <td>20.06.2026 08:30</td>
        <td>Jan Kowalski</td>
        <td>501 222 333</td>
        <td>Mielec</td>
        <td>ul. Testowa 12</td>
        <td>Internet - brak usługi</td>
        <td>VCH-2026-001</td>
      </tr>
      <tr>
        <td>104751</td>
        <td>W realizacji</td>
        <td>20.06.2026 09:15</td>
        <td>Anna Nowak</td>
        <td>502 333 444</td>
        <td>Czermin</td>
        <td>Czermin 10</td>
        <td>Telewizja - konfiguracja</td>
        <td>-</td>
      </tr>
    </tbody>
  </table>`;
}
