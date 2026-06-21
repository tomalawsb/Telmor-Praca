export const TELMOR_PORTAL = {
  name: 'play.telmor.pl SelfService',
  baseUrl: 'https://play.telmor.pl/SelfService/',
  sourceSystem: 'telmor-selfservice'
};

export const TELMOR_IMPORT_TYPES = {
  OPEN_ORDERS: 'open-orders',
  CLOSED_ORDERS: 'closed-orders',
  ORDER_DETAILS: 'order-details',
  AUTO: 'auto'
};

export const TELMOR_IMPORT_TYPE_LABELS = {
  [TELMOR_IMPORT_TYPES.OPEN_ORDERS]: 'Otwarte zlecenia',
  [TELMOR_IMPORT_TYPES.CLOSED_ORDERS]: 'Zamknięte zlecenia',
  [TELMOR_IMPORT_TYPES.ORDER_DETAILS]: 'Szczegóły zlecenia',
  [TELMOR_IMPORT_TYPES.AUTO]: 'Automatyczne rozpoznanie'
};
