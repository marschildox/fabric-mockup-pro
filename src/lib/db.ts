
const DB_NAME = "MockupStudioDB";
const STORE_NAME = "sessions";
const DB_VERSION = 1;

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = (event: any) => {
      resolve(event.target.result);
    };

    request.onerror = (event: any) => {
      reject(event.target.error);
    };
  });
};

export const saveSessionsToDB = async (sessions: any[]): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    // Clear existing sessions and add new ones
    const clearRequest = store.clear();
    
    clearRequest.onsuccess = () => {
      let count = 0;
      if (sessions.length === 0) resolve();
      
      sessions.forEach((session) => {
        const addRequest = store.add(session);
        addRequest.onsuccess = () => {
          count++;
          if (count === sessions.length) resolve();
        };
        addRequest.onerror = (e) => reject(e);
      });
    };

    clearRequest.onerror = (e) => reject(e);
  });
};

export const loadSessionsFromDB = async (): Promise<any[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = (event: any) => {
      // Sort by date or ID if needed, but getAll returns as stored
      const sessions = event.target.result;
      // We stored them in order in saveSessionsToDB (or rather, we want them in order)
      // Actually IndexedDB doesn't guarantee order unless we use a cursor or sort them
      // Let's sort them by date descending as the UI expects
      sessions.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      resolve(sessions);
    };

    request.onerror = (event: any) => {
      reject(event.target.error);
    };
  });
};
