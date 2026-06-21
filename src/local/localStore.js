import { localDbGet, localDbSet, localDbDelete } from './localDb.js';

const STORE_PREFIX = 'local:collection:v1:';
const META_KEY = 'local:collectionMeta:v1';

export async function saveLocalCollection(collectionName, items = []) {
  const normalized = Array.isArray(items) ? items.filter(Boolean) : [];
  await localDbSet(collectionKey(collectionName), normalized);
  await updateCollectionMeta(collectionName, normalized.length);
  return normalized;
}

export async function getLocalCollection(collectionName) {
  const value = await localDbGet(collectionKey(collectionName));
  return Array.isArray(value) ? value : [];
}

export async function getLocalDocument(collectionName, documentId) {
  const items = await getLocalCollection(collectionName);
  return items.find((item) => String(item.id) === String(documentId)) || null;
}

export async function upsertLocalDocument(collectionName, document) {
  if (!document?.id) return null;

  const items = await getLocalCollection(collectionName);
  const index = items.findIndex((item) => String(item.id) === String(document.id));
  const next = {
    ...document,
    localOnly: true,
    updatedAt: document.updatedAt || new Date().toISOString()
  };

  if (index >= 0) items[index] = { ...items[index], ...next };
  else items.unshift(next);

  await saveLocalCollection(collectionName, items);
  return next;
}

export async function removeLocalDocument(collectionName, documentId) {
  const items = await getLocalCollection(collectionName);
  await saveLocalCollection(collectionName, items.filter((item) => String(item.id) !== String(documentId)));
}

export async function clearLocalCollection(collectionName) {
  await localDbDelete(collectionKey(collectionName));
  await updateCollectionMeta(collectionName, 0);
}

export async function getLocalStoreSummary(collectionNames = []) {
  const meta = await localDbGet(META_KEY) || {};
  const result = [];

  for (const collectionName of collectionNames) {
    const items = await getLocalCollection(collectionName);
    result.push({
      collectionName,
      count: items.length,
      savedAt: meta[collectionName]?.savedAt || '',
      lastCount: meta[collectionName]?.count ?? items.length
    });
  }

  return result;
}

async function updateCollectionMeta(collectionName, count) {
  const meta = await localDbGet(META_KEY) || {};
  meta[collectionName] = {
    count,
    savedAt: new Date().toISOString()
  };
  await localDbSet(META_KEY, meta);
}

function collectionKey(collectionName) {
  return `${STORE_PREFIX}${collectionName}`;
}
