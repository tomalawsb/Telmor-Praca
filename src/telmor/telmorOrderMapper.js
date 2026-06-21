import { ORDER_STATUS } from '../config/collections.config.js';
import { createCustomerModel, createHistoryModel, createOrderModel } from '../data/dataSchema.js';
import { makeCustomerId, makeOrderId } from '../utils/idUtils.js';
import { TELMOR_PORTAL } from './telmorConfig.js';

export function mapTelmorRowToOrder(row = {}, options = {}) {
  const number = firstText(row, ['number', 'nr', 'orderNumber', 'zlecenie', 'numerZlecenia', 'id']) || fallbackNumber(row);
  const status = mapTelmorStatus(firstText(row, ['status', 'stan']) || options.defaultStatus || '');
  const customerName = firstText(row, ['customerName', 'klient', 'abonent', 'name', 'nazwa']);
  const phone = firstText(row, ['phone', 'telefon', 'tel', 'contact']);
  const city = firstText(row, ['city', 'miasto', 'miejscowosc', 'lokalizacja']);
  const address = firstText(row, ['address', 'adres', 'ulica']);
  const topic = firstText(row, ['topic', 'temat', 'opis', 'usluga', 'sprawa', 'problem']) || options.defaultTopic || 'Zlecenie Telmor';
  const voucher = firstText(row, ['voucher', 'bon', 'kod', 'kupon']);
  const registeredAt = normalizeDate(firstText(row, ['registeredAt', 'createdAt', 'dataZlecenia', 'data', 'utworzono']));
  const plannedAt = normalizeDate(firstText(row, ['plannedAt', 'termin', 'planowanaData']));
  const doneAt = normalizeDate(firstText(row, ['doneAt', 'dataWykonania', 'wykonano', 'zamknieto']));
  const customerId = makeCustomerId({ name: customerName, phone, city });

  return createOrderModel({
    id: makeOrderId(number),
    number,
    sourceSystem: TELMOR_PORTAL.sourceSystem,
    sourceId: number,
    sourceStatus: firstText(row, ['status', 'stan']) || status,
    status,
    customerId,
    customerName,
    phone,
    city,
    location: city,
    address,
    topic,
    shortTopic: topic,
    voucher,
    hasVoucher: Boolean(voucher && voucher !== '-'),
    registeredAt,
    plannedAt,
    doneAt,
    createdAt: registeredAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastSyncAt: new Date().toISOString()
  });
}

export function mapTelmorOrderToCustomer(order = {}) {
  return createCustomerModel({
    id: order.customerId,
    name: order.customerName,
    phone: order.phone,
    city: order.city,
    address: order.address,
    ordersCount: 1,
    lastOrderId: order.id,
    lastTopic: order.topic,
    updatedAt: new Date().toISOString()
  });
}

export function mapTelmorHistoryItem(raw = {}, order = {}) {
  return createHistoryModel({
    id: raw.id || `${order.id || 'telmor'}-${hashText(`${raw.date || ''}-${raw.author || ''}-${raw.text || ''}`)}`,
    orderId: order.id || raw.orderId || '',
    customerId: order.customerId || raw.customerId || '',
    date: normalizeDate(raw.date) || new Date().toISOString(),
    title: raw.title || raw.type || 'Wpis Telmor',
    type: raw.type || 'telmor',
    author: raw.author || '',
    text: raw.text || '',
    attachmentName: raw.attachmentName || ''
  });
}

function mapTelmorStatus(value = '') {
  const normalized = normalize(value);
  if (!normalized) return ORDER_STATUS.NEW;
  if (normalized.includes('zamkn') || normalized.includes('wykon') || normalized.includes('zakoncz')) return ORDER_STATUS.CLOSED;
  if (normalized.includes('w toku') || normalized.includes('realiz')) return ORDER_STATUS.IN_PROGRESS;
  if (normalized.includes('piln') || normalized.includes('awaria')) return ORDER_STATUS.URGENT;
  return ORDER_STATUS.NEW;
}

function firstText(row, keys) {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null && String(row[key]).trim()) return String(row[key]).trim();
  }
  return '';
}

function fallbackNumber(row) {
  const joined = Object.values(row).join(' ');
  const match = joined.match(/\b\d{5,}\b/);
  return match ? match[0] : `TELMOR-${Date.now()}`;
}

function normalizeDate(value = '') {
  const safe = String(value || '').trim();
  if (!safe) return '';

  const plDate = safe.match(/(\d{1,2})[.\-/](\d{1,2})[.\-/](\d{2,4})(?:\s+(\d{1,2}):(\d{2}))?/);
  if (plDate) {
    const [, day, month, year, hour = '00', minute = '00'] = plDate;
    const fullYear = year.length === 2 ? `20${year}` : year;
    return `${fullYear.padStart(4, '0')}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:00.000`;
  }

  const date = new Date(safe);
  if (!Number.isNaN(date.getTime())) return date.toISOString();
  return safe;
}

function normalize(value = '') {
  return String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function hashText(value = '') {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = ((hash << 5) - hash) + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}
