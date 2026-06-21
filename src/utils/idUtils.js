import { compactText } from '../search/normalizeText.js';

export function makeSafeId(value, fallbackPrefix = 'item') {
  const normalized = compactText(value);
  if (normalized) return normalized.slice(0, 80);
  return `${fallbackPrefix}-${Date.now()}`;
}

export function makeOrderId(orderNumber) {
  return makeSafeId(orderNumber, 'order');
}

export function makeCustomerId({ name = '', phone = '', city = '' } = {}) {
  const phonePart = compactText(phone);
  const base = phonePart || `${name}-${city}`;
  return makeSafeId(base, 'customer');
}

export function makeNoteId({ orderId = '', customerId = '', createdAt = '' } = {}) {
  return makeSafeId(`${orderId}-${customerId}-${createdAt || Date.now()}`, 'note');
}

export function makeAttachmentId({ orderId = '', fileName = '', createdAt = '' } = {}) {
  return makeSafeId(`${orderId}-${fileName}-${createdAt || Date.now()}`, 'attachment');
}
