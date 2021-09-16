import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { FountainService } from '../fountain/fountain.service';
import { FountainSelector } from '../store';
import { Fountain } from '../types';

export type PreviewState = 'open' | 'closed';
export type Mode = 'map' | 'details' | 'directions';
@Injectable()
export class LayoutService {
  constructor(private breakpointObserver: BreakpointObserver, private fountainService: FountainService) {}

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
  setShowList(shallShow: boolean) {
    this.showListSubject.next(shallShow);
  }

  private readonly showMenuSubject = new BehaviorSubject<boolean>(false);
  get showMenu(): Observable<boolean> {
    return this.showMenuSubject.asObservable();
  }
  setShowMenu(shallShow: boolean) {
    this.showMenuSubject.next(shallShow);
  }

  closeSidebars() {
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
  setMode(mode: Mode) {
    if (mode === 'map') {
      this.closeDetail();
    } else {
      this.modeSubject.next(mode);
    }
  }
  closeNavigation() {
    this.modeSubject.next('details');
  }
  closeDetail() {
    this.fountainService.deselectFountain();
    this.modeSubject.next('map');
  }

  //TODO @ralf.hauser `| string` only due to cityOrId in route-validator.service.ts
  switchToDetail(fountain: Fountain, selector: FountainSelector | string) {
    this.setShowList(false);
    this.setMode('details');
    this.fountainService.setFountain(fountain, selector);
  }
}
