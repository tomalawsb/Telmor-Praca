export const COLLECTIONS = Object.freeze({
  USERS: 'users',
  ORDERS: 'orders',
  CUSTOMERS: 'customers',
  ORDER_HISTORY: 'orderHistory',
  ATTACHMENTS: 'attachments',
  NOTES: 'notes',
  NOTIFICATIONS: 'notifications'
});

export const ORDER_STATUS = Object.freeze({
  NEW: 'Nowe',
  IN_PROGRESS: 'W toku',
  WAITING: 'Oczekuje',
  CLOSED: 'Zamknięte',
  CANCELLED: 'Anulowane'
});

export const ORDER_STATUS_TONE = Object.freeze({
  [ORDER_STATUS.NEW]: 'blue',
  [ORDER_STATUS.IN_PROGRESS]: 'orange',
  [ORDER_STATUS.WAITING]: 'purple',
  [ORDER_STATUS.CLOSED]: 'green',
  [ORDER_STATUS.CANCELLED]: 'gray'
});

export const SOURCE_SYSTEM = Object.freeze({
  TELMOR: 'telmor',
  MANUAL: 'manual',
  DEMO: 'demo'
});
