import { Component } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-select-options',
  templateUrl: './select-options.component.html',
  styleUrls: ['./select-options.component.scss']
})
export class SelectOptionsComponent {
  roles = [
    { id: 1, label: 'Product Designer', value: 'product-designer' },
    { id: 2, label: 'Flutter Developer', value: 'flutter-developer' },
    { id: 3, label: 'QA Tester', value: 'qa-tester' },
    { id: 4, label: 'Product Owner', value: 'product-owner' },
  ];

  constructor(public ref: DynamicDialogRef) {
    console.log('DynamicDialogRef initialized:', ref);
  }

  selectRole(role: any) {
    this.ref.close(role);
  }

}