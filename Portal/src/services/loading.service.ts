
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  isLoading = signal(false);

  show() {
    // Use a short timeout to prevent flicker on very fast API calls
    setTimeout(() => this.isLoading.set(true), 0);
  }

  hide() {
    setTimeout(() => this.isLoading.set(false), 0);
  }
}
