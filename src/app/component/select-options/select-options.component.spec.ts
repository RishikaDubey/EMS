// Author: Rishika Dubey | Version: 1.0.0 | Date: 2025-01-14
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectOptionsComponent } from './select-options.component';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

describe('SelectOptionsComponent', () => {
  let component: SelectOptionsComponent;
  let fixture: ComponentFixture<SelectOptionsComponent>;
  let mockDialogRef: jasmine.SpyObj<DynamicDialogRef>;

  beforeEach(() => {
    mockDialogRef = jasmine.createSpyObj('DynamicDialogRef', ['close']);
    TestBed.configureTestingModule({
      declarations: [SelectOptionsComponent],
      providers: [
        { provide: DynamicDialogRef, useValue: mockDialogRef },
        { provide: DynamicDialogConfig, useValue: {} },]
    });
    fixture = TestBed.createComponent(SelectOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog with the selected role', () => {
    const mockRole = { id: 1, name: 'Admin' };

    component.selectRole(mockRole);

    expect(mockDialogRef.close).toHaveBeenCalledWith(mockRole);
  });

  it('should close the dialog with null if role is not provided', () => {
    component.selectRole(null);
    expect(mockDialogRef.close).toHaveBeenCalledWith(null);
  });

  it('should close the dialog with undefined if role is not provided', () => {
    component.selectRole(undefined);
    expect(mockDialogRef.close).toHaveBeenCalledWith(undefined);
  });

});
