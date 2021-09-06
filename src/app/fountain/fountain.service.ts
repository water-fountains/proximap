import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { illegalState } from '../shared/illegalState';
import { FountainSelector } from '../store';
import { Fountain, FountainConfigProperty } from '../types';

@Injectable()
export class FountainService {
  private readonly fountainSubject = new BehaviorSubject<Fountain | null>(null);
  get fountain(): Observable<Fountain | null> {
    return this.fountainSubject.asObservable();
  }

  private readonly fountainSelectorSubject = new BehaviorSubject<FountainSelector | string | null>(null);
  get fountainSelector(): Observable<FountainSelector | string | null> {
    return this.fountainSelectorSubject.asObservable();
  }

  // TODO @ralf.hauser, what exactly is selectedProperty, a
  private readonly selectedPropertySubject = new BehaviorSubject<FountainConfigProperty | null>(null);
  get selectedProperty(): Observable<FountainConfigProperty | null> {
    return this.selectedPropertySubject.asObservable();
  }

  //TODO @ralf.hauser `| string` only due to cityOrId in route-validator.service.ts
  setFountain(fountain: Fountain, selector: FountainSelector | string | null) {
    this.fountainSubject.next(fountain);
    this.fountainSelectorSubject.next(selector);
  }

  deselectFountain() {
    this.fountainSubject.next(null);
    this.fountainSelectorSubject.next(null);
    //TODO @ralf.hauser I guess we should also deselect the property in this case, please check
  }

  selectProperty(name: string | null) {
    if (name == null) {
      this.deselectProperty();
    } else {
      if (this.fountainSubject.value !== null) {
        this.selectedPropertySubject.next(this.fountainSubject.value.properties[name]);
      } else {
        illegalState('cannot set a property if no fountain is selected');
      }
    }
  }

  deselectProperty() {
    this.selectedPropertySubject.next(null);
  }
}
