import { COLLECTIONS } from '../config/collections.config.js';
import { getOrderById as getDemoOrderById } from './demoData.js';
import { createAttachmentModel } from './dataSchema.js';
import { listUserDocuments, saveUserDocument } from '../local/localDataService.js';
import { listLocalFirst, saveLocalDocument } from './repositoryLocalHelpers.js';
import { saveAttachmentFileLocally, formatAttachmentSize } from '../local/attachmentFileStore.js';

export async function getAttachmentsForOrder(orderId, { limit = 200 } = {}) {
  const loadFromLocalStore = async () => {
    const items = await listUserDocuments(COLLECTIONS.ATTACHMENTS, { orderByField: 'updatedAt', limit });
    return items.filter((item) => String(item.orderId) === String(orderId));
  };

  return listLocalFirst({
    collectionName: COLLECTIONS.ATTACHMENTS,
    loadFromLocalStore,
    loadDemo: () => getDemoAttachmentsForOrder(orderId),
    modelFactory: createAttachmentModel,
    filter: (item) => String(item.orderId) === String(orderId)
  });
}

export async function saveAttachmentMetadata(attachment) {
  const model = createAttachmentModel(attachment);
  return saveLocalDocument({
    collectionName: COLLECTIONS.ATTACHMENTS,
    documentId: model.id,
    data: model,
    saveDirect: () => saveUserDocument(COLLECTIONS.ATTACHMENTS, model.id, model)
  });
}

export async function createAttachmentFromFile({ order, file, fileKind = 'Zdjęcie', isVoucher = false, description = '' }) {
  if (!order?.id) throw new Error('Brak zlecenia dla załącznika.');
  if (!file) throw new Error('Nie wybrano pliku.');

  const now = new Date().toISOString();
  const model = createAttachmentModel({
    orderId: order.id,
    customerId: order.customerId || '',
    fileName: file.name || `zalacznik-${Date.now()}`,
    displayName: file.name || `zalacznik-${Date.now()}`,
    mimeType: file.type || '',
    sizeBytes: Number(file.size || 0),
    sizeLabel: formatAttachmentSize(file.size),
    fileKind,
    isVoucher,
    description,
    source: 'manual-device',
    localOnly: true,
    localOnly: true,
    createdAt: now,
    updatedAt: now
  });

  const localBlobKey = await saveAttachmentFileLocally(model.id, file);
  return saveAttachmentMetadata({
    ...model,
    localBlobKey
  });
}

function getDemoAttachmentsForOrder(orderId) {
  const order = getDemoOrderById(orderId) || {};
  return (Array.isArray(order.attachments) ? order.attachments : []).map((item) => createAttachmentModel({
    ...item,
    orderId: order.id || orderId,
    customerId: order.customerId || '',
    fileName: item.fileName || item.name,
    fileKind: item.fileKind || item.type,
    sizeLabel: item.sizeLabel || item.size,
    source: 'demo'
  }));
}
