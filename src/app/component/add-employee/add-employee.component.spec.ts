// Author: Rishika Dubey | Version: 1.0.0 | Date: 2025-01-14
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IndexedDBService } from 'src/app/services/indexed-db.service';
import { AddEmployeeComponent } from './add-employee.component';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';

describe('AddEmployeeComponent', () => {
  let component: AddEmployeeComponent;
  let fixture: ComponentFixture<AddEmployeeComponent>;
  let router: jasmine.SpyObj<Router>;
  let indexedDBService: jasmine.SpyObj<IndexedDBService>;
  let dialogService: jasmine.SpyObj<DialogService>;

  beforeEach(async () => {
    router = jasmine.createSpyObj('Router', ['navigateByUrl']);
    indexedDBService = jasmine.createSpyObj('IndexedDBService', [
      'addEmployeeDetails',
      'updateEmployeeDetails',
      'getEmployeeById',
    ]);
    dialogService = jasmine.createSpyObj('DialogService', ['open']);

    await TestBed.configureTestingModule({
      declarations: [AddEmployeeComponent],
      imports: [ReactiveFormsModule, CalendarModule,
        DropdownModule,
        InputTextModule,
        ButtonModule,
        MessagesModule],
      providers: [
        { provide: Router, useValue: router },
        { provide: IndexedDBService, useValue: indexedDBService },
        { provide: DialogService, useValue: dialogService },
        { provide: DynamicDialogRef, useValue: {} },
        { provide: DynamicDialogConfig, useValue: {} },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ id: '1' }),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    expect(component.employeeInfoForm).toBeTruthy();
    expect(component.employeeInfoForm.controls['employeeName'].value).toEqual('');
  });

  it('should fetch employee details if an ID is provided in query params', () => {
    const mockEmployee = {
      id: 1,
      employeeName: 'John Doe',
      employeeRole: { label: 'Manager' },
      role: 'Manager',
      startDate: new Date(),
      endDate: null,
    };
    indexedDBService.getEmployeeById.and.returnValue(of(mockEmployee));

    component.ngOnInit();

    expect(indexedDBService.getEmployeeById).toHaveBeenCalledWith(1);
    expect(component.employeeInfoForm.value.employeeName).toEqual('John Doe');
  });

  it('should handle form submission for adding a new employee', () => {
    const mockEmployee = { id: 0, employeeName: 'John Doe', employeeRole: { label: 'Manager' }, startDate: new Date() };
    indexedDBService.addEmployeeDetails.and.returnValue(of());

    component.employeeInfoForm.patchValue(mockEmployee);
    component.onSave();

    expect(indexedDBService.addEmployeeDetails).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('should handle form submission for updating an existing employee', () => {
    const mockEmployee = { id: 1, employeeName: 'John Doe', employeeRole: { label: 'Manager' }, startDate: new Date() };
    indexedDBService.updateEmployeeDetails.and.returnValue(of());

    component.employeeInfoForm.patchValue(mockEmployee);
    component.onSave();


    expect(indexedDBService.updateEmployeeDetails).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('should mark form controls as touched if form is invalid', () => {
    spyOn(component.employeeInfoForm, 'markAllAsTouched');
    spyOn(component.employeeInfoForm, 'updateValueAndValidity');

    component.onSave();

    expect(component.employeeInfoForm.markAllAsTouched).toHaveBeenCalled();
    expect(component.employeeInfoForm.updateValueAndValidity).toHaveBeenCalled();
  });

  it('should handle dialog close and update form values', () => {
    const mockRole = { label: 'Developer' };
    dialogService.open.and.returnValue({ onClose: of(mockRole) } as DynamicDialogRef);

    component.openBottomSheet();

    expect(dialogService.open).toHaveBeenCalled();
    expect(component.employeeInfoForm.value.employeeRole).toEqual(mockRole);
  });

  it('should reset the form on cancel', () => {
    component.onCancel();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('should set start date to null on selecting "No Date"', () => {
    component.selectNoDate("startDate");
    expect(component.employeeInfoForm.controls['startDate'].value).toBeNull();
  });

  it('should set start date to today on selecting "Today"', () => {
    const today = new Date();
    component.selectToday("startDate");
    expect(component.employeeInfoForm.controls['startDate'].value.toDateString()).toEqual(today.toDateString());
  });

  it('should calculate next Monday and set start date', () => {
    const today = new Date('2025-01-14');
    component.selectNextMonday("startDate", today);
    expect(component.employeeInfoForm.controls['startDate'].value.getDay()).toEqual(1);
  });

  it('should calculate next Tuesday and set start date', () => {
    const today = new Date('2025-01-14');
    component.selectNextTuesday("startDate", today);
    expect(component.employeeInfoForm.controls['startDate'].value.getDay()).toEqual(2);
  });

  it('should set start date to one week ahead', () => {
    const today = new Date('2025-01-15');
    const today1 = new Date('2025-01-15');
    component.selectAfterOneWeek("startDate", today);
    const nextWeek = new Date(today.setDate(today1.getDate() + 7));
    expect(component.employeeInfoForm.controls['startDate'].value.toDateString()).toEqual(nextWeek.toDateString());
  });
  it('should hide calendar overlay onDateSave', () => {
    const calendar = { overlayVisible: true };
    component.onDateSave(calendar);
    expect(calendar.overlayVisible).toBeFalse();
  });

  it('should set previousDate onDateFocus', () => {
    const previousDate = new Date();
    component.onDateFocus(previousDate);
    expect(component.previousDate).toEqual(previousDate);
  });

  it('should hide overlay onDateCancel', () => {
    const calendar = { overlayVisible: true };
    const controlName = 'dateOfBirth';
    const previousDate = new Date('2024-01-01');

    component.previousDate = previousDate;

    component.onDateCancel(calendar, controlName);

    expect(calendar.overlayVisible).toBeFalse();

    //test for other control
    const controlName2 = 'hireDate';
    const previousDate2 = new Date('2024-02-01');

    component.previousDate = previousDate2;

    component.onDateCancel(calendar, controlName2);

    expect(calendar.overlayVisible).toBeFalse();
  });


  it('should handle onDateCancel when previousDate is undefined', () => {
    const calendar = { overlayVisible: true };
    const controlName = 'dateOfBirth';
    component.previousDate = null;
    component.onDateCancel(calendar, controlName);
    expect(component.employeeInfoForm.get(controlName)?.value).toBeUndefined();
    expect(calendar.overlayVisible).toBeFalse();
  });
});
