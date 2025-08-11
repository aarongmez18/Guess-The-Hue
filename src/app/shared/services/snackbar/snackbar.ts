import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  private messageSource = new Subject<{ message: string; error: boolean }>();
  message$ = this.messageSource.asObservable();

  showMessage(message: string, isError = false) {
    this.messageSource.next({ message, error: isError });
  }
}
