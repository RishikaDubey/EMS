// Author: Rishika Dubey | Version: 1.0.0 | Date: 2025-01-14
import { TouchDirective } from './touch.directive';
import { Component, ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

describe('TouchDirective', () => {
  let directive: TouchDirective;
  let fixture: ComponentFixture<any>;
  let element: ElementRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TouchDirective],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DummyComponent);
    element = fixture.debugElement.nativeElement;
    directive = new TouchDirective();

    spyOn(directive.swipeLeft, 'emit');
    spyOn(directive.swipeRight, 'emit');
  });

  describe('onTouchStart', () => {
    it('should set startX to the touch start position', () => {
      const mockEvent = {
        touches: [{ clientX: 100 }],
      } as unknown as TouchEvent;
      directive.onTouchStart(mockEvent);
      expect(directive['startX']).toBe(100);
    });
  });

  describe('onTouchEnd', () => {
    it('should emit swipeLeft if swipe is to the left and threshold is met', () => {
      const mockEvent = {
        changedTouches: [{ clientX: 50 }],
      } as unknown as TouchEvent;
      directive['startX'] = 150;

      directive.onTouchEnd(mockEvent);
      expect(directive.swipeLeft.emit).toHaveBeenCalledWith(
        directive.employeeId
      );
    });

    it('should not emit swipe if swipe is smaller than threshold', () => {
      const mockEvent = {
        changedTouches: [{ clientX: 110 }],
      } as unknown as TouchEvent;
      directive['startX'] = 100;

      directive.onTouchEnd(mockEvent);
      expect(directive.swipeLeft.emit).not.toHaveBeenCalled();
      expect(directive.swipeRight.emit).not.toHaveBeenCalled();
    });
  });
});

@Component({
  template: `<div [touchStart]="employeeId" [touchEnd]="employeeId"></div>`,
})
class DummyComponent {
  employeeId = 1;
}
