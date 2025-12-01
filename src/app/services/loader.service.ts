import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  isLoading = new BehaviorSubject<boolean>(false);
  hasError = false;
  private lastRequestFn: (() => Observable<any>) | null = null;


  show(requestFn?: () => Observable<any>) {
    Promise.resolve().then(() => {
      this.isLoading.next(true);
      this.hasError = false;
      this.lastRequestFn = requestFn || null;
    });
  }

  hide(delay: number = 0) {
    setTimeout(() => {
      Promise.resolve().then(() => this.isLoading.next(false));
    }, delay);
  }

  setError() {
    this.hasError = true;
    Promise.resolve().then(() => this.isLoading.next(true));
  }

  retryLastRequest() {
    if (this.lastRequestFn) {
      this.lastRequestFn().subscribe({
        next: () => this.hide(150),
        error: () => this.setError()
      });
    }
  }
}
