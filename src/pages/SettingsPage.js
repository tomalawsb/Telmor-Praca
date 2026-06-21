import { APP_CONFIG } from '../config/app.config.js';
import { seedDemoDataToLocalStore } from '../data/demoSeedService.js';
import { getAuthModeLabel, getUserEmail, signOutFromApp } from '../local/authService.js';
import {
  deleteTelmorCredentials,
  getTelmorCredentialStatus,
  isCredentialVaultSupported,
  saveTelmorCredentials,
  verifyTelmorCredentialsLocally
} from '../local/credentialVault.js';
import { clearTelmorSessionState, getTelmorSessionState, saveTelmorSessionState } from '../local/sessionStore.js';
import { getLocalStoreStatus } from '../local/localStoreStatus.js';

export function SettingsPage() {
  setTimeout(() => {
    initAccountPanel();
    initTelmorVaultPanel();
    initDemoDataPanel();
    initLocalDataSettingsPanel();
  }, 0);

  return `
    <div class="page">
      <div class="page-title compact-title">
        <div>
          <h1>Ustawienia</h1>
          <p>${APP_CONFIG.stageLabel}</p>
        </div>
      </div>
      <section class="settings-grid">
        <article class="panel">
          <h2>Konto aplikacji</h2>
          <p><strong>Zalogowano jako:</strong> ${escapeHtml(getUserEmail())}</p>
          <p><strong>Tryb:</strong> ${escapeHtml(getAuthModeLabel())}</p>
          <p class="muted">To konto istnieje tylko lokalnie w tej przeglądarce.</p>
          <button id="logout-button" class="danger-button" type="button">Wyjdź z aplikacji</button>
        </article>

        <article class="panel settings-wide-panel">
          <div class="panel-header settings-panel-header">
            <div>
              <h2>Lokalny sejf Telmor</h2>
              <p class="muted">Login i hasło Telmor są zapisywane tylko na tym urządzeniu.</p>
            </div>
            <span id="vault-status-badge" class="local-status-badge">Sprawdzanie</span>
          </div>

          <form id="telmor-credentials-form" class="settings-form">
            <label for="telmor-login">Login Telmor</label>
            <input id="telmor-login" name="login" type="text" autocomplete="username" />

            <label for="telmor-password">Hasło Telmor</label>
            <input id="telmor-password" name="password" type="password" autocomplete="current-password" />

            <label class="checkbox-row">
              <input id="remember-session" type="checkbox" checked />
              <span>Pamiętaj lokalny status sesji</span>
            </label>

            <div class="button-row">
              <button class="primary-button" type="submit">Zapisz lokalnie</button>
              <button id="load-telmor-credentials-button" class="secondary-button" type="button">Odczytaj</button>
              <button id="verify-telmor-credentials-button" class="secondary-button" type="button">Sprawdź sejf</button>
              <button id="delete-telmor-credentials-button" class="danger-button" type="button">Usuń dane</button>
            </div>
          </form>

          <div class="local-session-box">
            <p><strong>Status sesji:</strong> <span id="telmor-session-status">-</span></p>
            <div class="button-row">
              <button id="mark-session-active-button" class="secondary-button" type="button">Oznacz jako aktywną</button>
              <button id="clear-session-button" class="secondary-button" type="button">Wyczyść status sesji</button>
            </div>
          </div>
          <div id="telmor-vault-message" class="settings-message" role="status"></div>
        </article>

        <article class="panel">
          <h2>Dane lokalne</h2>
          <p class="muted">Ta wersja nie synchronizuje danych z zewnętrzną chmurą. Wszystko zostaje w przeglądarce.</p>
          <p><strong>Status:</strong> <span id="settings-local-data-status">Sprawdzanie...</span></p>
          <p><strong>Rekordy lokalne:</strong> <span id="settings-local-data-count">-</span></p>
          <p><strong>Kolekcje:</strong> <span id="settings-local-data-collections">-</span></p>
          <a href="#/local-data" class="secondary-button full-width text-center-link">Otwórz ekran danych lokalnych</a>
        </article>

        <article class="panel">
          <h2>Powiadomienia</h2>
          <p class="muted">Powiadomienia są tylko wpisami w aplikacji. Nie ma powiadomień w tle po zamknięciu programu.</p>
          <a href="#/notifications" class="secondary-button full-width text-center-link">Otwórz powiadomienia</a>
        </article>

        <article class="panel">
          <h2>Diagnostyka</h2>
          <p class="muted">Sprawdzenie gotowości PWA, lokalnej bazy, sejfu i konfiguracji pod GitHub Pages.</p>
          <a href="#/diagnostics" class="secondary-button full-width text-center-link">Otwórz diagnostykę</a>
        </article>

        <article class="panel demo-data-panel">
          <h2>Dane testowe</h2>
          <p class="muted">Wgrywa przykładowe zlecenia, klientów, historię i powiadomienia do lokalnej bazy przeglądarki.</p>
          <button id="seed-demo-data-button" class="primary-button" type="button">Wgraj dane demo lokalnie</button>
          <div id="demo-data-message" class="settings-message" role="status"></div>
        </article>

        <article class="panel">
          <h2>Informacje o aplikacji</h2>
          <p><strong>Wersja:</strong> ${APP_CONFIG.versionLabel}</p>
          <p><strong>Status:</strong> PWA lokalne pod GitHub Pages.</p>
          <p class="muted">Do publikacji użyj <code>npm run build</code>, a katalog <code>dist</code> można opublikować na GitHub Pages.</p>
        </article>
      </section>
    </div>
  `;
}

function initAccountPanel() {
  document.querySelector('#logout-button')?.addEventListener('click', () => {
    signOutFromApp();
  });
}

function initTelmorVaultPanel() {
  const form = document.querySelector('#telmor-credentials-form');
  const loginInput = document.querySelector('#telmor-login');
  const passwordInput = document.querySelector('#telmor-password');
  const rememberInput = document.querySelector('#remember-session');
  const loadButton = document.querySelector('#load-telmor-credentials-button');
  const verifyButton = document.querySelector('#verify-telmor-credentials-button');
  const deleteButton = document.querySelector('#delete-telmor-credentials-button');
  const message = document.querySelector('#telmor-vault-message');
  const statusBadge = document.querySelector('#vault-status-badge');
  const sessionStatus = document.querySelector('#telmor-session-status');
  const markSessionActiveButton = document.querySelector('#mark-session-active-button');
  const clearSessionButton = document.querySelector('#clear-session-button');

  const setMessage = (text, tone = 'info') => {
    if (!message) return;
    message.textContent = text;
    message.dataset.tone = tone;
  };

  const refreshSessionUi = () => {
    const state = getTelmorSessionState();
    if (sessionStatus) {
      sessionStatus.textContent = state.loggedIn
        ? `aktywny lokalnie, ostatnio: ${formatDateTime(state.lastCheckAt)}`
        : state.message;
    }
  };

  const refreshVaultUi = async () => {
    if (!isCredentialVaultSupported()) {
      statusBadge.textContent = 'Brak obsługi';
      statusBadge.dataset.tone = 'error';
      setMessage('Ta przeglądarka nie obsługuje pełnego lokalnego sejfu.', 'error');
      return;
    }

    const status = await getTelmorCredentialStatus();
    if (status.exists) {
      statusBadge.textContent = 'Zapisane lokalnie';
      statusBadge.dataset.tone = 'success';
      loginInput.value = status.loginHint || '';
      passwordInput.value = '';
      rememberInput.checked = status.rememberSession;
      setMessage(`Dane Telmor są zapisane lokalnie. Zapis: ${formatDateTime(status.savedAt)}.`, 'success');
    } else {
      statusBadge.textContent = 'Brak danych';
      statusBadge.dataset.tone = 'warning';
      setMessage('Brak zapisanych danych Telmor na tym urządzeniu.', 'info');
    }
  };

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    setMessage('Zapisywanie lokalne...', 'info');
    try {
      await saveTelmorCredentials({
        login: loginInput.value,
        password: passwordInput.value,
        rememberSession: rememberInput.checked
      });
      passwordInput.value = '';
      await refreshVaultUi();
      setMessage('Dane Telmor zapisane lokalnie na tym urządzeniu.', 'success');
    } catch (error) {
      setMessage(error.message, 'error');
    }
  });

  loadButton?.addEventListener('click', async () => {
    setMessage('Odczytywanie lokalne...', 'info');
    try {
      const result = await verifyTelmorCredentialsLocally();
      loginInput.value = result.login;
      rememberInput.checked = result.rememberSession;
      setMessage(`Odczyt poprawny. Hasło istnieje lokalnie, długość: ${result.passwordLength} znaków.`, 'success');
    } catch (error) {
      setMessage(error.message, 'error');
    }
  });

  verifyButton?.addEventListener('click', async () => {
    setMessage('Sprawdzanie lokalnego sejfu...', 'info');
    try {
      const result = await verifyTelmorCredentialsLocally();
      setMessage(`Sejf działa. Zapisany login: ${result.login}. Hasło nie jest pokazywane.`, 'success');
    } catch (error) {
      setMessage(error.message, 'error');
    }
  });

  deleteButton?.addEventListener('click', async () => {
    const confirmed = window.confirm('Usunąć lokalnie zapisane dane logowania Telmor z tego urządzenia?');
    if (!confirmed) return;

    setMessage('Usuwanie...', 'info');
    try {
      await deleteTelmorCredentials();
      loginInput.value = '';
      passwordInput.value = '';
      rememberInput.checked = true;
      await refreshVaultUi();
      setMessage('Dane Telmor zostały usunięte z lokalnego sejfu.', 'success');
    } catch (error) {
      setMessage(error.message, 'error');
    }
  });

  markSessionActiveButton?.addEventListener('click', () => {
    saveTelmorSessionState({ loggedIn: true, message: 'Sesja oznaczona lokalnie jako aktywna.' });
    refreshSessionUi();
  });

  clearSessionButton?.addEventListener('click', () => {
    clearTelmorSessionState();
    refreshSessionUi();
  });

  refreshSessionUi();
  refreshVaultUi().catch((error) => setMessage(error.message, 'error'));
}

function initDemoDataPanel() {
  const button = document.querySelector('#seed-demo-data-button');
  const message = document.querySelector('#demo-data-message');

  const setMessage = (text, tone = 'info') => {
    if (!message) return;
    message.textContent = text;
    message.dataset.tone = tone;
  };

  button?.addEventListener('click', async () => {
    const confirmed = window.confirm('Wgrać dane demonstracyjne do lokalnej bazy tej przeglądarki?');
    if (!confirmed) return;

    button.disabled = true;
    setMessage('Zapisywanie danych demo lokalnie...', 'info');
    try {
      const result = await seedDemoDataToLocalStore();
      setMessage(`Zapisano: ${result.orders} zleceń, ${result.customers} klientów, ${result.history} wpisów historii, ${result.notifications} powiadomienia.`, 'success');
    } catch (error) {
      setMessage(error.message, 'error');
    } finally {
      button.disabled = false;
    }
  });
}

async function initLocalDataSettingsPanel() {
  const statusEl = document.querySelector('#settings-local-data-status');
  const countEl = document.querySelector('#settings-local-data-count');
  const collectionsEl = document.querySelector('#settings-local-data-collections');
  if (!statusEl || !countEl || !collectionsEl) return;

  try {
    const status = await getLocalStoreStatus();
    statusEl.textContent = 'tylko lokalnie';
    countEl.textContent = `${status.totalRecords} wpisów`;
    collectionsEl.textContent = status.collections.map((item) => `${item.collectionName}: ${item.count}`).join(', ');
  } catch (error) {
    statusEl.textContent = error.message;
    countEl.textContent = '-';
    collectionsEl.textContent = '-';
  }
}

function formatDateTime(value) {
  if (!value) return 'brak daty';
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
