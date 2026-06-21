import { COLLECTIONS, ORDER_STATUS } from '../config/collections.config.js';
import { getClosedOrders as getDemoClosedOrders, getOpenOrders as getDemoOpenOrders, getOrderById as getDemoOrderById, orders as demoOrders } from './demoData.js';
import { createOrderModel } from './dataSchema.js';
import { listUserDocuments, readUserDocument, saveUserDocument } from '../local/localDataService.js';
import { listLocalFirst, readLocalFirst, saveLocalDocument } from './repositoryLocalHelpers.js';

export async function getOrders({ mode = 'all', limit = 50 } = {}) {
  const loadFromLocalStore = async () => {
    return listUserDocuments(COLLECTIONS.ORDERS, { orderByField: 'updatedAt', limit });
  };

  return listLocalFirst({
    collectionName: COLLECTIONS.ORDERS,
    loadFromLocalStore,
    loadDemo: () => getDemoOrders(mode),
    modelFactory: createOrderModel,
    filter: (order) => {
      if (mode === 'open') return order.status !== ORDER_STATUS.CLOSED;
      if (mode === 'closed') return order.status === ORDER_STATUS.CLOSED;
      return true;
    }
  });
}

export async function getOrder(orderId) {
  return readLocalFirst({
    collectionName: COLLECTIONS.ORDERS,
    documentId: orderId,
    loadFromLocalStore: () => readUserDocument(COLLECTIONS.ORDERS, orderId),
    loadDemo: () => getDemoOrderById(orderId),
    modelFactory: createOrderModel
  });
}

export async function saveOrder(order) {
  const model = createOrderModel(order);
  return saveLocalDocument({
    collectionName: COLLECTIONS.ORDERS,
    documentId: model.id,
    data: model,
    saveDirect: () => saveUserDocument(COLLECTIONS.ORDERS, model.id, model)
  });
}

export async function saveOrders(orders) {
  const saved = [];
  for (const order of orders) {
    saved.push(await saveOrder(order));
  }
  return saved;
}

function getDemoOrders(mode) {
  if (mode === 'open') return getDemoOpenOrders();
  if (mode === 'closed') return getDemoClosedOrders();
  return demoOrders;
}
