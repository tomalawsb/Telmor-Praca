import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/responsive.css';

import { createAppShell } from './app.js';
import { initRouter } from './router.js';
import { LoginPage, initLoginPage } from './pages/LoginPage.js';
import { getAuthSession, onAuthChange } from './local/authService.js';
import { registerServiceWorker } from './utils/registerServiceWorker.js';

const root = document.querySelector('#app');

function renderApp() {
  const session = getAuthSession();

  if (!session) {
    root.innerHTML = LoginPage();
    initLoginPage({
      onAuthenticated: () => {
        window.location.hash = '#/dashboard';
        renderApp();
      }
    });
    return;
  }

  createAppShell(root);
  initRouter();
}

renderApp();
onAuthChange(renderApp);
registerServiceWorker();
