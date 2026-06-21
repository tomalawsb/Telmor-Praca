import { saveNotification } from '../data/notificationRepository.js';

const LOCAL_NOTIFICATION_EVENT = 'telmor-local-notification';

export async function createLocalTestNotificationRecord() {
  const item = await saveNotification({
    id: `local-test-${Date.now()}`,
    type: 'local_test',
    title: 'Test lokalnego powiadomienia',
    body: 'To powiadomienie powstało tylko w otwartej aplikacji.',
    read: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  emitLocalNotification(item);
  return item;
}

export async function runLocalNotificationTest() {
  return createLocalTestNotificationRecord();
}

export function onLocalNotification(callback) {
  window.addEventListener(LOCAL_NOTIFICATION_EVENT, callback);
  return () => window.removeEventListener(LOCAL_NOTIFICATION_EVENT, callback);
}

function emitLocalNotification(item) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(LOCAL_NOTIFICATION_EVENT, { detail: item }));
}
