import { localDbGet, localDbSet } from '../local/localDb.js';

const CONFLICTS_KEY = 'sync:conflicts:v1';

export function isRemoteNewer(remoteDoc, localDoc) {
  const remoteTime = Date.parse(remoteDoc?.updatedAt || remoteDoc?.createdAt || '');
  const localTime = Date.parse(localDoc?.updatedAt || localDoc?.createdAt || '');
  if (!Number.isFinite(remoteTime) || !Number.isFinite(localTime)) return false;
  return remoteTime > localTime;
}

export async function getConflicts() {
  const conflicts = await localDbGet(CONFLICTS_KEY);
  return Array.isArray(conflicts) ? conflicts : [];
}

export async function addConflict(conflict) {
  const conflicts = await getConflicts();
  const nextConflict = {
    conflictId: conflict.conflictId || createConflictId(),
    collectionName: conflict.collectionName,
    documentId: conflict.documentId,
    localDoc: conflict.localDoc || null,
    remoteDoc: conflict.remoteDoc || null,
    reason: conflict.reason || 'Wersja w chmurze jest nowsza od lokalnej.',
    createdAt: new Date().toISOString()
  };
  const withoutSame = conflicts.filter((item) => {
    return !(item.collectionName === nextConflict.collectionName && item.documentId === nextConflict.documentId);
  });
  await localDbSet(CONFLICTS_KEY, [...withoutSame, nextConflict]);
  return nextConflict;
}

export async function removeConflict(conflictId) {
  const conflicts = await getConflicts();
  await localDbSet(CONFLICTS_KEY, conflicts.filter((item) => item.conflictId !== conflictId));
}

export async function clearConflicts() {
  await localDbSet(CONFLICTS_KEY, []);
}

function createConflictId() {
  const randomPart = crypto?.randomUUID?.() || Math.random().toString(36).slice(2);
  return `conflict-${Date.now()}-${randomPart}`;
}
