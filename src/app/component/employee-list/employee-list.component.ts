// Author: Rishika Dubey | Version: 1.0.0 | Date: 2025-01-14
import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { IndexedDBService } from 'src/app/services/indexDB.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent {
  currEmployeeList: any = [];
  prevEmployeeList: any = [];
  @ViewChildren('cardItem') cardItems!: QueryList<ElementRef>;
  startX: number = 0;
  showMessage: boolean = false;
  isTouchDevice: boolean = false;
  messages: any = [{
    severity: 'contrast',
    detail: 'Employee data has been deleted',
    life: 500000
  }];

  constructor(
    private readonly router: Router,
    private readonly indexedDBService: IndexedDBService
  ) { }

  ngOnInit(): void {
    this.detectTouchDevice();
    window.addEventListener('resize', this.detectTouchDevice.bind(this));
    window.addEventListener('orientationchange', this.detectTouchDevice.bind(this));


    this.getAllEmployees();
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.detectTouchDevice.bind(this));
    window.removeEventListener('orientationchange', this.detectTouchDevice.bind(this));
  }

  private detectTouchDevice() {
    this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
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
    this.router.navigate(['/add'], { queryParams: { id: id } });
  }

  deleteUser(id: number): void {
    this.indexedDBService.deleteItem(id).subscribe({
      next: (employees) => {
        this.getAllEmployees();
        this.showMessage = true;
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
    console.log("swiped right.", employeeId);
  }



}
