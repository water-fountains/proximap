import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppError } from '../types';

@Injectable()
export class IssueService {
  private readonly appErrorsSubject = new BehaviorSubject<AppError[]>([]);
  get appErrors(): Observable<AppError[]> {
    return this.appErrorsSubject.asObservable();
  }

  addAppError(appError: AppError) {
    this.appErrorsSubject.next(this.appErrorsSubject.value.concat(appError));
  }
}
