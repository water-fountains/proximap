import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable()
export class LayoutService {
  constructor(private breakpointObserver: BreakpointObserver) {}

  public get isMobile(): Observable<boolean> {
    return this.breakpointObserver
      .observe(['(max-width: 900px)'])
      .map(state => state.matches)
      .pipe(shareReplay(1));
  }
}
