const DB_NAME = 'telmor_praca_local_db';
const DB_VERSION = 1;
const STORE_NAME = 'key_value';

let dbPromise = null;

export function isIndexedDbAvailable() {
  return typeof indexedDB !== 'undefined';
}

export function openLocalDb() {
  if (!isIndexedDbAvailable()) {
    return Promise.reject(new Error('IndexedDB nie jest dostępne w tej przeglądarce.'));
  }

  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Nie udało się otworzyć lokalnej bazy.'));
  });

  return dbPromise;
}

export async function localDbSet(key, value) {
  const db = await openLocalDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put({
      key,
      value,
      updatedAt: new Date().toISOString()
    });
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error || new Error('Nie udało się zapisać danych lokalnych.'));
  });
}

export async function localDbGet(key) {
  const db = await openLocalDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const request = tx.objectStore(STORE_NAME).get(key);
    request.onsuccess = () => resolve(request.result?.value ?? null);
    request.onerror = () => reject(request.error || new Error('Nie udało się odczytać danych lokalnych.'));
  });
}

export async function localDbDelete(key) {
  const db = await openLocalDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(key);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error || new Error('Nie udało się usunąć danych lokalnych.'));
  });
}
