import { Routes } from "@angular/router";
import { EmployeeListComponent } from "./component/employee-list/employee-list.component";
import { AddEmployeeComponent } from "./component/add-employee/add-employee.component";

export const routes: Routes = [
  {path:'',
    component: EmployeeListComponent
  },
  {path:'add',
    component: AddEmployeeComponent
  },
  { path: '**', redirectTo:''},
];