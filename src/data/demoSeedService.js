import { orders, notifications, getAllHistoryItems, getCustomers } from './demoData.js';
import { saveOrders } from './orderRepository.js';
import { saveCustomer } from './customerRepository.js';
import { saveHistoryEntry } from './historyRepository.js';
import { saveNotification } from './notificationRepository.js';
import { saveSyncState } from './syncStateRepository.js';

export async function seedDemoDataToLocalStore() {
  const savedOrders = await saveOrders(orders);
  const savedCustomers = [];
  const savedHistory = [];
  const savedNotifications = [];

  for (const customer of getCustomers()) savedCustomers.push(await saveCustomer(customer));
  for (const entry of getAllHistoryItems()) savedHistory.push(await saveHistoryEntry(entry));
  for (const notification of notifications) savedNotifications.push(await saveNotification(notification));

  await saveSyncState({
    id: 'main',
    lastFullSyncAt: new Date().toISOString(),
    lastError: ''
  });

  return {
    orders: savedOrders.length,
    customers: savedCustomers.length,
    history: savedHistory.length,
    notifications: savedNotifications.length
  };
}

