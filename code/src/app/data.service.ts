import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';

const fountainsUrl: string = '../assets/brunnen.json';



@Injectable()
export class DataService {
  private _fountains: BehaviorSubject<any> = new BehaviorSubject({});

  constructor(private http: HttpClient) {
    this.loadInitialData();
  }

  get fountains(){
    return this.asObservable(this._fountains)
  }

  loadInitialData() {
    this.http.get(fountainsUrl)
      .subscribe(
        data => {
          this._fountains.next(data['features']);
          console.log(this._fountains.getValue())
        }
      )
  }

  asObservable(subject: BehaviorSubject<any>) {
    return new Observable(fn => subject.subscribe(fn));
  }
}
