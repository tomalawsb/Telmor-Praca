import { getCustomers } from '../data/customerRepository.js';
import { prepareQuery, rankRecord, sortRankedResults } from './searchUtils.js';

const CUSTOMER_FIELD_WEIGHTS = {
  name: 12,
  phone: 12,
  city: 8,
  address: 8,
  street: 7,
  houseNumber: 4,
  lastOrderId: 5,
  lastTopic: 5
};

export async function searchCustomers(query, { limit = 50 } = {}) {
  const prepared = prepareQuery(query);
  const customers = await getCustomers({ limit: 300 });

  if (!prepared.raw) return customers.slice(0, limit).map((customer) => ({ ...customer, score: 0, reasons: [] }));

  return sortRankedResults(customers.map((customer) => {
    const ranking = rankRecord(customer, prepared, CUSTOMER_FIELD_WEIGHTS);
    return { ...customer, ...ranking };
  })).slice(0, limit);
}
