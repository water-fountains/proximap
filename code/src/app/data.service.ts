import {EventEmitter, Injectable, OnInit, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NgRedux, select} from 'ng2-redux';
import {Feature, FeatureCollection, Point} from 'geojson';
import {DEFAULT_FOUNTAINS} from '../assets/defaultData';
import {IAppState} from './store';
import {HIGHLIGHT_FOUNTAIN, SELECT_FOUNTAIN_SUCCESS} from './actions';

const fountainsUrl: string = '../assets/brunnen.json';
import {distance}  from '@turf/turf';

@Injectable()
export class DataService {
  private _fountainSelected: Feature<any> = null;
  private _fountainsAll: FeatureCollection<any> = null;
  private _fountainsFiltered: Array<any> = null;
  @select() filterText;
  @select() fountainId;
  @select() userLocation;
  @Output() fountainSelectedSuccess: EventEmitter<Feature<any>> = new EventEmitter<Feature<any>>();
  @Output() fountainsLoadedSuccess: EventEmitter<FeatureCollection<any>> = new EventEmitter<FeatureCollection<any>>();
  @Output() fountainsFilteredSuccess: EventEmitter<Array<string>> = new EventEmitter<Array<string>>();

  constructor(private http: HttpClient, private ngRedux: NgRedux<IAppState>) {
    // this.fountainId.subscribe((id)=>{this.selectCurrentFountain()});
    this.filterText.subscribe((text)=>{this.filterFountains(text)});
    this.userLocation.subscribe((location)=>{this.sortByProximity(location)});
    this.loadCityData();
  }

  // Return info for specified fountain
  // get fountainSelected(){
  //   return this._fountainSelected;
  // }

  // public observables used by external components
  get fountainsAll(){
    return this._fountainsAll
  }
  // Get the initial data
  loadCityData() {
    this.http.get(fountainsUrl)
      .subscribe(
        (data:FeatureCollection<any>) => {
          data.features.forEach(f=>{
            if(!f.properties.bezeichnung){
              f.properties.bezeichnung = 'Unnamed fountain'
            }
          });
          this._fountainsAll = data;
          this.fountainsLoadedSuccess.emit(data);
          this.sortByProximity(this.ngRedux.getState().userLocation);
          this.selectCurrentFountain();
        }
      )
  }
  // Filter fountains
  filterFountains(text) {
    if(this._fountainsAll !== null){
      this._fountainsFiltered = this._fountainsAll.features.filter(f => {
        let name =  this.normalize(f.properties.bezeichnung);
        let code =  this.normalize(f.properties.nummer);
        return name.indexOf(text) > -1 || code.indexOf(text) > -1;
      });
      this.fountainsFilteredSuccess.emit(this._fountainsFiltered);
      // this.ngRedux.dispatch({type:HIGHLIGHT_FOUNTAIN, payload: this._fountainsFiltered[0]})
    }
  }

  sortByProximity(location) {

    if (this._fountainsAll !== null){
      let userPoint:Feature<Point> = {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": location
        },
        "properties": {}
      };
      this._fountainsAll.features.forEach(f => {
        f.properties['distanceFromUser'] = distance(f, userPoint);
      });
      this._fountainsAll.features.sort((f1, f2) =>{
        return f1.properties.distanceFromUser - f2.properties.distanceFromUser;
      });
      // redo filtering
      this.filterFountains(this.ngRedux.getState().filterText);
    }
  }

  // Select current fountain
  selectCurrentFountain(){
    let id = this.ngRedux.getState().fountainId;
    if (id !== null && this._fountainsAll !== null){
      let f =  this._fountainsAll.features.filter(f=>{
        return f.properties.nummer == id;
      });
      // this.fountainSelectedSuccess.emit(this._fountainSelected);
      if(f.length > 0){
        this.ngRedux.dispatch({type: SELECT_FOUNTAIN_SUCCESS, payload: f[0]});
      }

    }

  }

  normalize(string:string) {
    if(!string){
      return '';
    }else{
      return string.trim().toLowerCase();
    }
  }
}


