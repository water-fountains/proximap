import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LngLat } from '../types';

@Injectable()
export class UserLocationService {
  private readonly userLocationSubject = new BehaviorSubject<LngLat | null>(null);
  get userLocation(): Observable<LngLat> {
    return this.userLocationSubject.asObservable();
  }
  setUserLocation(longLat: LngLat) {
    this.userLocationSubject.next(longLat);
  }
}
