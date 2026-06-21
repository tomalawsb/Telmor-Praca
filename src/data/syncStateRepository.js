import { COLLECTIONS, DEFAULT_SYNC_STATE_ID } from '../config/collections.config.js';
import { createSyncStateModel } from './dataSchema.js';
import { readUserDocument, saveUserDocument } from '../local/localDataService.js';
import { readWithCacheFallback, saveWithOfflineQueue } from './repositorySyncHelpers.js';

export async function getSyncState(syncId = DEFAULT_SYNC_STATE_ID) {
  return readWithCacheFallback({
    collectionName: COLLECTIONS.SYNC_STATE,
    documentId: syncId,
    loadFromLocalStore: () => readUserDocument(COLLECTIONS.SYNC_STATE, syncId),
    loadDemo: () => createSyncStateModel({ id: syncId, lastError: 'Tryb lokalny - dane tylko w tej przeglądarce.' }),
    modelFactory: createSyncStateModel
  });
}

export async function saveSyncState(state) {
  const model = createSyncStateModel(state);
  return saveWithOfflineQueue({
    collectionName: COLLECTIONS.SYNC_STATE,
    documentId: model.id,
    data: model,
    saveDirect: () => saveUserDocument(COLLECTIONS.SYNC_STATE, model.id, model)
  });
}
