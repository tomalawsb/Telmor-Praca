import {
  loginDemoAccount,
  loginToApp,
  registerAppAccount,
  resetAppPassword
} from '../local/authService.js';

export function LoginPage() {
  return `
    <main class="auth-page">
      <section class="auth-card">
        <div class="auth-brand">
          <span class="brand-mark">✣</span>
          <div>
            <h1>Telmor Praca</h1>
            <p>Lokalna aplikacja PWA uruchamiana z GitHub Pages.</p>
          </div>
        </div>

        <div class="auth-notice success">
          <strong>Tryb lokalny</strong>
          <span>Dane są zapisywane w tej przeglądarce. Program nie używa zewnętrznej bazy ani usług chmurowych.</span>
        </div>

        <form id="login-form" class="auth-form">
          <label for="login-email">Nazwa konta lokalnego</label>
          <input id="login-email" name="email" type="text" autocomplete="username" placeholder="np. Tomek" />

          <label for="login-password">Hasło lokalne</label>
          <input id="login-password" name="password" type="password" autocomplete="current-password" placeholder="Hasło tylko do tej przeglądarki" />

          <button class="primary-button" type="submit">Wejdź</button>
          <button id="local-login-button" class="secondary-button full-width" type="button">Wejdź lokalnie bez konfiguracji</button>
          <button id="register-button" class="text-button" type="button">Zapisz jako konto lokalne</button>
          <button id="reset-password-button" class="text-button" type="button">Informacja o haśle</button>
        </form>

        <div id="auth-message" class="auth-message" role="status"></div>
      </section>

      <aside class="auth-side desktop-only-block">
        <h2>Założenia tej wersji</h2>
        <ul>
          <li>Aplikacja jest zwykłym PWA pod GitHub Pages.</li>
          <li>Powiadomienia są tylko wpisami widocznymi w otwartej aplikacji.</li>
          <li>Dane robocze i dane Telmor zostają lokalnie w przeglądarce.</li>
        </ul>
      </aside>
    </main>
  `;
}

export function initLoginPage({ onAuthenticated }) {
  const form = document.querySelector('#login-form');
  const registerButton = document.querySelector('#register-button');
  const resetButton = document.querySelector('#reset-password-button');
  const localButton = document.querySelector('#local-login-button');
  const message = document.querySelector('#auth-message');

  const setMessage = (text, tone = 'info') => {
    if (!message) return;
    message.textContent = text;
    message.dataset.tone = tone;
  };

  const readCredentials = () => {
    const formData = new FormData(form);
    return {
      email: String(formData.get('email') || 'lokalnie@telmor-praca').trim(),
      password: String(formData.get('password') || '')
    };
  };

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    setMessage('Uruchamianie...', 'info');
    try {
      const credentials = readCredentials();
      if (!credentials.password) {
        loginDemoAccount(credentials.email || 'lokalnie@telmor-praca');
      } else {
        await loginToApp(credentials);
      }
      setMessage('Aplikacja uruchomiona lokalnie.', 'success');
      onAuthenticated?.();
    } catch (error) {
      setMessage(error.message, 'error');
    }
  });

  localButton?.addEventListener('click', () => {
    try {
      loginDemoAccount();
      setMessage('Aplikacja uruchomiona lokalnie.', 'success');
      onAuthenticated?.();
    } catch (error) {
      setMessage(error.message, 'error');
    }
  });

  registerButton?.addEventListener('click', async () => {
    setMessage('Zapisywanie konta lokalnego...', 'info');
    try {
      const credentials = readCredentials();
      if (!credentials.password) {
        loginDemoAccount(credentials.email || 'lokalnie@telmor-praca');
      } else {
        await registerAppAccount(credentials);
      }
      setMessage('Konto lokalne zapisane.', 'success');
      onAuthenticated?.();
    } catch (error) {
      setMessage(error.message, 'error');
    }
  });

  resetButton?.addEventListener('click', async () => {
    try {
      await resetAppPassword();
    } catch (error) {
      setMessage(error.message, 'info');
    }
  });
}
