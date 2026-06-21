import { ORDER_STATUS, ORDER_STATUS_TONE, SOURCE_SYSTEM } from '../config/collections.config.js';
import { buildSearchTokens } from '../search/buildSearchTokens.js';
import { makeAttachmentId, makeCustomerId, makeOrderId } from '../utils/idUtils.js';

export function createOrderModel(raw = {}) {
  const number = String(raw.number || raw.id || raw.orderNumber || '').trim();
  const status = raw.status || ORDER_STATUS.NEW;
  const customerName = raw.customerName || raw.clientName || '';
  const phone = raw.phone || '';
  const city = raw.city || '';
  const location = raw.location || city;
  const topic = raw.topic || raw.shortTopic || '';
  const customerId = raw.customerId || makeCustomerId({ name: customerName, phone, city });

  return {
    id: raw.id || makeOrderId(number),
    userId: raw.userId || '',
    number,
    sourceSystem: raw.sourceSystem || SOURCE_SYSTEM.TELMOR,
    sourceId: raw.sourceId || number,
    status,
    sourceStatus: raw.sourceStatus || status,
    statusTone: raw.statusTone || ORDER_STATUS_TONE[status] || 'gray',
    priority: raw.priority || 'Standard',
    workStatus: raw.workStatus || 'normalne',
    isFavorite: Boolean(raw.isFavorite),
    nextActionAt: raw.nextActionAt || '',
    lastOpenedAt: raw.lastOpenedAt || '',
    customerId,
    customerName,
    phone,
    city,
    location,
    address: raw.address || '',
    house: raw.house || '',
    topic,
    shortTopic: raw.shortTopic || topic,
    description: raw.description || '',
    voucher: raw.voucher || '',
    hasVoucher: Boolean(raw.hasVoucher ?? (raw.voucher && raw.voucher !== '-')),
    attachmentCount: Number(raw.attachmentCount || 0),
    noteCount: Number(raw.noteCount || 0),
    attachments: Array.isArray(raw.attachments) ? raw.attachments : [],
    isNew: Boolean(raw.isNew),
    registeredAt: raw.registeredAt || '',
    plannedAt: raw.plannedAt || '',
    doneAt: raw.doneAt || '',
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || raw.modifiedAt || new Date().toISOString(),
    lastSyncAt: raw.lastSyncAt || '',
    assignee: raw.assignee || '',
    searchTokens: raw.searchTokens || buildSearchTokens([
      number,
      customerName,
      phone,
      city,
      location,
      raw.address,
      topic,
      status,
      raw.voucher
    ])
  };
}

export function createCustomerModel(raw = {}) {
  const name = raw.name || raw.customerName || raw.clientName || '';
  const phone = raw.phone || '';
  const city = raw.city || '';
  const id = raw.id || raw.customerId || makeCustomerId({ name, phone, city });

  return {
    id,
    userId: raw.userId || '',
    name,
    phone,
    city,
    address: raw.address || '',
    postalCode: raw.postalCode || '',
    street: raw.street || '',
    houseNumber: raw.houseNumber || raw.house || '',
    ordersCount: Number(raw.ordersCount || 0),
    notesCount: Number(raw.notesCount || 0),
    lastOrderId: raw.lastOrderId || raw.lastOrder || '',
    lastTopic: raw.lastTopic || '',
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || new Date().toISOString(),
    searchTokens: raw.searchTokens || buildSearchTokens([name, phone, city, raw.address, raw.street, raw.houseNumber])
  };
}

export function createHistoryModel(raw = {}) {
  return {
    id: raw.id || `${raw.orderId || 'order'}-${Date.now()}`,
    userId: raw.userId || '',
    orderId: raw.orderId || '',
    customerId: raw.customerId || '',
    date: raw.date || raw.createdAt || new Date().toISOString(),
    title: raw.title || raw.type || 'Wpis historii',
    type: raw.type || 'info',
    author: raw.author || '',
    text: raw.text || '',
    attachmentName: raw.attachmentName || '',
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || new Date().toISOString(),
    searchTokens: raw.searchTokens || buildSearchTokens([raw.orderId, raw.title, raw.author, raw.text, raw.attachmentName])
  };
}


export function createAttachmentModel(raw = {}) {
  const createdAt = raw.createdAt || new Date().toISOString();
  const fileName = raw.fileName || raw.name || 'plik';
  const orderId = raw.orderId || '';
  const sizeBytes = Number(raw.sizeBytes || raw.size || 0);
  const fileKind = raw.fileKind || raw.type || guessAttachmentKind(fileName, raw.mimeType);
  const isVoucher = Boolean(raw.isVoucher || /voucher|bon|kupon/i.test(`${fileKind} ${fileName}`));

  return {
    id: raw.id || makeAttachmentId({ orderId, fileName, createdAt }),
    userId: raw.userId || '',
    orderId,
    customerId: raw.customerId || '',
    fileName,
    displayName: raw.displayName || fileName,
    mimeType: raw.mimeType || raw.contentType || '',
    sizeBytes,
    sizeLabel: raw.sizeLabel || formatSize(sizeBytes),
    fileKind,
    isVoucher,
    description: raw.description || '',
    source: raw.source || 'manual',
    storagePath: raw.storagePath || '',
    downloadUrl: raw.downloadUrl || '',
    localBlobKey: raw.localBlobKey || '',
    localOnly: Boolean(raw.localOnly),
    syncPending: Boolean(raw.syncPending),
    createdAt,
    updatedAt: raw.updatedAt || createdAt,
    searchTokens: raw.searchTokens || buildSearchTokens([orderId, raw.customerId, fileName, fileKind, raw.description])
  };
}

function guessAttachmentKind(fileName = '', mimeType = '') {
  const value = `${fileName} ${mimeType}`.toLowerCase();
  if (/voucher|bon|kupon/.test(value)) return 'Voucher';
  if (/pdf/.test(value)) return 'PDF';
  if (/image|jpg|jpeg|png|webp/.test(value)) return 'Zdjęcie';
  return 'Plik';
}

function formatSize(bytes = 0) {
  const value = Number(bytes || 0);
  if (!value) return '-';
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1).replace('.', ',')} KB`;
  return `${(value / 1024 / 1024).toFixed(1).replace('.', ',')} MB`;
}

export function createNoteModel(raw = {}) {
  return {
    id: raw.id || `${raw.orderId || raw.customerId || 'note'}-${Date.now()}`,
    userId: raw.userId || '',
    orderId: raw.orderId || '',
    customerId: raw.customerId || '',
    text: raw.text || '',
    pinned: Boolean(raw.pinned),
    createdBy: raw.createdBy || '',
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || new Date().toISOString(),
    searchTokens: raw.searchTokens || buildSearchTokens([raw.orderId, raw.customerId, raw.text, raw.createdBy])
  };
}

export function createNotificationModel(raw = {}) {
  return {
    id: raw.id || `notification-${Date.now()}`,
    userId: raw.userId || '',
    type: raw.type || 'info',
    title: raw.title || '',
    body: raw.body || raw.note || '',
    orderId: raw.orderId || '',
    customerId: raw.customerId || '',
    read: Boolean(raw.read),
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || new Date().toISOString()
  };
}

export function createSyncStateModel(raw = {}) {
  return {
    id: raw.id || 'main',
    userId: raw.userId || '',
    deviceId: raw.deviceId || '',
    lastOpenOrdersSyncAt: raw.lastOpenOrdersSyncAt || '',
    lastClosedOrdersSyncAt: raw.lastClosedOrdersSyncAt || '',
    lastFullSyncAt: raw.lastFullSyncAt || '',
    lastError: raw.lastError || '',
    updatedAt: raw.updatedAt || new Date().toISOString()
  };
}
