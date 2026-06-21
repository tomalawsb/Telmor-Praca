import { saveOrder } from './orderRepository.js';

export const WORK_STATUS = Object.freeze({
  NORMAL: 'normalne',
  URGENT: 'pilne',
  REVIEW: 'do_sprawdzenia',
  READY: 'gotowe'
});

export function getWorkStatusLabel(value) {
  if (value === WORK_STATUS.URGENT) return 'Pilne';
  if (value === WORK_STATUS.REVIEW) return 'Do sprawdzenia';
  if (value === WORK_STATUS.READY) return 'Gotowe roboczo';
  return 'Normalne';
}

export async function setOrderWorkStatus(order, workStatus) {
  return saveOrder({
    ...order,
    workStatus,
    updatedAt: new Date().toISOString()
  });
}

export async function toggleOrderFavorite(order) {
  return saveOrder({
    ...order,
    isFavorite: !Boolean(order.isFavorite),
    updatedAt: new Date().toISOString()
  });
}
