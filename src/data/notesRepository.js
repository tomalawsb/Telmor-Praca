import { COLLECTIONS } from '../config/collections.config.js';
import { orders as demoOrders } from './demoData.js';
import { createNoteModel } from './dataSchema.js';
import { fieldFilter, listUserDocuments, saveUserDocument } from '../local/localDataService.js';
import { listWithCacheFallback, saveWithOfflineQueue } from './repositorySyncHelpers.js';

export async function getNotesForOrder(orderId, { limit = 50 } = {}) {
  const demoOrder = demoOrders.find((item) => item.id === orderId) || demoOrders[0];
  return listWithCacheFallback({
    collectionName: COLLECTIONS.NOTES,
    loadFromLocalStore: () => listUserDocuments(COLLECTIONS.NOTES, {
      orderByField: 'updatedAt',
      direction: 'DESCENDING',
      limit,
      where: [fieldFilter('orderId', 'EQUAL', orderId)]
    }),
    loadDemo: () => (demoOrder.notes || []).map((item) => ({ ...item, orderId: demoOrder.id, customerId: demoOrder.customerId || '' })),
    modelFactory: createNoteModel,
    filter: (note) => note.orderId === orderId
  });
}

export async function saveNote(note) {
  const model = createNoteModel(note);
  return saveWithOfflineQueue({
    collectionName: COLLECTIONS.NOTES,
    documentId: model.id,
    data: model,
    saveDirect: () => saveUserDocument(COLLECTIONS.NOTES, model.id, model)
  });
}
