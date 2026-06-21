import { getOrders } from '../data/orderRepository.js';
import { getAttachmentsForOrder } from '../data/attachmentRepository.js';
import { prepareQuery, rankRecord, sortRankedResults } from './searchUtils.js';

const ATTACHMENT_WEIGHTS = {
  orderId: 6,
  fileName: 8,
  displayName: 8,
  fileKind: 5,
  description: 4,
  sourceUrl: 2
};

export async function searchAttachments(query, { limit = 50 } = {}) {
  const prepared = prepareQuery(query);
  if (!prepared.raw) return [];

  const orders = await getOrders({ mode: 'all', limit: 250 });
  const lists = await Promise.all(orders.map((order) => getAttachmentsForOrder(order.id)));
  const attachments = lists.flat();

  return sortRankedResults(attachments.map((attachment) => ({
    ...attachment,
    ...rankRecord(attachment, prepared, ATTACHMENT_WEIGHTS)
  }))).slice(0, limit);
}
