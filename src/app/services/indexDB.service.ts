import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IndexedDBService {
  private readonly dbName: string = 'myDatabase';
  private readonly dbVersion: number = 1;
  private db: IDBDatabase | undefined;
  private dbStatusSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {
    // This is to emit the database status on service initialization
    this.dbStatusSubject.next(!!this.db);
  }

  // Open Database method to initialize or retrieve the existing connection
  private openDatabase(): Observable<IDBDatabase> {
    return new Observable((observer) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onsuccess = (event: Event) => {
        this.db = (event.target as IDBRequest).result;
        console.log('Database opened successfully');
        this.dbStatusSubject.next(true); // Emit DB is ready
        observer.next(this.db); // Emit the database instance
        observer.complete();
      };

      request.onerror = (event: Event) => {
        const error = (event.target as IDBRequest).error;
        console.error('Error opening database:', error);
        this.dbStatusSubject.next(false); // Emit DB failure
        observer.error(error); // Emit error
      };

      request.onupgradeneeded = (event: Event) => {
        const db = (event.target as IDBRequest).result;
        if (!db.objectStoreNames.contains('employees')) {
          db.createObjectStore('employees', { keyPath: 'id' });
        }
      };
    });
  }

  // Ensure DB connection is ready or open it if necessary
  private ensureDBConnection(): Observable<void> {
    if (this.db) {
      return new Observable((observer) => {
        observer.next(); // DB is already ready
        observer.complete();
      });
    } else {
      return this.openDatabase().pipe(
        map(() => {}), // Convert the DB instance to void
        catchError((error) => {
          console.error('Error opening database:', error);
          return throwError(error); // Re-throw error
        })
      );
    }
  }

  // Add item to the database
  addEmployeeDetails(item: any): Observable<void> {
    return new Observable((observer) => {
      this.ensureDBConnection().subscribe({
        next: () => {
          const transaction = this.db!.transaction('employees', 'readwrite');
          const store = transaction.objectStore('employees');
          store.add(item);

          transaction.oncomplete = () => {
            console.log('Item added successfully');
            observer.next(); // Emit completion
            observer.complete();
          };

          transaction.onerror = (event) => {
            console.error('Error adding item:', (event.target as IDBTransaction).error);
            observer.error((event.target as IDBTransaction).error); // Emit error
          };
        },
        error: (err) => {
          observer.error(err); // Emit error if DB is not open
        }
      });
    });
  }

  // Update item in the database
updateEmployeeDetails(item: any): Observable<void> {
  return new Observable((observer) => {
    this.ensureDBConnection().subscribe({
      next: () => {
        const transaction = this.db!.transaction('employees', 'readwrite');
        const store = transaction.objectStore('employees');

        // Attempt to update the item
        const request = store.put(item);

        request.onsuccess = () => {
          console.log('Item updated successfully');
          observer.next();
          observer.complete();
        };

        request.onerror = (event) => {
          console.error('Error updating item:', (event.target as IDBRequest).error);
          observer.error((event.target as IDBRequest).error); // Emit error
        };
      },
      error: (err) => {
        observer.error(err);
      }
    });
  });
}


  // Get employee by ID
  getEmployeeById(id: number): Observable<any> {
    return new Observable((observer) => {
      this.ensureDBConnection().subscribe({
        next: () => {
          const transaction = this.db!.transaction('employees', 'readonly');
          const store = transaction.objectStore('employees');
          const request = store.get(id);

          request.onsuccess = () => {
            observer.next(request.result); // Emit the result
            observer.complete();
          };

          request.onerror = (event) => {
            console.error('Error retrieving employee:', (event.target as IDBRequest).error);
            observer.error((event.target as IDBRequest).error); // Emit error
          };
        },
        error: (err) => {
          observer.error(err); // Emit error if DB is not open
        }
      });
    });
  }

  // Get all employees
  getAllEmployees(): Observable<any[]> {
    return new Observable((observer) => {
      this.ensureDBConnection().subscribe({
        next: () => {
          const transaction = this.db!.transaction('employees', 'readonly');
          const store = transaction.objectStore('employees');
          const request = store.getAll();

          request.onsuccess = () => {
            observer.next(request.result);
            observer.complete();
          };

          request.onerror = (event) => {
            console.error('Error retrieving employees:', (event.target as IDBRequest).error);
            observer.error((event.target as IDBRequest).error); // Emit error
          };
        },
        error: (err) => {
          observer.error(err);
        }
      });
    });
  }

  // Delete item from the database
  deleteItem(id: number): Observable<void> {
    return new Observable((observer) => {
      this.ensureDBConnection().subscribe({
        next: () => {
          const transaction = this.db!.transaction('employees', 'readwrite');
          const store = transaction.objectStore('employees');
          store.delete(id);

          transaction.oncomplete = () => {
            observer.next();
            observer.complete();
          };

          transaction.onerror = (event) => {
            console.error('Error deleting item:', (event.target as IDBTransaction).error);
            observer.error((event.target as IDBTransaction).error); // Emit error
          };
        },
        error: (err) => {
          observer.error(err);
        }
      });
    });
  }

  // Observable for DB status
  getDbStatus(): Observable<boolean> {
    return this.dbStatusSubject.asObservable();
  }
}
