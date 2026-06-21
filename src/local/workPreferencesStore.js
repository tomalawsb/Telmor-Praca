const WORK_PREFS_KEY = 'telmor_praca_work_preferences_v1';
const RECENT_ORDERS_KEY = 'telmor_praca_recent_orders_v1';

const DEFAULT_PREFS = {
  savedFilters: [
    { id: 'open', label: 'Otwarte', route: '#/orders-open' },
    { id: 'new', label: 'Nowe', route: '#/orders-open?filter=Nowe' },
    { id: 'waiting', label: 'Oczekuje', route: '#/orders-open?filter=Oczekuje' },
    { id: 'voucher', label: 'Brak/kwestia vouchera', route: '#/orders-open?filter=missingVoucher' },
    { id: 'review', label: 'Do sprawdzenia', route: '#/orders-open?filter=review' }
  ],
  dashboardMode: 'compact',
  updatedAt: new Date().toISOString()
};

export function getWorkPreferences() {
  const stored = readJson(WORK_PREFS_KEY);
  return {
    ...DEFAULT_PREFS,
    ...(stored || {}),
    savedFilters: Array.isArray(stored?.savedFilters) && stored.savedFilters.length
      ? stored.savedFilters
      : DEFAULT_PREFS.savedFilters
  };
}

export function saveWorkPreferences(prefs = {}) {
  const next = {
    ...getWorkPreferences(),
    ...prefs,
    updatedAt: new Date().toISOString()
  };
  localStorage.setItem(WORK_PREFS_KEY, JSON.stringify(next));
  return next;
}

export function addRecentOrder(order) {
  if (!order?.id) return getRecentOrders();

  const existing = getRecentOrders().filter((item) => item.id !== order.id);
  const next = [
    {
      id: order.id,
      number: order.number || order.id,
      customerName: order.customerName || '',
      city: order.city || '',
      topic: order.topic || order.shortTopic || '',
      status: order.status || '',
      openedAt: new Date().toISOString()
    },
    ...existing
  ].slice(0, 12);

  localStorage.setItem(RECENT_ORDERS_KEY, JSON.stringify(next));
  return next;
}

export function getRecentOrders() {
  const list = readJson(RECENT_ORDERS_KEY);
  return Array.isArray(list) ? list : [];
}

export function clearRecentOrders() {
  localStorage.removeItem(RECENT_ORDERS_KEY);
}

function readJson(key) {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}
