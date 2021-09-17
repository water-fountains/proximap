import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { illegalState } from '../shared/illegalState';
import { Fountain, FountainConfigProperty, FountainSelector } from '../types';

@Injectable()
export class FountainService {
  private readonly fountainSubject = new BehaviorSubject<Fountain | null>(null);
  get fountain(): Observable<Fountain | null> {
    return this.fountainSubject.asObservable();
  }

  private readonly fountainSelectorSubject = new BehaviorSubject<FountainSelector | null>(null);
  get fountainSelector(): Observable<FountainSelector | null> {
    return this.fountainSelectorSubject.asObservable();
  }

  private readonly selectedPropertySubject = new BehaviorSubject<FountainConfigProperty | null>(null);
  get selectedProperty(): Observable<FountainConfigProperty | null> {
    return this.selectedPropertySubject.asObservable();
  }

  setFountain(fountain: Fountain, selector: FountainSelector | null): void {
    this.fountainSubject.next(fountain);
    this.fountainSelectorSubject.next(selector);
  }

  deselectFountain(): void {
    this.fountainSubject.next(null);
    this.fountainSelectorSubject.next(null);
    //TODO @ralf.hauser I guess we should also deselect the property in this case, please check
  }

  selectProperty(name: string | null): void {
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

  deselectProperty(): void {
    this.selectedPropertySubject.next(null);
  }
}
