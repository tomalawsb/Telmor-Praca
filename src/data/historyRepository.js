import { COLLECTIONS } from '../config/collections.config.js';
import { getAllHistoryItems, orders as demoOrders } from './demoData.js';
import { createHistoryModel } from './dataSchema.js';
import { fieldFilter, listUserDocuments, saveUserDocument } from '../local/localDataService.js';
import { listWithCacheFallback, saveWithOfflineQueue } from './repositorySyncHelpers.js';

export async function getOrderHistory(orderId, { limit = 100 } = {}) {
  const demoOrder = demoOrders.find((item) => item.id === orderId) || demoOrders[0];
  return listWithCacheFallback({
    collectionName: COLLECTIONS.ORDER_HISTORY,
    loadFromLocalStore: () => listUserDocuments(COLLECTIONS.ORDER_HISTORY, {
      orderByField: 'createdAt',
      direction: 'DESCENDING',
      limit,
      where: [fieldFilter('orderId', 'EQUAL', orderId)]
    }),
    loadDemo: () => (demoOrder.history || []).map((item) => ({ ...item, orderId: demoOrder.id })),
    modelFactory: createHistoryModel,
    filter: (entry) => entry.orderId === orderId
  });
}

export async function getHistoryEntries({ limit = 100 } = {}) {
  return listWithCacheFallback({
    collectionName: COLLECTIONS.ORDER_HISTORY,
    loadFromLocalStore: () => listUserDocuments(COLLECTIONS.ORDER_HISTORY, {
      orderByField: 'createdAt',
      direction: 'DESCENDING',
      limit
    }),
    loadDemo: () => getAllHistoryItems().slice(0, limit),
    modelFactory: createHistoryModel
  });
}

export async function saveHistoryEntry(entry) {
  const model = createHistoryModel(entry);
  return saveWithOfflineQueue({
    collectionName: COLLECTIONS.ORDER_HISTORY,
    documentId: model.id,
    data: model,
    saveDirect: () => saveUserDocument(COLLECTIONS.ORDER_HISTORY, model.id, model)
  });
}
