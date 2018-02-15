import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import { select} from 'ng2-redux';
import {GeoJSON} from 'leaflet';

const fountainsUrl: string = '../assets/brunnen.json';

@Injectable()
export class DataService {
  private _fountains:GeoJSON = null;
  @select() filterText;
  @select() fountainId;
  @Output() fountainsLoaded: EventEmitter<GeoJSON> = new EventEmitter<GeoJSON>();

  constructor(private http: HttpClient) {
    this.loadInitialData();
  }

  // Return info for specified fountain
  public getFountain(id){
    return this.fountains['features'].filter(f=>{
      return f['properties']['nummer'] == id;
    })[0]
  }

  // public observables used by external components
  get fountains(){
    return this._fountains
  }
  // Get the initial data
  loadInitialData() {
    this.http.get(fountainsUrl)
      .subscribe(
        (data:GeoJSON) => {
          this._fountains = data;
          this.fountainsLoaded.emit(data);
        }
      )
  }

  asObservable(subject: BehaviorSubject<any>) {
    return new Observable(fn => subject.subscribe(fn));
  }
}
