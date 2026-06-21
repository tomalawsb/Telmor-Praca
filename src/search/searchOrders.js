import { getOrders } from '../data/orderRepository.js';
import { ORDER_STATUS } from '../config/collections.config.js';
import { prepareQuery, rankRecord, sortRankedResults } from './searchUtils.js';

const ORDER_FIELD_WEIGHTS = {
  number: 14,
  customerName: 10,
  clientName: 10,
  phone: 11,
  city: 7,
  location: 7,
  address: 6,
  status: 5,
  topic: 8,
  shortTopic: 8,
  voucher: 9,
  assignee: 3,
  description: 3
};

export async function searchOrders(query, { status = 'all', limit = 60 } = {}) {
  const prepared = prepareQuery(query);
  const orders = await getOrders({ mode: 'all', limit: 300 });

  const filtered = orders.filter((order) => {
    if (status === 'open') return order.status !== ORDER_STATUS.CLOSED && order.status !== 'Zamknięte';
    if (status === 'closed') return order.status === ORDER_STATUS.CLOSED || order.status === 'Zamknięte';
    if (status === 'voucher') return Boolean(order.hasVoucher) || String(order.voucher || '').trim().length > 3;
    if (status === 'needsVoucher') return !order.hasVoucher && String(order.voucher || '').toLowerCase().includes('sprawdzenia');
    return true;
  });

  if (!prepared.raw) return filtered.slice(0, limit).map((order) => ({ ...order, score: 0, reasons: [] }));

  return sortRankedResults(filtered.map((order) => {
    const ranking = rankRecord(order, prepared, ORDER_FIELD_WEIGHTS);
    return { ...order, ...ranking };
  })).slice(0, limit);
}
