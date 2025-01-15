import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[touchStart], [touchEnd]'
})
export class TouchDirective {
  @Input() employeeId: number = 0;
  @Output() swipeLeft = new EventEmitter<number>();
  @Output() swipeRight = new EventEmitter<number>();
  @Output() mouseEnter = new EventEmitter<number>();
  @Output() mouseExit = new EventEmitter<number>();

  private startX = 0;
  private readonly threshold = 80;

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.startX = event.touches[0].clientX;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    const diff = event.changedTouches[0].clientX - this.startX;
    const element = event.target as HTMLElement;

    if (diff < -this.threshold) {
      this.swipeLeft.emit(this.employeeId);
    } else if (diff > this.threshold) {
      this.swipeRight.emit(this.employeeId);
    }
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.mouseEnter.emit(this.employeeId);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.mouseExit.emit(this.employeeId);
  }


}
