import { Injectable } from '@angular/core';
import _ from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';
import { illegalState } from '../shared/illegalState';
import { Fountain, FountainConfigProperty, FountainSelector } from '../types';

interface FountainAndSelector {
  fountain: Fountain;
  selector: FountainSelector;
}

@Injectable()
export class FountainService {
  private readonly fountainAndSelectorSubject = new BehaviorSubject<FountainAndSelector | undefined>(undefined);
  get fountain(): Observable<Fountain | undefined> {
    return this.fountainAndSelectorSubject.map(x => x?.fountain);
  }

  get fountainSelector(): Observable<FountainSelector | undefined> {
    return this.fountainAndSelectorSubject.map(x => x?.selector);
  }

  private readonly selectedPropertySubject = new BehaviorSubject<FountainConfigProperty | undefined>(undefined);
  get selectedProperty(): Observable<FountainConfigProperty | undefined> {
    return this.selectedPropertySubject.asObservable();
  }

  setFountain(fountain: Fountain, selector: FountainSelector): void {
    const newState = {
      fountain: fountain,
      selector: selector,
    };
    if (!_.isEqual(newState, this.fountainAndSelectorSubject.value)) {
      this.fountainAndSelectorSubject.next(newState);
    }
  }

  deselectFountain(): void {
    if (this.fountainAndSelectorSubject.value !== undefined) {
      this.fountainAndSelectorSubject.next(undefined);
    }
    //TODO @ralf.hauser I guess we should also deselect the property in this case, please check
  }

  selectProperty(name: string | null): void {
    if (name == null) {
      this.deselectProperty();
    } else {
      if (this.fountainAndSelectorSubject.value !== undefined) {
        this.selectedPropertySubject.next(this.fountainAndSelectorSubject.value.fountain.properties[name]);
      } else {
        illegalState('cannot set a property if no fountain is selected');
      }
    }
  }

  deselectProperty(): void {
    this.selectedPropertySubject.next(undefined);
  }
}
