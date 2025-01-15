import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IndexedDBService } from 'src/app/services/indexDB.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent {
  role = [
    { id: 1, label: 'Product Designer' },
    { id: 2, label: 'Flutter Developer' },
    { id: 3, label: 'QA Tester' },
    { id: 4, label: 'Product Owner' }
  ];
  employeeInfoForm!: FormGroup;
  constructor(
    private readonly _ngFb: FormBuilder,
    private readonly router: Router,
    private readonly indexedDBService: IndexedDBService,
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.employeeInfoForm = this._ngFb.group({
      id: [0],
      employeeName: ['', Validators.required],
      employeeRole: [''],
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

  onSave(): void {
    if (this.employeeInfoForm?.valid) {
      let empInfo = this.employeeInfoForm.getRawValue();
      if (empInfo?.id <= 0) {
        empInfo.id = Date.now();
      }
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
        console.log(emp);
        this.employeeInfoForm.setValue(emp);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

}
