// Author: Rishika Dubey | Version: 1.0.0 | Date: 2025-01-14
import { Component, ElementRef, NgZone, OnInit, QueryList, signal, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { IndexedDBService } from 'src/app/services/indexed-db.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  currEmployeeList: any = [];
  prevEmployeeList: any = [];
  @ViewChildren('cardItem') cardItems!: QueryList<ElementRef>;
  startX: number = 0;
  showMessage = signal(false);
  messages: any = [{
    severity: 'contrast',
    detail: 'Employee data has been deleted',
    life: 3000
  }];
  lastDeletedEmployee: any = null;
  isTouchDevice = this.commonService.isTouchDevice;

  constructor(
    private router: Router,
    private indexedDBService: IndexedDBService,
    private readonly ngZone: NgZone,
    private readonly commonService : CommonService
  ) { }

  ngOnInit(): void {
    this.getAllEmployees();
  }

  getAllEmployees() {
    this.prevEmployeeList = [];
    this.currEmployeeList = [];
    this.indexedDBService.getAllEmployees().subscribe({
      next: (employees) => {
        employees.forEach((emp) => {
          if (this.isPreviousDate(emp.endDate)) {
            this.prevEmployeeList.push(emp);
          }

          if (!this.isPreviousDate(emp.endDate)) {
            this.currEmployeeList.push(emp);
          }
        });
      },
      error: (err) => {
        console.error('Error retrieving employees:', err);
      }
    });
  }

  isPreviousDate(dateToCompare: string | Date): boolean {
    const today = new Date();
    const inputDate = new Date(dateToCompare);
    today.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);
    return inputDate < today;
  }

  addUser(): void {
    this.router.navigateByUrl('/add');
  }

  editEmployeeDetails(id: number): void {
    this.router.navigate(['/edit'], { queryParams: { id: id } });
  }

  deleteUser(id: number): void {
    this.lastDeletedEmployee = [...this.currEmployeeList, ...this.prevEmployeeList].find(obj => obj.id === id);
    this.lastDeletedEmployee.showTrash = false;
    this.indexedDBService.deleteItem(id).subscribe({
      next: () => {
        this.getAllEmployees();
        this.showMessage.set(true);
        setTimeout(() => {
          this.ngZone.run(() => {
            this.lastDeletedEmployee = null;
            this.showMessage.set(false);
            console.log('lastDeletedEmployee has been set to null');
          });
        }, this.messages[0].life);
        console.log(`Employee with ${id} deleted.:`);
      },
      error: (err) => {
        console.error('Error retrieving employees:', err);
      }
    });
  }


  onSwipeLeft(event: any, employeeId: number) {
    let employee = this.currEmployeeList.find((emp: any) => emp.id === employeeId);
    if (!employee) {
      employee = this.prevEmployeeList.find((emp: any) => emp.id === employeeId);
    }
    if (employee) {
      employee.showTrash = true;
    }
  }

  onSwipeRight(event: any, employeeId: number) {
    let employee = this.currEmployeeList.find((emp: any) => emp.id === employeeId);
    if (!employee) {
      employee = this.prevEmployeeList.find((emp: any) => emp.id === employeeId);
    }
    if (employee) {
      employee.showTrash = false;
    }
  }

  undoLastDelete() {
    if (this.lastDeletedEmployee != null) {
      this.indexedDBService.addEmployeeDetails(this.lastDeletedEmployee).subscribe({
        next: () => {
          this.lastDeletedEmployee = null;
          this.getAllEmployees();
          this.showMessage.set(false);
          console.log('Employee restored successfully.');
        },
        error: (err) => {
          console.error('Error restoring employee:', err);
          this.getAllEmployees();
        }
      });
    }
  }



}
