import { Injectable } from '@angular/core';
import { LineString } from 'geojson';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { LayoutService } from '../core/layout.service';

export type TravelMode = 'walking' | 'cycling';
export interface Directions {
  routes: Route[];
}
export interface Route {
  duration: number;
  distance: number;
  geometry: LineString;
  legs: Leg[];
}
export interface Leg {
  steps: Step[];
  duration: number;
}
export interface Step {
  duration: number;
  distance: number;
  geometry: LineString;
}

@Injectable()
export class DirectionsService {
  constructor(private layoutService: LayoutService) {}

  private readonly travelModeSubject = new BehaviorSubject<TravelMode>('walking');
  get travelMode(): Observable<TravelMode> {
    return this.travelModeSubject.asObservable();
  }
  setTravelMode(travelMode: TravelMode) {
    this.travelModeSubject.next(travelMode);
  }
  private readonly directionsSubject = new ReplaySubject<Directions>(1);
  get directions(): Observable<Directions> {
    return this.directionsSubject.asObservable();
  }

  setDirections(data: Directions) {
    this.directionsSubject.next(data);
    this.layoutService.setMode('directions');
  }
}
