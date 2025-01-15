// Author: Rishika Dubey | Version: 1.0.0 | Date: 2025-01-14
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AddEmployeeComponent } from './component/add-employee/add-employee.component';
import { EmployeeListComponent } from './component/employee-list/employee-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { SelectOptionsComponent } from './component/select-options/select-options.component';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { TouchDirective } from './directive/touch.directive';

@NgModule({
  declarations: [
    AppComponent,
    AddEmployeeComponent,
    SelectOptionsComponent,
    EmployeeListComponent,
    TouchDirective,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CalendarModule,
    DropdownModule,
    InputTextModule,
    ButtonModule,
    MessagesModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    DynamicDialogModule,
  ],
  exports: [ButtonModule],
  providers: [DialogService],
  bootstrap: [AppComponent],
})
export class AppModule {}
