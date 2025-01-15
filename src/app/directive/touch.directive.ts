// Author: Rishika Dubey | Version: 1.0.0 | Date: 2025-01-14
import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[touchStart], [touchEnd]',
})
export class TouchDirective {
  @Input() employeeId: number = 0;
  @Output() swipeLeft = new EventEmitter<number>();
  @Output() swipeRight = new EventEmitter<number>();

  private startX = 0;
  private readonly touchThreshold = 80;

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.startX = event.touches[0].clientX;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    const diff = event.changedTouches[0].clientX - this.startX;

    if (Math.abs(diff) >= this.touchThreshold) {
      if (diff < 0) {
        this.swipeLeft.emit(this.employeeId);
      } else {
        this.swipeRight.emit(this.employeeId);
      }
    }
  }

}
