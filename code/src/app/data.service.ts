import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {NgRedux, select} from 'ng2-redux';
import {IAppState} from './store';

const fountainsUrl: string = '../assets/brunnen.json';

@Injectable()
export class DataService {
  private _fountains: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  private _filteredFountains: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  private _selectedFountain: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  @select() filterText;
  @select() fountainId;

  constructor(private http: HttpClient, private ngRedux: NgRedux<IAppState>) {
    this.loadInitialData();
    this.filterText.subscribe(
      text => {
        this.filterFountains(text);
      }
    );
  }

  // public observable used by external components
  get filteredFountains(){
    return this.asObservable(this._filteredFountains)
  }
  // Get the initial data
  loadInitialData() {
    this.http.get(fountainsUrl)
      .subscribe(
        data => {
          this._fountains.next(data['features']);
          this._filteredFountains.next(data['features']);
        }
      )
  }

  filterFountains(text) {
    if(text.length <= 3){
      this._filteredFountains.next(this._fountains.getValue())
    }else {
      this._filteredFountains.next(this._fountains.getValue().filter(f=>{
        return (f.properties.nummer + f.properties.bezeichnung).includes(text)
      }))
    }
  }

  asObservable(subject: BehaviorSubject<any>) {
    return new Observable(fn => subject.subscribe(fn));
  }
}
