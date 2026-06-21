import { getLocalCollection, getLocalDocument, removeLocalDocument, upsertLocalDocument } from './localStore.js';

export function isLocalStoreAvailable() {
  return true;
}

export function isRemoteStoreAvailable() {
  return false;
}

export function fieldFilter(field, operator, value) {
  return { field, operator, value };
}

export async function listUserDocuments(collectionName, options = {}) {
  let items = await getLocalCollection(collectionName);

  if (Array.isArray(options.where)) {
    for (const condition of options.where) {
      items = items.filter((item) => matchesCondition(item, condition));
    }
  }

  if (options.orderByField) {
    const direction = String(options.direction || 'ASCENDING').toUpperCase();
    items = [...items].sort((a, b) => compareValues(a?.[options.orderByField], b?.[options.orderByField]));
    if (direction === 'DESCENDING') items.reverse();
  }

  if (options.limit) items = items.slice(0, Number(options.limit));
  return items;
}

export async function readUserDocument(collectionName, documentId) {
  const item = await getLocalDocument(collectionName, documentId);
  if (!item) throw new Error(`Nie znaleziono lokalnego dokumentu: ${collectionName}/${documentId}.`);
  return item;
}

export async function saveUserDocument(collectionName, documentId, data = {}) {
  const document = {
    ...data,
    id: data.id || documentId,
    updatedAt: new Date().toISOString()
  };
  await upsertLocalDocument(collectionName, document);
  return document;
}

export async function deleteUserDocument(collectionName, documentId) {
  await removeLocalDocument(collectionName, documentId);
  return true;
}

function matchesCondition(item, condition = {}) {
  const current = item?.[condition.field];
  if (condition.operator === 'EQUAL') return String(current) === String(condition.value);
  if (condition.operator === 'ARRAY_CONTAINS') return Array.isArray(current) && current.includes(condition.value);
  return true;
}

function compareValues(a, b) {
  if (a === b) return 0;
  if (a === undefined || a === null) return -1;
  if (b === undefined || b === null) return 1;
  return String(a).localeCompare(String(b), 'pl');
}
