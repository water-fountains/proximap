import {EventEmitter, Injectable, OnInit, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NgRedux, select} from '@angular-redux/store';
import {Feature, FeatureCollection, Point} from 'geojson';
import {DEFAULT_FOUNTAINS} from '../assets/defaultData';
import {IAppState} from './store';
import {HIGHLIGHT_FOUNTAIN, SELECT_FOUNTAIN_SUCCESS} from './actions';

const fountainsUrl: string = '../assets/brunnen.json';
import distance from '@turf/distance/index.js';
import {environment} from '../environments/environment';

@Injectable()
export class DataService {
  private _fountainSelected: Feature<any> = null;
  private _fountainsAll: FeatureCollection<any> = null;
  private _fountainsFiltered: Array<any> = null;
  @select() filterText;
  @select() filterCategories;
  @select() fountainId;
  @select() userLocation;
  @select() mode;
  @Output() fountainSelectedSuccess: EventEmitter<Feature<any>> = new EventEmitter<Feature<any>>();
  @Output() fountainsLoadedSuccess: EventEmitter<FeatureCollection<any>> = new EventEmitter<FeatureCollection<any>>();
  @Output() fountainsFilteredSuccess: EventEmitter<Array<string>> = new EventEmitter<Array<string>>();
  @Output() directionsLoadedSuccess: EventEmitter<object> = new EventEmitter<object>();

  constructor(private http: HttpClient, private ngRedux: NgRedux<IAppState>) {
    // this.fountainId.subscribe((id)=>{this.selectCurrentFountain()});
    // this.filterText.subscribe(()=>{this.filterFountains()});
    this.userLocation.subscribe((location)=>{this.sortByProximity(location)});
    this.filterCategories.subscribe((fCats)=>{this.filterFountains(fCats)});
    this.loadCityData();
    this.mode.subscribe(mode=>{if(mode=='directions'){this.getDirections()}})
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
          // if fountain has no name, give it a default name.
          data.features.forEach(f=>{
            if(!f.properties.bezeichnung){
              f.properties.bezeichnung = 'Unnamed fountain'
            }
          });
          this._fountainsAll = data;
          this.fountainsLoadedSuccess.emit(data);
          this.sortByProximity(this.ngRedux.getState().userLocation);
          this.selectCurrentFountain(this.ngRedux.getState().fountainId);
        }
      )
  }
  // Filter fountains
  filterFountains(fCats) {
    if(this._fountainsAll !== null){
      let filterText = this.normalize(fCats.filterText);
      this._fountainsFiltered = this._fountainsAll.features.filter(f => {
        let name =  this.normalize(f.properties.bezeichnung);
        let textOk = name.indexOf(filterText) > -1;
        let waterOk = !fCats.onlySpringwater || f.properties.wasserart_txt == 'Quellwasser';
        let historicOk = !fCats.onlyHistoric || f.properties.bezeichnung != 'Unnamed fountain';
        let ageOk = fCats.onlyOlderThan === null || (f.properties.historisches_baujahr !== null && f.properties.historisches_baujahr <= fCats.onlyOlderThan);
        return textOk && waterOk && ageOk && historicOk;
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
      let fCats = this.ngRedux.getState().filterCategories;
      this.filterFountains(fCats);
    }
  }

  // Select current fountain
  selectCurrentFountain(id){
    // let id = this.ngRedux.getState().fountainId;
    if (id !== null && this._fountainsAll !== null){
      let f =  this._fountainsAll.features.filter(f=>{
        return f.properties.nummer == id;
      });
      // if a fountain is found, get the additional information
      if(f.length > 0){
        let fountain = f[0];
        let url = `${environment.datablueApiUrl}api/v1/fountain?lat=${fountain.geometry.coordinates[1]}&lng=${fountain.geometry.coordinates[0]}`;
        console.log(url);
        this.http.get(url)
          .subscribe((extra_info:Feature<any>) => {
          // if('pano_url' in extra_info.properties){
          //   console.log(extra_info.properties.pano_url);
          //   fountain.properties['pano_url'] = extra_info.properties.pano_url;
          // }
            this.ngRedux.dispatch({type: SELECT_FOUNTAIN_SUCCESS, payload: extra_info});
          });

      }
    }
  }

  getDirections(){
  //  get directions for current user location, fountain, and travel profile
    let s = this.ngRedux.getState();
    let url = "https://api.mapbox.com/directions/v5/mapbox/walking/" +
      s.userLocation[0] + "," + s.userLocation[1] + ";" +
      s.fountainSelected.geometry.coordinates[0] + "," + s.fountainSelected.geometry.coordinates[1] +
      "?access_token=" + environment.mapboxApiKey +
      "&geometries=geojson";

    this.http.get(url)
      .subscribe(
        (data:FeatureCollection<any>) => {
          this.directionsLoadedSuccess.emit(data);
        })
  }


  normalize(string:string) {
    if(!string){
      return '';
    }else{
      return string.trim().toLowerCase();
    }
  }
}


