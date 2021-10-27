import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { Directions, DirectionsService } from '../directions/directions.service';
import { FountainService } from '../fountain/fountain.service';
import { City } from '../locations';
import { CityService } from '../city/city.service';
import { Fountain, FountainSelector } from '../types';

export type PreviewState = 'open' | 'closed';
export type Mode = 'map' | 'details' | 'directions';
@Injectable()
export class LayoutService {
  constructor(
    private breakpointObserver: BreakpointObserver,
    private fountainService: FountainService,
    private cityService: CityService,
    private directionService: DirectionsService
  ) {}

  public get isMobile(): Observable<boolean> {
    return this.breakpointObserver
      .observe(['(max-width: 900px)'])
      .map(state => state.matches)
      .pipe(shareReplay(1));
  }

  private readonly showListSubject = new BehaviorSubject<boolean>(false);
  get showList(): Observable<boolean> {
    return this.showListSubject.asObservable();
  }
  setShowList(shallShow: boolean): void {
    this.showListSubject.next(shallShow);
  }

  private readonly showMenuSubject = new BehaviorSubject<boolean>(false);
  get showMenu(): Observable<boolean> {
    return this.showMenuSubject.asObservable();
  }
  setShowMenu(shallShow: boolean): void {
    this.showMenuSubject.next(shallShow);
  }

  closeSidebars(): void {
    this.setShowList(false);
    this.setShowMenu(false);
  }

  private readonly previewStateSubject = new BehaviorSubject<PreviewState>('closed');
  get previewState(): Observable<PreviewState> {
    return this.previewStateSubject.asObservable();
  }
  setPreviewState(state: PreviewState) {
    this.previewStateSubject.next(state);
  }

  private readonly modeSubject = new BehaviorSubject<Mode>('map');
  get mode(): Observable<Mode> {
    return this.modeSubject.asObservable();
  }
  setMode(mode: Mode): void {
    if (mode === 'map') {
      this.closeDetail();
    } else {
      this.modeSubject.next(mode);
    }
  }
  closeNavigation(): void {
    this.modeSubject.next('details');
  }
  closeDetail(): void {
    this.fountainService.deselectFountain();
    this.modeSubject.next('map');
  }

  switchToDetail(fountain: Fountain, selector: FountainSelector): void {
    this.setShowList(false);
    this.setMode('details');
    this.fountainService.setFountain(fountain, selector);
  }

  setDirections(data: Directions) {
    this.setMode('directions');
    this.directionService.setDirections(data);
  }

  flyToCity(city: City): void {
    this.cityService.setCity(city);
    this.closeDetail();
  }
}
