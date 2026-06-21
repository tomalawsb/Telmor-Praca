import { localDbGet, localDbSet, localDbDelete } from '../local/localDb.js';

const CACHE_PREFIX = 'sync:cache:v1:';
const META_KEY = 'sync:cacheMeta:v1';

export async function cacheCollection(collectionName, items = []) {
  const normalized = Array.isArray(items) ? items.filter(Boolean) : [];
  await localDbSet(cacheKey(collectionName), normalized);
  await updateCacheMeta(collectionName, normalized.length);
  return normalized;
}

export async function getCachedCollection(collectionName) {
  const value = await localDbGet(cacheKey(collectionName));
  return Array.isArray(value) ? value : [];
}

export async function getCachedDocument(collectionName, documentId) {
  const items = await getCachedCollection(collectionName);
  return items.find((item) => String(item.id) === String(documentId)) || null;
}

export async function upsertCachedDocument(collectionName, document) {
  if (!document?.id) return null;
  const items = await getCachedCollection(collectionName);
  const index = items.findIndex((item) => String(item.id) === String(document.id));
  const next = {
    ...document,
    updatedAt: document.updatedAt || new Date().toISOString()
  };
  if (index >= 0) items[index] = { ...items[index], ...next };
  else items.unshift(next);
  await cacheCollection(collectionName, items);
  return next;
}

export async function removeCachedDocument(collectionName, documentId) {
  const items = await getCachedCollection(collectionName);
  await cacheCollection(collectionName, items.filter((item) => String(item.id) !== String(documentId)));
}

export async function clearCachedCollection(collectionName) {
  await localDbDelete(cacheKey(collectionName));
  await updateCacheMeta(collectionName, 0);
}

export async function getCacheSummary(collectionNames = []) {
  const meta = await localDbGet(META_KEY) || {};
  const result = [];
  for (const collectionName of collectionNames) {
    const cached = await getCachedCollection(collectionName);
    result.push({
      collectionName,
      count: cached.length,
      cachedAt: meta[collectionName]?.cachedAt || '',
      lastCount: meta[collectionName]?.count ?? cached.length
    });
  }
  return result;
}

async function updateCacheMeta(collectionName, count) {
  const meta = await localDbGet(META_KEY) || {};
  meta[collectionName] = {
    count,
    cachedAt: new Date().toISOString()
  };
  await localDbSet(META_KEY, meta);
}

function cacheKey(collectionName) {
  return `${CACHE_PREFIX}${collectionName}`;
}
