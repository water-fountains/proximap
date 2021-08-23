import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type TravelMode = 'walking' | 'cycling';

@Injectable()
export class DirectionsService {
  private readonly travelModeSubject = new BehaviorSubject<TravelMode>('walking');
  get travelMode(): Observable<TravelMode> {
    return this.travelModeSubject.asObservable();
  }
  setTravelMode(travelMode: TravelMode) {
    this.travelModeSubject.next(travelMode);
  }
}
