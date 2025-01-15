// Author: Rishika Dubey | Version: 1.0.0 | Date: 2025-01-14
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IndexedDBService } from 'src/app/services/indexed-db.service';
import { SelectOptionsComponent } from '../select-options/select-options.component';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {
  employeeInfoForm!: FormGroup;
  ref: DynamicDialogRef | undefined;
  employeeId!: number;
  @ViewChild('noDateBtn') noDateButton: any;
  previousDate: any;
  isTouchDevice = this.commonService.isTouchDevice;

  constructor(
    private readonly _ngFb: FormBuilder,
    private readonly router: Router,
    private readonly indexedDBService: IndexedDBService,
    private readonly route: ActivatedRoute,
    public dialogService: DialogService,
    private readonly commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.employeeInfoForm = this._ngFb.group({
      id: [0],
      employeeName: ['', Validators.required],
      employeeRole: [''],
      role: [''],
      startDate: [new Date()],
      endDate: [''],
    });
    this.route.queryParams.subscribe((params) => {
      this.employeeId = Number(params['id']);
      if (this.employeeId) {
        this.getEmployeeById(this.employeeId);
      }
    });
  }

  onOverlayShow() {
    setTimeout(() => {
      if (this.noDateButton) {
        this.noDateButton.nativeElement.focus();
      }
    }, 0);
  }

  openBottomSheet() {
    this.ref = this.dialogService.open(SelectOptionsComponent, {
      header: '',
      width: '100%',
      height: 'auto',
      style: { 'border-radius': '20px 20px 0 0', position: 'fixed', top: 'auto', bottom: '0' },
    });

    this.ref.onClose.subscribe((role) => {
      if (role) {
        this.employeeInfoForm.patchValue({ employeeRole: role, role: role.label });
      }
    });
  }

  onSave(): void {
    if (this.employeeInfoForm?.valid) {
      let empInfo = this.employeeInfoForm.getRawValue();
      if (empInfo?.id <= 0) {
        empInfo.id = Date.now();
        delete empInfo.role;
        this.indexedDBService.addEmployeeDetails(empInfo).subscribe({
          next: () => {
            console.log('Employee added successfully');
          },
          error: (err) => {
            console.error('Error adding employee:', err);
          }
        });
      } else {
        this.indexedDBService.updateEmployeeDetails(empInfo).subscribe({
          next: () => {
            console.log('Employee update successfully');
          },
          error: (err) => {
            console.error('Error updating employee:', err);
          }
        });
      }
      this.router.navigateByUrl('/');
    } else {
      this.employeeInfoForm.markAllAsTouched();
      this.employeeInfoForm.updateValueAndValidity();
    }
  }

  onCancel(): void {
    this.router.navigateByUrl('/');
  }

  onDateSave(calendar: any): void {
    calendar.overlayVisible = false;
  }

  onDateFocus(previousDate: any) {
    this.previousDate = previousDate;
  }

  onDateCancel(calendar: any, controlName: string): void {
    this.employeeInfoForm.patchValue({ [controlName]: this.previousDate })
    calendar.overlayVisible = false;
  }

  getEmployeeById(id: number): void {
    this.indexedDBService.getEmployeeById(id).subscribe({
      next: (emp) => {
        emp.role = emp.employeeRole.label;
        this.employeeInfoForm.patchValue(emp);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  selectNoDate(controlName: string): void {
    this.employeeInfoForm.controls[controlName].setValue(null);
  }

  selectToday(controlName: string): void {
    const today = new Date();
    this.employeeInfoForm.controls[controlName].setValue(today);
  }

  selectNextMonday(controlName: string, selectedDate: Date): void {
    const dayOfWeek = selectedDate.getDay();
    const daysToAdd = (1 - dayOfWeek + 7) % 7;
    selectedDate.setDate(selectedDate.getDate() + (daysToAdd === 0 ? 7 : daysToAdd));
    this.employeeInfoForm.controls[controlName].setValue(selectedDate);
  }

  selectNextTuesday(controlName: string, selectedDate: Date): void {
    const dayOfWeek = selectedDate.getDay();
    const daysToAdd = (2 - dayOfWeek + 7) % 7;
    selectedDate.setDate(selectedDate.getDate() + (daysToAdd === 0 ? 7 : daysToAdd));
    this.employeeInfoForm.controls[controlName].setValue(selectedDate);
  }

  selectAfterOneWeek(controlName: string, selectedDate: Date): void {
    const nextWeek = new Date(selectedDate.setDate(selectedDate.getDate() + 7));
    this.employeeInfoForm.controls[controlName].setValue(nextWeek);
  }

}
