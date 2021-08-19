import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppError, DataIssue } from '../types';

@Injectable()
export class IssueService {
  private readonly appErrorsSubject = new BehaviorSubject<AppError[]>([]);
  get appErrors(): Observable<AppError[]> {
    return this.appErrorsSubject.asObservable();
  }
  appendAppError(appError: AppError) {
    this.appErrorsSubject.next(this.appErrorsSubject.value.concat(appError));
  }

  private readonly dataIssuesSubject = new BehaviorSubject<DataIssue[]>([]);
  get dataIssues(): Observable<DataIssue[]> {
    return this.dataIssuesSubject.asObservable();
  }

  setDataIssues(dataIssues: DataIssue[]) {
    this.dataIssuesSubject.next(dataIssues);
  }
}
