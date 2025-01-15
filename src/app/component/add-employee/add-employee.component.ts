import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IndexedDBService } from 'src/app/services/indexDB.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent {
  role = [
    {id: 1, label: 'Product Designer'},
    {id: 2, label: 'Flutter Developer'},
    {id: 3, label: 'QA Tester'},
    {id: 4, label: 'Product Owner'}
  ];
  employeeInfoForm!: FormGroup;
  constructor(
    private readonly _ngFb: FormBuilder,
    private readonly router: Router,
    private readonly indexedDBService: IndexedDBService
  ) {}

  ngOnInit(): void {
    this.employeeInfoForm = this._ngFb.group({
      employeeName: ['', Validators.required],
      employeeRole: [''],
      startDate: [''],
      endDate: [''],
    });
  }

  onSave(): void {
    if (this.employeeInfoForm?.valid) {
        this.indexedDBService.addItem({ id: '1', name: 'Item 1', description: 'First item' });
        // this.indexedDBService.getItem('1').then(item => {
        //   console.log('Retrieved item:', item);
        // }).catch(error => {
        //   console.error('Error:', error);
        // });
        // Delete an item from IndexedDB
        // this.indexedDBService.deleteItem('1');
       this.router.navigateByUrl('/');
    } else {
      this.employeeInfoForm.markAllAsTouched();
      this.employeeInfoForm.updateValueAndValidity();
    }
  }

  onCancel(): void {
    this.router.navigateByUrl('/');
  }
}
