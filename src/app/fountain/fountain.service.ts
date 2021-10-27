import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { illegalState } from '../shared/illegalState';
import { Fountain, FountainConfigProperty, FountainSelector } from '../types';

interface FountainAndSelector {
  fountain: Fountain;
  selector: FountainSelector;
}

@Injectable()
export class FountainService {
  private readonly fountainAndSelectorSubject = new BehaviorSubject<FountainAndSelector | null>(null);
  get fountain(): Observable<Fountain | null> {
    return this.fountainAndSelectorSubject.map(x => (x === null ? null : x.fountain));
  }

  get fountainSelector(): Observable<FountainSelector | null> {
    return this.fountainAndSelectorSubject.map(x => (x === null ? null : x.selector));
  }

  private readonly selectedPropertySubject = new BehaviorSubject<FountainConfigProperty | null>(null);
  get selectedProperty(): Observable<FountainConfigProperty | null> {
    return this.selectedPropertySubject.asObservable();
  }

  setFountain(fountain: Fountain, selector: FountainSelector): void {
    this.fountainAndSelectorSubject.next({
      fountain: fountain,
      selector: selector,
    });
  }

  deselectFountain(): void {
    if (this.fountainAndSelectorSubject.value !== null) {
      this.fountainAndSelectorSubject.next(null);
    }
    //TODO @ralf.hauser I guess we should also deselect the property in this case, please check
  }

  selectProperty(name: string | null): void {
    if (name == null) {
      this.deselectProperty();
    } else {
      if (this.fountainAndSelectorSubject.value !== null) {
        this.selectedPropertySubject.next(this.fountainAndSelectorSubject.value.fountain.properties[name]);
      } else {
        illegalState('cannot set a property if no fountain is selected');
      }
    }
  }

  deselectProperty(): void {
    this.selectedPropertySubject.next(null);
  }
}
