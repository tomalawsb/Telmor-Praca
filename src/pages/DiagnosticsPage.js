import { getLastDiagnosticReport, runDiagnostics, formatDiagnosticReportText } from '../diagnostics/diagnosticsService.js';

export function DiagnosticsPage() {
  const report = getLastDiagnosticReport();
  setTimeout(() => initDiagnosticsPage(), 0);

  return `
    <div class="page diagnostics-page">
      <div class="page-title compact-title">
        <div>
          <h1>Diagnostyka</h1>
          <p>Diagnostyka lokalnego PWA: baza przeglądarki, sejf Telmor, service worker i gotowość pod GitHub Pages.</p>
        </div>
        <div class="desktop-only title-actions">
          <button id="run-diagnostics-button-top" class="primary-button" type="button">Uruchom testy</button>
        </div>
      </div>

      <section class="diagnostics-grid">
        <article class="panel diagnostics-control-panel">
          <h2>Centrum testów</h2>
          <p class="muted">Ten ekran nie zmienia danych roboczych. Sprawdza konfigurację aplikacji i pokazuje, co trzeba poprawić przed publikacją na GitHub Pages.</p>
          <div class="button-row">
            <button id="run-diagnostics-button" class="primary-button" type="button">Uruchom testy</button>
            <button id="export-diagnostics-button" class="secondary-button" type="button">Eksport TXT</button>
            <button id="copy-diagnostics-button" class="secondary-button" type="button">Kopiuj raport</button>
          </div>
          <div id="diagnostics-message" class="settings-message" role="status"></div>
        </article>

        <article class="panel">
          <h2>Wynik ogólny</h2>
          <div id="diagnostics-summary" class="diagnostics-summary">
            ${report ? renderSummary(report.summary) : renderNoReport()}
          </div>
        </article>
      </section>

      <section class="panel diagnostics-results-panel">
        <div class="panel-header">
          <h2>Lista testów</h2>
          <small id="diagnostics-date">${report ? `Ostatni test: ${formatDateTime(report.endedAt)}` : 'Brak wykonanego testu'}</small>
        </div>
        <div id="diagnostics-results" class="diagnostics-results">
          ${report ? renderTests(report.tests) : '<p class="muted">Uruchom testy, żeby zobaczyć szczegóły.</p>'}
        </div>
      </section>
    </div>
  `;
}

export function initDiagnosticsPage() {
  const runButtons = [
    document.querySelector('#run-diagnostics-button'),
    document.querySelector('#run-diagnostics-button-top')
  ].filter(Boolean);
  const exportButton = document.querySelector('#export-diagnostics-button');
  const copyButton = document.querySelector('#copy-diagnostics-button');
  const message = document.querySelector('#diagnostics-message');
  const summary = document.querySelector('#diagnostics-summary');
  const results = document.querySelector('#diagnostics-results');
  const date = document.querySelector('#diagnostics-date');

  const setMessage = (text, tone = 'info') => {
    if (!message) return;
    message.textContent = text;
    message.dataset.tone = tone;
  };

  const setBusy = (busy) => {
    runButtons.forEach((button) => { button.disabled = busy; });
    if (exportButton) exportButton.disabled = busy;
    if (copyButton) copyButton.disabled = busy;
  };

  const refresh = (report) => {
    if (summary) summary.innerHTML = renderSummary(report.summary);
    if (results) results.innerHTML = renderTests(report.tests);
    if (date) date.textContent = `Ostatni test: ${formatDateTime(report.endedAt)}`;
  };

  const run = async () => {
    setBusy(true);
    setMessage('Wykonywanie diagnostyki...', 'info');
    try {
      const report = await runDiagnostics();
      refresh(report);
      const tone = report.summary.error ? 'error' : (report.summary.warning ? 'warning' : 'success');
      setMessage(`Gotowe. OK: ${report.summary.ok}, ostrzeżenia: ${report.summary.warning}, błędy: ${report.summary.error}.`, tone);
    } catch (error) {
      setMessage(error.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  runButtons.forEach((button) => button.addEventListener('click', run));

  exportButton?.addEventListener('click', () => {
    const report = getLastDiagnosticReport();
    if (!report) {
      setMessage('Najpierw uruchom diagnostykę.', 'warning');
      return;
    }
    const text = formatDiagnosticReportText(report);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `telmor-diagnostyka-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setMessage('Raport TXT został przygotowany.', 'success');
  });

  copyButton?.addEventListener('click', async () => {
    const report = getLastDiagnosticReport();
    if (!report) {
      setMessage('Najpierw uruchom diagnostykę.', 'warning');
      return;
    }
    try {
      await navigator.clipboard.writeText(formatDiagnosticReportText(report));
      setMessage('Raport skopiowany do schowka.', 'success');
    } catch (error) {
      setMessage('Nie udało się skopiować raportu. Użyj eksportu TXT.', 'error');
    }
  });
}

function renderSummary(summary = {}) {
  return `
    <div class="diagnostics-summary-grid">
      ${summaryBox('OK', summary.ok || 0, 'success')}
      ${summaryBox('Ostrzeżenia', summary.warning || 0, 'warning')}
      ${summaryBox('Błędy', summary.error || 0, 'error')}
      ${summaryBox('Pominięte', summary.skipped || 0, 'neutral')}
    </div>
  `;
}

function renderNoReport() {
  return '<p class="muted">Brak raportu. Uruchom diagnostykę.</p>';
}

function summaryBox(label, value, tone) {
  return `<div class="diagnostics-summary-box" data-tone="${tone}"><strong>${value}</strong><span>${label}</span></div>`;
}

function renderTests(tests = []) {
  if (!tests.length) return '<p class="muted">Brak wyników testów.</p>';

  return tests.map((test) => `
    <article class="diagnostic-test-card" data-status="${escapeHtml(test.status)}">
      <div class="diagnostic-test-head">
        <div>
          <strong>${escapeHtml(test.name)}</strong>
          <p>${escapeHtml(test.message)}</p>
        </div>
        <span>${labelStatus(test.status)}</span>
      </div>
      ${(test.details || []).length ? `
        <dl class="diagnostic-detail-list">
          ${test.details.map((item) => `<div><dt>${escapeHtml(item.label)}</dt><dd>${escapeHtml(item.value)}</dd></div>`).join('')}
        </dl>
      ` : ''}
    </article>
  `).join('');
}

function labelStatus(status) {
  if (status === 'ok') return 'OK';
  if (status === 'warning') return 'UWAGA';
  if (status === 'error') return 'BŁĄD';
  if (status === 'skipped') return 'POMINIĘTO';
  return status;
}

function formatDateTime(value) {
  if (!value) return 'brak daty';
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
