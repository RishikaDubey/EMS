import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IndexedDBService {
  private readonly dbName: string = 'myDatabase';
  private readonly dbVersion: number = 1;
  private db: IDBDatabase | null = null;

  constructor() {
    this.openDatabase();
  }

  private openDatabase() {
    const request = indexedDB.open(this.dbName, this.dbVersion);

    request.onsuccess = (event: Event) => {
      this.db = (event.target as IDBRequest).result;
      console.log('Database opened successfully');
    };

    request.onerror = (event: Event) => {
      console.error('Error opening database:', (event.target as IDBRequest).error);
    };

    request.onupgradeneeded = (event: Event) => {
      const db = (event.target as IDBRequest).result;
      if (!db.objectStoreNames.contains('employees')) {
        db.createObjectStore('employees', { keyPath: 'id' });
      }
    };
  }

  // Add item to IndexedDB
  addItem(item: any): void {
    if (!this.db) {
      console.error('Database not initialized');
      return;
    }

    const transaction = this.db.transaction('employees', 'readwrite');
    const store = transaction.objectStore('employees');
    store.add(item);

    transaction.oncomplete = () => {
      console.log('Item added successfully');
    };

    transaction.onerror = (event) => {
      console.error('Error adding item:', (event.target as IDBTransaction).error);
    };
  }

  // Get item from IndexedDB
  getItem(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('Database not initialized');
        return;
      }

      const transaction = this.db.transaction('employees', 'readonly');
      const store = transaction.objectStore('employees');
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = (event) => {
        //reject('Error retrieving item:', (event.target as IDBRequest).error);
      };
    });
  }

  // Delete item from IndexedDB
  deleteItem(id: string): void {
    if (!this.db) {
      console.error('Database not initialized');
      return;
    }

    const transaction = this.db.transaction('employees', 'readwrite');
    const store = transaction.objectStore('employees');
    store.delete(id);

    transaction.oncomplete = () => {
      console.log('Item deleted successfully');
    };

    transaction.onerror = (event) => {
      console.error('Error deleting item:', (event.target as IDBTransaction).error);
    };
  }
}
