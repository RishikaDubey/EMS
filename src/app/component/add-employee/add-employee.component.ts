import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IndexedDBService } from 'src/app/services/indexDB.service';
import { SelectOptionsComponent } from '../select-options/select-options.component';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent {
  employeeInfoForm!: FormGroup;
  ref: DynamicDialogRef | undefined;

  constructor(
    private readonly _ngFb: FormBuilder,
    private readonly router: Router,
    private readonly indexedDBService: IndexedDBService,
    private readonly route: ActivatedRoute,
    public dialogService: DialogService
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
      let id = Number(params['id']);
      if(id) {
        this.getEmployeeById(id);
      }
    });
  }

  openBottomSheet() {
    console.log('Opening bottom sheet...');
    this.ref = this.dialogService.open(SelectOptionsComponent, {
      header: '',
      width: '100%',
      height: 'auto',
      style: { 'border-radius': '20px 20px 0 0', position: 'fixed', top: 'auto', bottom: '0' },
    });

    this.ref.onClose.subscribe((role) => {
      if (role) {
        this.employeeInfoForm.patchValue({employeeRole: role, role: role.label});
      }
    });
  }

  onSave(): void {
    if (this.employeeInfoForm?.valid) {
      let empInfo = this.employeeInfoForm.getRawValue();
      if (empInfo?.id <= 0) {
        empInfo.id = Date.now();
      }
      delete empInfo.role;
      this.indexedDBService.addItem(empInfo).subscribe({
        next: () => {
          console.log('Item added successfully');
        },
        error: (err) => {
          console.error('Error adding item:', err);
        }
      });
      this.router.navigateByUrl('/');
    } else {
      this.employeeInfoForm.markAllAsTouched();
      this.employeeInfoForm.updateValueAndValidity();
    }
  }

  onCancel(): void {
    this.router.navigateByUrl('/');
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

  openDatePicker() {

  }

}
