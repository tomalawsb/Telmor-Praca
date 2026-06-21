import { searchCustomers } from './searchCustomers.js';
import { searchHistory } from './searchHistory.js';
import { searchAttachments } from './searchAttachments.js';
import { searchOrders } from './searchOrders.js';

export async function runGlobalSearch(query, { type = 'all', status = 'all' } = {}) {
  const [orders, customers, history, attachments] = await Promise.all([
    type === 'all' || type === 'orders' ? searchOrders(query, { status, limit: 60 }) : Promise.resolve([]),
    type === 'all' || type === 'customers' ? searchCustomers(query, { limit: 50 }) : Promise.resolve([]),
    type === 'all' || type === 'history' ? searchHistory(query, { limit: 50 }) : Promise.resolve([]),
    type === 'all' || type === 'attachments' ? searchAttachments(query, { limit: 50 }) : Promise.resolve([])
  ]);

  return {
    orders,
    customers,
    history,
    attachments,
    total: orders.length + customers.length + history.length + attachments.length
  };
}
