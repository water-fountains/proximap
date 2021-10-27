import { Injectable } from '@angular/core';
import { LineString } from 'geojson';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';

export type TravelMode = 'walking' | 'cycling';

//TODO @ralf.hauser would be nicer to have official types from mapbox but could not find any
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

export interface Maneuver {
  instruction: string;
}
export interface Step {
  duration: number;
  distance: number;
  geometry: LineString;
  maneuver: Maneuver;
}

@Injectable()
export class DirectionsService {
  private readonly travelModeSubject = new BehaviorSubject<TravelMode>('walking');
  get travelMode(): Observable<TravelMode> {
    return this.travelModeSubject.asObservable();
  }
  setTravelMode(travelMode: TravelMode): void {
    this.travelModeSubject.next(travelMode);
  }
  private readonly directionsSubject = new ReplaySubject<Directions>(1);
  get directions(): Observable<Directions> {
    return this.directionsSubject.asObservable();
  }

  setDirections(data: Directions): void {
    this.directionsSubject.next(data);
  }
}
