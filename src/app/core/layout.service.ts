import { NgRedux } from '@angular-redux/store';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { SELECT_FOUNTAIN_SUCCESS } from '../actions';
import { FountainSelector, IAppState } from '../store';
import { Fountain } from '../types';

@Injectable()
export class LayoutService {
  constructor(private ngRedux: NgRedux<IAppState>, private breakpointObserver: BreakpointObserver) {}

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

  //TODO @ralf.hauser `| string` only due to cityOrId in route-validator.service.ts
  switchToDetail(fountain: Fountain, selector: FountainSelector | string) {
    this.setShowList(false);
    this.ngRedux.dispatch({ type: SELECT_FOUNTAIN_SUCCESS, payload: { fountain: fountain, selector: selector } });
  }
}
