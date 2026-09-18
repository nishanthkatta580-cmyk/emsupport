/**
 * Emotional Support — IndexedDB Controller
 * Implements a Promise-based transactional database manager for persistent client-side storage.
 */

const DB_NAME = 'EmotionalSupportDB';
const DB_VERSION = 1;

let dbInstance = null;

/**
 * Initializes the database connection and configures object stores.
 */
export function initDB() {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('IndexedDB open error:', event.target.error);
      reject(event.target.error);
    };

    request.onsuccess = (event) => {
      dbInstance = event.target.result;
      console.log('IndexedDB connection established successfully.');
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // 1. Bookings Store
      if (!db.objectStoreNames.contains('bookings')) {
        const bookingsStore = db.createObjectStore('bookings', { keyPath: 'id' });
        bookingsStore.createIndex('clientEmail', 'clientEmail', { unique: false });
        bookingsStore.createIndex('date', 'date', { unique: false });
        bookingsStore.createIndex('status', 'status', { unique: false });
        bookingsStore.createIndex('timestamp', 'timestamp', { unique: false });
      }

      // 2. Inquiries Store
      if (!db.objectStoreNames.contains('inquiries')) {
        const inquiriesStore = db.createObjectStore('inquiries', { keyPath: 'id' });
        inquiriesStore.createIndex('clientEmail', 'clientEmail', { unique: false });
        inquiriesStore.createIndex('status', 'status', { unique: false });
        inquiriesStore.createIndex('timestamp', 'timestamp', { unique: false });
      }

      // 3. Mood Logs Store
      if (!db.objectStoreNames.contains('moodLogs')) {
        const moodLogsStore = db.createObjectStore('moodLogs', { keyPath: 'timestamp' });
        moodLogsStore.createIndex('value', 'value', { unique: false });
      }

      console.log('IndexedDB Schema creation/upgrade complete.');
    };
  });
}

/**
 * Generic helper to get a write/read transaction.
 */
function getStore(storeName, mode = 'readonly') {
  if (!dbInstance) {
    throw new Error('Database is not initialized. Call initDB() first.');
  }
  const tx = dbInstance.transaction(storeName, mode);
  return tx.objectStore(storeName);
}

/**
 * Adds a new record to a store.
 */
export function addRecord(storeName, record) {
  return new Promise((resolve, reject) => {
    try {
      const store = getStore(storeName, 'readwrite');
      const request = store.add(record);
      
      request.onsuccess = () => resolve(record);
      request.onerror = (e) => reject(e.target.error);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Fetches a single record by its key path.
 */
export function getRecord(storeName, key) {
  return new Promise((resolve, reject) => {
    try {
      const store = getStore(storeName, 'readonly');
      const request = store.get(key);
      
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = (e) => reject(e.target.error);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Updates an existing record.
 */
export function updateRecord(storeName, record) {
  return new Promise((resolve, reject) => {
    try {
      const store = getStore(storeName, 'readwrite');
      const request = store.put(record);
      
      request.onsuccess = () => resolve(record);
      request.onerror = (e) => reject(e.target.error);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Fetches all records in a store.
 */
export function getAllRecords(storeName) {
  return new Promise((resolve, reject) => {
    try {
      const store = getStore(storeName, 'readonly');
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = (e) => reject(e.target.error);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Deletes a record by its key.
 */
export function deleteRecord(storeName, key) {
  return new Promise((resolve, reject) => {
    try {
      const store = getStore(storeName, 'readwrite');
      const request = store.delete(key);
      
      request.onsuccess = () => resolve(true);
      request.onerror = (e) => reject(e.target.error);
    } catch (err) {
      reject(err);
    }
  });
}
