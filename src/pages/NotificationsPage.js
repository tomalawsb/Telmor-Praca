import { getNotifications } from '../data/notificationRepository.js';
import { EmptyView } from '../components/LoadingView.js';
import { runLocalNotificationTest } from '../local/notificationService.js';

export async function NotificationsPage() {
  const notifications = await getNotifications({ limit: 50 });
  setTimeout(() => initNotificationsPage(), 0);

  return `
    <div class="page">
      <div class="page-title compact-title">
        <div>
          <h1>Powiadomienia</h1>
          <p>Powiadomienia działają tylko w otwartej aplikacji i są zapisywane lokalnie.</p>
        </div>
        <button id="local-notification-test-button" class="primary-button" type="button">Test lokalny</button>
      </div>
      <section class="panel">
        ${notifications.length ? `
          <div class="notification-list full">
            ${notifications.map((item) => `
              <article>
                <span class="dot ${item.tone || toneByType(item.type)}"></span>
                <div><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.body || item.note || '')}</small></div>
                <time>${formatDate(item.createdAt)}</time>
              </article>
            `).join('')}
          </div>
        ` : EmptyView({ title: 'Brak powiadomień', text: 'Powiadomienia pojawią się po lokalnym teście albo po zmianach wykonanych w otwartej aplikacji.' })}
        <div id="notifications-message" class="settings-message" role="status"></div>
      </section>
    </div>
  `;
}

function initNotificationsPage() {
  const button = document.querySelector('#local-notification-test-button');
  const message = document.querySelector('#notifications-message');
  button?.addEventListener('click', async () => {
    button.disabled = true;
    if (message) {
      message.textContent = 'Tworzenie lokalnego powiadomienia...';
      message.dataset.tone = 'info';
    }
    try {
      await runLocalNotificationTest();
      if (message) {
        message.textContent = 'Dodano lokalne powiadomienie. Odświeżono listę.';
        message.dataset.tone = 'success';
      }
      setTimeout(() => window.dispatchEvent(new HashChangeEvent('hashchange')), 250);
    } catch (error) {
      if (message) {
        message.textContent = error.message;
        message.dataset.tone = 'error';
      }
    } finally {
      button.disabled = false;
    }
  });
}

function toneByType(type) {
  if (type === 'message') return 'orange';
  if (type === 'status_changed') return 'purple';
  if (type === 'local_test') return 'blue';
  return 'blue';
}

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit' });
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
