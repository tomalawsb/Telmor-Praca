import { APP_CONFIG } from '../config/app.config.js';
import { getAuthModeLabel, getAuthSession, getUserEmail } from '../local/authService.js';
import { getTelmorCredentialStatus, isCredentialVaultSupported } from '../local/credentialVault.js';
import { isIndexedDbAvailable, localDbSet, localDbGet, localDbDelete } from '../local/localDb.js';
import { getSyncDashboardStatus } from '../sync/deviceSyncService.js';

const DIAGNOSTIC_KEY = 'diagnostic_probe';

export async function runDiagnostics() {
  const startedAt = new Date().toISOString();
  const tests = [];

  tests.push(checkAppInfo());
  tests.push(checkAuthState());
  tests.push(await safeTest('Lokalna baza IndexedDB', testIndexedDb));
  tests.push(await safeTest('Lokalny sejf Telmor', testTelmorVault));
  tests.push(checkBrowserCapabilities());
  tests.push(await safeTest('Dane lokalne', testSyncState));
  tests.push(checkGithubPagesReadiness());

  const summary = buildSummary(tests);
  const report = {
    appName: APP_CONFIG.appName,
    version: APP_CONFIG.versionLabel,
    stage: APP_CONFIG.stageLabel,
    userEmail: getUserEmail(),
    authMode: getAuthModeLabel(),
    startedAt,
    endedAt: new Date().toISOString(),
    summary,
    tests
  };

  localStorage.setItem('telmor_last_diagnostic_report_v1', JSON.stringify(report));
  return report;
}

export function getLastDiagnosticReport() {
  const raw = localStorage.getItem('telmor_last_diagnostic_report_v1');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem('telmor_last_diagnostic_report_v1');
    return null;
  }
}

export function formatDiagnosticReportText(report) {
  if (!report) return 'Brak raportu diagnostycznego.';

  const lines = [
    'Telmor Praca - raport diagnostyczny',
    `Wersja: ${report.version}`,
    `Etap: ${report.stage}`,
    `Konto: ${report.userEmail}`,
    `Tryb: ${report.authMode}`,
    `Start: ${report.startedAt}`,
    `Koniec: ${report.endedAt}`,
    `Wynik: OK ${report.summary.ok}, ostrzeżenia ${report.summary.warning}, błędy ${report.summary.error}, pominięte ${report.summary.skipped}`,
    '',
    'TESTY:'
  ];

  for (const test of report.tests) {
    lines.push(`- [${test.status.toUpperCase()}] ${test.name}: ${test.message}`);
    for (const detail of test.details || []) {
      lines.push(`  * ${detail.label}: ${detail.value}`);
    }
  }

  return lines.join('\n');
}

function checkAppInfo() {
  return result('ok', 'Informacje aplikacji', 'Aplikacja działa i może wykonać diagnostykę.', [
    detail('Nazwa', APP_CONFIG.appName),
    detail('Wersja', APP_CONFIG.versionLabel),
    detail('Etap', APP_CONFIG.stageLabel),
    detail('Adres', typeof window === 'undefined' ? 'brak' : window.location.href),
    detail('Online', typeof navigator === 'undefined' ? 'nieznane' : (navigator.onLine ? 'tak' : 'nie'))
  ]);
}

function checkAuthState() {
  const session = getAuthSession();
  if (!session) {
    return result('warning', 'Konto aplikacji', 'Aplikacja nie ma jeszcze aktywnej sesji lokalnej.', [
      detail('Tryb', 'brak sesji')
    ]);
  }

  return result('ok', 'Konto aplikacji', 'Działa lokalna sesja aplikacji.', [
    detail('Konto', session.email || 'lokalne'),
    detail('Tryb', session.mode || 'local'),
    detail('Sesja od', session.signedInAt || 'brak')
  ]);
}

async function testIndexedDb() {
  if (!isIndexedDbAvailable()) {
    return result('error', 'Lokalna baza IndexedDB', 'IndexedDB nie jest dostępne w tej przeglądarce.', []);
  }

  const value = { ok: true, at: new Date().toISOString() };
  await localDbSet(DIAGNOSTIC_KEY, value);
  const readBack = await localDbGet(DIAGNOSTIC_KEY);
  await localDbDelete(DIAGNOSTIC_KEY);

  if (!readBack?.ok) {
    return result('error', 'Lokalna baza IndexedDB', 'Zapis testowy nie został poprawnie odczytany.', []);
  }

  return result('ok', 'Lokalna baza IndexedDB', 'Zapis, odczyt i usunięcie testowego rekordu działa.', [
    detail('Obsługa', 'tak')
  ]);
}

async function testTelmorVault() {
  if (!isCredentialVaultSupported()) {
    return result('warning', 'Lokalny sejf Telmor', 'Przeglądarka nie obsługuje pełnego lokalnego sejfu.', []);
  }

  const status = await getTelmorCredentialStatus();
  return result(status.exists ? 'ok' : 'warning', 'Lokalny sejf Telmor', status.exists ? 'Dane Telmor są zapisane lokalnie na tym urządzeniu.' : 'Brak lokalnie zapisanych danych Telmor na tym urządzeniu.', [
    detail('Zapis istnieje', status.exists ? 'tak' : 'nie'),
    detail('Login', status.loginHint || 'brak'),
    detail('Zapamiętaj sesję', status.rememberSession ? 'tak' : 'nie'),
    detail('Zapisano', status.savedAt || 'brak')
  ]);
}

function checkBrowserCapabilities() {
  const serviceWorker = typeof navigator !== 'undefined' && 'serviceWorker' in navigator;
  const notification = typeof Notification !== 'undefined';
  const secure = typeof window === 'undefined' ? false : window.isSecureContext;
  const missing = [];
  if (!serviceWorker) missing.push('serviceWorker');
  if (!notification) missing.push('Notification');
  if (!secure) missing.push('HTTPS/secure context');

  return result(missing.length ? 'warning' : 'ok', 'Możliwości PWA/przeglądarki', missing.length ? `Braki: ${missing.join(', ')}.` : 'Przeglądarka ma podstawowe mechanizmy PWA.', [
    detail('Service Worker', serviceWorker ? 'tak' : 'nie'),
    detail('Notification', notification ? 'tak' : 'nie'),
    detail('Secure context', secure ? 'tak' : 'nie'),
    detail('Zgoda na powiadomienia', notification ? Notification.permission : 'brak obsługi')
  ]);
}

async function testSyncState() {
  const status = await getSyncDashboardStatus();
  return result('ok', 'Dane lokalne', 'Odczytano lokalny stan urządzenia i cache.', [
    detail('Tryb lokalny', status.localOnly ? 'tak' : 'nie'),
    detail('Online', status.online ? 'tak' : 'nie'),
    detail('Urządzenie', `${status.device.name} / ${status.device.deviceId}`),
    detail('Kolejka', `${status.queue.count} zmian`),
    detail('Konflikty', `${status.conflicts.length}`),
    detail('Kolekcje cache', status.cache.map((item) => `${item.collectionName}:${item.count}`).join(', '))
  ]);
}

function checkGithubPagesReadiness() {
  const serviceWorkerPath = '/service-worker.js';
  return result('ok', 'GitHub Pages / PWA', 'Projekt jest przygotowany jako statyczne PWA.', [
    detail('Build', 'npm run build'),
    detail('Katalog publikacji', 'dist'),
    detail('Service Worker', serviceWorkerPath),
    detail('Zewnętrzna baza', 'brak'),
    detail('Powiadomienia w tle', 'brak')
  ]);
}

async function safeTest(name, fn) {
  try {
    return await fn();
  } catch (error) {
    return result('error', name, error.message || 'Nieznany błąd diagnostyki.', [
      detail('Typ błędu', error.name || 'Error')
    ]);
  }
}

function buildSummary(tests) {
  return tests.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, { ok: 0, warning: 0, error: 0, skipped: 0 });
}

function result(status, name, message, details = []) {
  return { status, name, message, details, checkedAt: new Date().toISOString() };
}

function detail(label, value) {
  return { label, value: String(value ?? '') };
}
