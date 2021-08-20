import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type LongLat = [number, number];

@Injectable()
export class UserLocationService {
  private readonly userLocationSubject = new BehaviorSubject<LongLat | null>(null);
  get userLocation(): Observable<LongLat> {
    return this.userLocationSubject.asObservable();
  }
  setUserLocation(longLat: LongLat) {
    this.userLocationSubject.next(longLat);
  }
}
