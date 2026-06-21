import { COLLECTIONS } from '../config/collections.config.js';
import { getCustomers as getDemoCustomers } from './demoData.js';
import { createCustomerModel } from './dataSchema.js';
import { listUserDocuments, readUserDocument, saveUserDocument } from '../local/localDataService.js';
import { listWithCacheFallback, readWithCacheFallback, saveWithOfflineQueue } from './repositorySyncHelpers.js';

export async function getCustomers({ limit = 100 } = {}) {
  return listWithCacheFallback({
    collectionName: COLLECTIONS.CUSTOMERS,
    loadFromLocalStore: () => listUserDocuments(COLLECTIONS.CUSTOMERS, { orderByField: 'updatedAt', limit }),
    loadDemo: () => getDemoCustomers(),
    modelFactory: createCustomerModel
  });
}

export async function getCustomer(customerId) {
  const demoCustomers = getDemoCustomers().map(createCustomerModel);
  return readWithCacheFallback({
    collectionName: COLLECTIONS.CUSTOMERS,
    documentId: customerId,
    loadFromLocalStore: () => readUserDocument(COLLECTIONS.CUSTOMERS, customerId),
    loadDemo: () => demoCustomers.find((customer) => customer.id === customerId) || demoCustomers[0],
    modelFactory: createCustomerModel
  });
}

export async function saveCustomer(customer) {
  const model = createCustomerModel(customer);
  return saveWithOfflineQueue({
    collectionName: COLLECTIONS.CUSTOMERS,
    documentId: model.id,
    data: model,
    saveDirect: () => saveUserDocument(COLLECTIONS.CUSTOMERS, model.id, model)
  });
}
