import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IndexedDBService } from 'src/app/services/indexDB.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent {
  employeeList: any = [];
  constructor(
    private readonly router: Router,
    private readonly indexedDBService: IndexedDBService
  ) { }

  ngOnInit(): void {
    this.getAllEmployees();
  }

  getAllEmployees() {
    this.indexedDBService.getAllEmployees().subscribe({
      next: (employees) => {
        this.employeeList = employees;
        console.log('Employees:', employees);
      },
      error: (err) => {
        console.error('Error retrieving employees:', err);
      }
    });
  }

  addUser(): void {
    this.router.navigateByUrl('/add');
  }

  editEmployeeDetails(id: number): void {
    this.router.navigate(['/add'],  {queryParams: { id:  id}});
  }

  deleteUser(id: number): void {
    this.indexedDBService.deleteItem(id).subscribe({
      next: (employees) => {
        this.getAllEmployees();
        console.log(`Employee with ${id} deleted S\successdully.:`);
      },
      error: (err) => {
        console.error('Error retrieving employees:', err);
      }
    });
  }
}
