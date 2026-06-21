import { COLLECTIONS, DEFAULT_SYNC_STATE_ID } from '../config/collections.config.js';
import { createSyncStateModel } from '../data/dataSchema.js';
import { saveSyncState } from '../data/syncStateRepository.js';
import { getCacheSummary } from './syncLocalCache.js';
import { getConflicts, removeConflict } from './conflictResolver.js';
import { getDeviceIdentity, updateDeviceIdentity } from './deviceIdentity.js';
import { clearPendingQueue, getQueueSummary } from './syncQueue.js';

export const SYNC_COLLECTIONS = Object.freeze([
  COLLECTIONS.ORDERS,
  COLLECTIONS.CUSTOMERS,
  COLLECTIONS.ORDER_HISTORY,
  COLLECTIONS.ATTACHMENTS,
  COLLECTIONS.NOTES,
  COLLECTIONS.NOTIFICATIONS,
  COLLECTIONS.SYNC_STATE
]);

export async function registerCurrentDevice() {
  const device = await updateDeviceIdentity({ lastSeenAt: new Date().toISOString() });
  return {
    saved: true,
    device,
    message: 'Urządzenie zapisane lokalnie w tej przeglądarce.'
  };
}

export async function pullFromCloud() {
  return [{ collectionName: 'local', count: 0, message: 'Brak zewnętrznej chmury. Dane są lokalne.' }];
}

export async function pushPendingQueue() {
  const before = await getQueueSummary();
  await clearPendingQueue();
  return {
    attempted: before.count,
    sent: 0,
    conflicts: 0,
    left: 0,
    message: 'Wyczyszczono lokalną kolejkę. Ta wersja nie wysyła danych do zewnętrznej chmury.'
  };
}

export async function performFullSync() {
  const startedAt = new Date().toISOString();
  await registerCurrentDevice();
  const pushed = await pushPendingQueue();
  const pulled = await pullFromCloud();
  const endedAt = new Date().toISOString();

  await saveSyncState(createSyncStateModel({
    id: DEFAULT_SYNC_STATE_ID,
    deviceId: (await getDeviceIdentity()).deviceId,
    lastFullSyncAt: endedAt,
    lastError: ''
  }));

  return { startedAt, endedAt, pushed, pulled };
}

export async function keepLocalConflict(conflictId) {
  const conflicts = await getConflicts();
  const conflict = conflicts.find((item) => item.conflictId === conflictId);
  if (!conflict) throw new Error('Nie znaleziono konfliktu.');
  await removeConflict(conflictId);
  return conflict.localDoc;
}

export async function keepCloudConflict(conflictId) {
  const conflicts = await getConflicts();
  const conflict = conflicts.find((item) => item.conflictId === conflictId);
  if (!conflict) throw new Error('Nie znaleziono konfliktu.');
  await removeConflict(conflictId);
  return conflict.remoteDoc || conflict.localDoc;
}

export async function getSyncDashboardStatus() {
  const device = await getDeviceIdentity();
  const queue = await getQueueSummary();
  const cache = await getCacheSummary(SYNC_COLLECTIONS);
  const conflicts = await getConflicts();

  return {
    localStoreActive: false,
    remoteActive: false,
    localOnly: true,
    online: typeof navigator === 'undefined' ? true : navigator.onLine,
    device,
    queue,
    cache,
    conflicts,
    collections: SYNC_COLLECTIONS
  };
}
