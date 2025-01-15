// Author: Rishika Dubey | Version: 1.0.0 | Date: 2025-01-14
import { computed, Injectable, OnDestroy, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService implements OnDestroy {

  _isTouchDevice = signal(false);;
  isTouchDevice = computed(() => this._isTouchDevice());

  constructor() {
    this.detectTouchDevice();
    window.addEventListener('resize', this.detectTouchDevice.bind(this));
    window.addEventListener('orientationchange', this.detectTouchDevice.bind(this));
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.detectTouchDevice.bind(this));
    window.removeEventListener('orientationchange', this.detectTouchDevice.bind(this));
  }

  private detectTouchDevice() {
    this._isTouchDevice.set('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }
}
