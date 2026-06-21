import { COLLECTIONS } from '../config/collections.config.js';
import { notifications as demoNotifications } from './demoData.js';
import { createNotificationModel } from './dataSchema.js';
import { listUserDocuments, saveUserDocument } from '../local/localDataService.js';
import { listWithCacheFallback, saveWithOfflineQueue } from './repositorySyncHelpers.js';

export async function getNotifications({ limit = 50 } = {}) {
  return listWithCacheFallback({
    collectionName: COLLECTIONS.NOTIFICATIONS,
    loadFromLocalStore: () => listUserDocuments(COLLECTIONS.NOTIFICATIONS, { orderByField: 'createdAt', direction: 'DESCENDING', limit }),
    loadDemo: () => demoNotifications,
    modelFactory: createNotificationModel
  });
}

export async function saveNotification(notification) {
  const model = createNotificationModel(notification);
  return saveWithOfflineQueue({
    collectionName: COLLECTIONS.NOTIFICATIONS,
    documentId: model.id,
    data: model,
    saveDirect: () => saveUserDocument(COLLECTIONS.NOTIFICATIONS, model.id, model)
  });
}
