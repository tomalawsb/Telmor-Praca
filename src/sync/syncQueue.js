import { localDbGet, localDbSet } from '../local/localDb.js';

const QUEUE_KEY = 'sync:pendingQueue:v1';

export async function getPendingQueue() {
  const queue = await localDbGet(QUEUE_KEY);
  return Array.isArray(queue) ? queue : [];
}

export async function enqueuePendingWrite({ collectionName, documentId, data, operation = 'set', reason = '' }) {
  if (!collectionName || !documentId) {
    throw new Error('Brak collectionName albo documentId dla kolejki synchronizacji.');
  }

  const queue = await getPendingQueue();
  const item = {
    queueId: createQueueId(),
    collectionName,
    documentId,
    operation,
    data: data || null,
    reason,
    createdAt: new Date().toISOString(),
    retryCount: 0,
    lastError: ''
  };

  const withoutOlderSameDocument = queue.filter((entry) => {
    return !(entry.collectionName === collectionName && entry.documentId === documentId && entry.operation === operation);
  });

  await localDbSet(QUEUE_KEY, [...withoutOlderSameDocument, item]);
  return item;
}

export async function replacePendingQueue(queue = []) {
  await localDbSet(QUEUE_KEY, Array.isArray(queue) ? queue : []);
}

export async function removePendingQueueItems(queueIds = []) {
  const ids = new Set(queueIds);
  const queue = await getPendingQueue();
  const next = queue.filter((item) => !ids.has(item.queueId));
  await replacePendingQueue(next);
  return next;
}

export async function markQueueItemError(queueId, message) {
  const queue = await getPendingQueue();
  const next = queue.map((item) => {
    if (item.queueId !== queueId) return item;
    return {
      ...item,
      retryCount: Number(item.retryCount || 0) + 1,
      lastError: message || 'Nieznany błąd synchronizacji.',
      lastTryAt: new Date().toISOString()
    };
  });
  await replacePendingQueue(next);
  return next;
}

export async function clearPendingQueue() {
  await replacePendingQueue([]);
}

export async function getQueueSummary() {
  const queue = await getPendingQueue();
  return {
    count: queue.length,
    oldestAt: queue[0]?.createdAt || '',
    newestAt: queue[queue.length - 1]?.createdAt || '',
    lastError: queue.find((item) => item.lastError)?.lastError || ''
  };
}

function createQueueId() {
  const randomPart = crypto?.randomUUID?.() || Math.random().toString(36).slice(2);
  return `queue-${Date.now()}-${randomPart}`;
}
