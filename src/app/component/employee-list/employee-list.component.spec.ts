// Author: Rishika Dubey | Version: 1.0.0 | Date: 2025-01-14
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeListComponent } from './employee-list.component';
import { of, throwError } from 'rxjs';
import { IndexedDBService } from 'src/app/services/indexed-db.service';

describe('EmployeeListComponent', () => {
  let component: EmployeeListComponent;
  let fixture: ComponentFixture<EmployeeListComponent>;
  let indexedDBService: jasmine.SpyObj<IndexedDBService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('IndexedDBService', [
      'addEmployeeDetails',
      'getAllEmployees',
    ]);
    TestBed.configureTestingModule({
      declarations: [EmployeeListComponent],
      providers: [{ provide: IndexedDBService, useValue: spy }],
    });
    fixture = TestBed.createComponent(EmployeeListComponent);
    component = fixture.componentInstance;
    indexedDBService = TestBed.inject(
      IndexedDBService
    ) as jasmine.SpyObj<IndexedDBService>;
    spyOn(component, 'getAllEmployees');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return true for a date before today', () => {
    const pastDate = new Date(2024, 10, 10);
    expect(component.isPreviousDate(pastDate)).toBeTrue();
  });

  it('should return false for today', () => {
    const today = new Date();
    expect(component.isPreviousDate(today)).toBeFalse();
  });

  it('should return false for a date after today', () => {
    const futureDate = new Date(2025, 1, 15);
    expect(component.isPreviousDate(futureDate)).toBeFalse();
  });

  it('should handle string input (past date)', () => {
    const pastDateString = '2024-10-10';
    expect(component.isPreviousDate(pastDateString)).toBeTrue();
  });

  it('should handle string input (today)', () => {
    const todayString = new Date().toISOString().split('T')[0];
    expect(component.isPreviousDate(todayString)).toBeFalse();
  });

  it('should handle string input (future date)', () => {
    const futureDateString = '2025-01-15';
    expect(component.isPreviousDate(futureDateString)).toBeFalse();
  });

  it('should call router.navigateByUrl with /add on addUser', () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    component['router'] = routerSpy;

    component.addUser();

    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/add');
  });

  it('should call router.navigate with /edit and query params on editEmployeeDetails', () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    component['router'] = routerSpy;

    const editId = 123;

    component.editEmployeeDetails(editId);

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/edit'], {
      queryParams: { id: editId },
    });
  });

  describe('undoLastDelete', () => {
    it('should restore employee and call getAllEmployees on success', (done) => {
      const lastDeletedEmployee = { id: 1, name: 'John Doe' };
      component['lastDeletedEmployee'] = lastDeletedEmployee;
      indexedDBService.addEmployeeDetails.and.returnValue(of(void 0));
      component.undoLastDelete();

      setTimeout(() => {
        expect(indexedDBService.addEmployeeDetails).toHaveBeenCalledWith(
          lastDeletedEmployee
        );
        expect(component['lastDeletedEmployee']).toBeNull();
        expect(component.getAllEmployees).toHaveBeenCalled();
        done();
      }, 0);
    });

    it('should handle error and call getAllEmployees if restore fails', (done) => {
      const lastDeletedEmployee = { id: 1, name: 'John Doe' };
      component['lastDeletedEmployee'] = lastDeletedEmployee;
      indexedDBService.addEmployeeDetails.and.returnValue(throwError('Error'));
      component.undoLastDelete();

      setTimeout(() => {
        expect(indexedDBService.addEmployeeDetails).toHaveBeenCalledWith(
          lastDeletedEmployee
        );
        expect(component.getAllEmployees).toHaveBeenCalled();
        done();
      }, 0);
    });
  });
});
