import { getLocalCollection, getLocalDocument, upsertLocalDocument } from '../local/localStore.js';

export async function listLocalFirst({ collectionName, loadDemo, modelFactory, filter }) {
  const localItems = await getLocalCollection(collectionName).catch(() => []);
  if (localItems.length) return normalizeList(localItems, modelFactory, filter);
  return normalizeList(loadDemo(), modelFactory, filter);
}

export async function readLocalFirst({ collectionName, documentId, loadDemo, modelFactory }) {
  const localItem = await getLocalDocument(collectionName, documentId).catch(() => null);
  if (localItem) return modelFactory ? modelFactory(localItem) : localItem;
  const demo = loadDemo();
  return modelFactory ? modelFactory(demo) : demo;
}

export async function saveLocalDocument({ collectionName, data }) {
  const saved = await upsertLocalDocument(collectionName, {
    ...data,
    localOnly: true,
    updatedAt: new Date().toISOString()
  });

  return {
    ...saved,
    localOnly: true,
    localMessage: 'Zapisano lokalnie w tej przeglądarce.'
  };
}

function normalizeList(items, modelFactory, filter) {
  const list = Array.isArray(items) ? items : [];
  const mapped = modelFactory ? list.map(modelFactory) : list;
  return typeof filter === 'function' ? mapped.filter(filter) : mapped;
}
