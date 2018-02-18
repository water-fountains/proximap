import {EventEmitter, Injectable, OnInit, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NgRedux, select} from 'ng2-redux';
import {Feature, FeatureCollection} from 'geojson';
import {DEFAULT_FOUNTAINS} from '../assets/defaultData';
import {IAppState} from './store';
import {SELECT_FOUNTAIN_SUCCESS} from './actions';

const fountainsUrl: string = '../assets/brunnen.json';

@Injectable()
export class DataService {
  private _fountainSelected: Feature<any> = null;
  private _fountainsAll: FeatureCollection<any> = null;
  private _fountainsFiltered: Array<any> = null;
  @select() filterText;
  @select() fountainId;
  @Output() fountainSelectedSuccess: EventEmitter<Feature<any>> = new EventEmitter<Feature<any>>();
  @Output() fountainsLoadedSuccess: EventEmitter<FeatureCollection<any>> = new EventEmitter<FeatureCollection<any>>();
  @Output() fountainsFilteredSuccess: EventEmitter<Array<string>> = new EventEmitter<Array<string>>();

  constructor(private http: HttpClient, private ngRedux: NgRedux<IAppState>) {
    this.fountainId.subscribe((id)=>{this.selectCurrentFountain()});
    this.filterText.subscribe((text)=>{this.filterFountains(text)});
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
          this._fountainsAll = data;
          this.fountainsLoadedSuccess.emit(data);
          this.filterFountains(this.ngRedux.getState().filterText);
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


