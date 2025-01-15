// Author: Rishika Dubey | Version: 1.0.0 | Date: 2025-01-14
import { TestBed } from '@angular/core/testing';
import { IndexedDBService } from './indexed-db.service';

describe('IndexedDBService', () => {
  let service: IndexedDBService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IndexedDBService],
    });
    service = TestBed.inject(IndexedDBService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getDbStatus', () => {
    it('should return the database status as an observable', (done) => {
      service.getDbStatus().subscribe((status) => {
        expect(status).toBeFalse();
        done();
      });
    });
  });

  describe('openDatabase', () => {
    it('should open the database and emit success', (done) => {
      spyOn(window.indexedDB, 'open').and.callFake(() => {
        const request = {
          onsuccess: null,
          onerror: null,
          onupgradeneeded: null,
          result: {},
        } as unknown as IDBOpenDBRequest;

        setTimeout(() => {
          request.onsuccess?.({ target: { result: {} } } as unknown as Event);
        }, 0);

        return request;
      });

      service['openDatabase']().subscribe({
        next: (db) => {
          expect(db).toBeDefined();
          done();
        },
      });
    });

    it('should emit an error if the database fails to open', (done) => {
      spyOn(window.indexedDB, 'open').and.callFake(() => {
        const request = {
          onsuccess: null,
          onerror: null,
          onupgradeneeded: null,
        } as unknown as IDBOpenDBRequest;

        setTimeout(() => {
          request.onerror?.({ target: { error: 'Error' } } as unknown as Event);
        }, 0);

        return request;
      });

      service['openDatabase']().subscribe({
        error: (error) => {
          expect(error).toBe('Error');
          done();
        },
      });
    });
  });

  it('should add an employee detail', (done) => {
    const mockTransaction: Partial<IDBTransaction> = {
      objectStore: jasmine.createSpy().and.returnValue({
        add: jasmine.createSpy(),
      }),
      oncomplete: null as any,
      onerror: null as any,
    };

    service['db'] = {
      transaction: jasmine
        .createSpy()
        .and.returnValue(mockTransaction as IDBTransaction),
    } as unknown as IDBDatabase;

    service.addEmployeeDetails({ id: 1, name: 'John Doe' }).subscribe({
      next: () => {
        expect(service['db']!.transaction).toHaveBeenCalledWith(
          'employees',
          'readwrite'
        );
        done();
      },
    });

    setTimeout(() => {
      (mockTransaction.oncomplete as () => void)();
    }, 0);
  });

  it('should emit an error if adding fails', (done) => {
    const mockTransaction: Partial<IDBTransaction> = {
      objectStore: jasmine.createSpy().and.returnValue({
        add: jasmine.createSpy(),
      }),
      oncomplete: null as any,
      onerror: null as any,
    };

    service['db'] = {
      transaction: jasmine
        .createSpy()
        .and.returnValue(mockTransaction as IDBTransaction),
    } as unknown as IDBDatabase;

    service.addEmployeeDetails({ id: 1, name: 'John Doe' }).subscribe({
      error: (err) => {
        expect(err).toBeDefined();
        done();
      },
    });

    setTimeout(() => {
      (mockTransaction.onerror as (event: Event) => void)({
        target: { error: 'Error adding item' },
      } as unknown as Event);
    }, 0);
  });

  it('should retrieve an employee by ID', (done) => {
    const mockRequest: Partial<IDBRequest> = {
      onsuccess: null as any,
      onerror: null as any,
      result: { id: 1, name: 'John Doe' },
    };

    const mockTransaction: Partial<IDBTransaction> = {
      objectStore: jasmine.createSpy().and.returnValue({
        get: jasmine.createSpy().and.returnValue(mockRequest as IDBRequest),
      }),
    };

    service['db'] = {
      transaction: jasmine
        .createSpy()
        .and.returnValue(mockTransaction as IDBTransaction),
    } as unknown as IDBDatabase;

    service.getEmployeeById(1).subscribe({
      next: (result) => {
        expect(result).toEqual({ id: 1, name: 'John Doe' });
        done();
      },
    });

    setTimeout(() => {
      (mockRequest.onsuccess as () => void)();
    }, 0);
  });

  it('should emit an error if retrieval fails', (done) => {
    const mockRequest: Partial<IDBRequest> = {
      onsuccess: null as any,
      onerror: null as any,
    };

    const mockTransaction: Partial<IDBTransaction> = {
      objectStore: jasmine.createSpy().and.returnValue({
        get: jasmine.createSpy().and.returnValue(mockRequest as IDBRequest),
      }),
    };

    service['db'] = {
      transaction: jasmine
        .createSpy()
        .and.returnValue(mockTransaction as IDBTransaction),
    } as unknown as IDBDatabase;

    service.getEmployeeById(1).subscribe({
      error: (err) => {
        expect(err).toBeDefined();
        done();
      },
    });

    setTimeout(() => {
      (mockRequest.onerror as (event: Event) => void)({
        target: { error: 'Error retrieving employee' },
      } as unknown as Event);
    }, 0);
  });
});
