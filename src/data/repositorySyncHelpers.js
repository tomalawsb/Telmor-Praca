import { getCachedCollection, getCachedDocument, upsertCachedDocument } from '../sync/syncLocalCache.js';

export async function listWithCacheFallback({ collectionName, loadDemo, modelFactory, filter }) {
  const cached = await getCachedCollection(collectionName).catch(() => []);
  if (cached.length) return normalizeList(cached, modelFactory, filter);
  return normalizeList(loadDemo(), modelFactory, filter);
}

export async function readWithCacheFallback({ collectionName, documentId, loadDemo, modelFactory }) {
  const cached = await getCachedDocument(collectionName, documentId).catch(() => null);
  if (cached) return modelFactory ? modelFactory(cached) : cached;
  const demo = loadDemo();
  return modelFactory ? modelFactory(demo) : demo;
}

export async function saveWithOfflineQueue({ collectionName, data }) {
  const saved = await upsertCachedDocument(collectionName, {
    ...data,
    localOnly: true,
    syncPending: false,
    updatedAt: new Date().toISOString()
  });

  return {
    ...saved,
    localOnly: true,
    syncPending: false,
    syncMessage: 'Zapisano lokalnie w tej przeglądarce.'
  };
}

function normalizeList(items, modelFactory, filter) {
  const list = Array.isArray(items) ? items : [];
  const mapped = modelFactory ? list.map(modelFactory) : list;
  return typeof filter === 'function' ? mapped.filter(filter) : mapped;
}
