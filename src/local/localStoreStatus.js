import { COLLECTIONS } from '../config/collections.config.js';
import { getLocalStoreSummary } from './localStore.js';

export const LOCAL_COLLECTIONS = Object.freeze([
  COLLECTIONS.ORDERS,
  COLLECTIONS.CUSTOMERS,
  COLLECTIONS.ORDER_HISTORY,
  COLLECTIONS.ATTACHMENTS,
  COLLECTIONS.NOTES,
  COLLECTIONS.NOTIFICATIONS
]);

export async function getLocalStoreStatus() {
  const collections = await getLocalStoreSummary(LOCAL_COLLECTIONS);
  const totalRecords = collections.reduce((sum, item) => sum + Number(item.count || 0), 0);

  return {
    localOnly: true,
    online: typeof navigator === 'undefined' ? true : navigator.onLine,
    collections,
    totalRecords,
    updatedAt: new Date().toISOString()
  };
}
