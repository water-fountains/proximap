import {EventEmitter, Injectable, OnInit, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NgRedux, select} from '@angular-redux/store';
import {Feature, FeatureCollection, Point} from 'geojson';
import {IAppState, FountainSelector} from './store';
import {GET_DIRECTIONS_SUCCESS, HIGHLIGHT_FOUNTAIN, SELECT_FOUNTAIN_SUCCESS} from './actions';

import distance from 'haversine';
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
    this.userLocation.subscribe((location)=>{this.sortByProximity(location);});
    this.filterCategories.subscribe((fCats)=>{this.filterFountains(fCats);});
    this.loadCityData();
    this.mode.subscribe(mode=>{if(mode=='directions'){this.getDirections();}});
  }

  // Return info for specified fountain
  // get fountainSelected(){
  //   return this._fountainSelected;
  // }

  // public observables used by external components
  get fountainsAll(){
    return this._fountainsAll;
  }
  // Get the initial data
  loadCityData() {
    let fountainsUrl = `${environment.datablueApiUrl}api/v1/fountains?city=zurich`;
    this.http.get(fountainsUrl)
      .subscribe(
        (data:FeatureCollection<any>) => {
          this._fountainsAll = data;
          this.fountainsLoadedSuccess.emit(data);
          this.sortByProximity(this.ngRedux.getState().userLocation);
        }
      );
  }
  // Filter fountains
  filterFountains(fCats) {
    if(this._fountainsAll !== null){
      let filterText = this.normalize(fCats.filterText);
      this._fountainsFiltered = this._fountainsAll.features.filter(f => {
        let name =  this.normalize(`name:${f.properties.name}_wdid:${f.properties.id_wikidata}_opid:${f.properties.id_operator}_osmid:${f.properties.id_osm}`);
        let textOk = name.indexOf(filterText) > -1;
        let waterOk = !fCats.onlySpringwater || f.properties.water_type == 'springwater';
        let notableOk = !fCats.onlyNotable || f.properties.wikipedia_en_url !== null || f.properties.wikipedia_de_url !== null;
        let ageOk = fCats.onlyOlderThan === null || (f.properties.construction_date !== null && f.properties.construction_date <= fCats.onlyOlderThan);
        return textOk && waterOk && ageOk && notableOk;
      });
      this.fountainsFilteredSuccess.emit(this._fountainsFiltered);

      // If only one fountain is left, select it (wait a second because maybe the user is not done searching
      setTimeout(()=>{
        if(this._fountainsFiltered.length === 1){
          this.selectCurrentFountain(this._fountainsFiltered[0].properties.id);
        }
      }, 1000);
    }
  }


  fountainFilter(fountain){
    let filterText = this.normalize(this.filterText);
    let name =  this.normalize(fountain.properties.name);
    let textOk = name.indexOf(filterText) > -1;
    let waterOk = !this.filterCategories.onlySpringwater || fountain.properties.water_type == 'springwater';
    let historicOk = !this.filterCategories.onlyHistoric || fountain.properties.name != 'Unnamed fountain';
    let ageOk = this.filterCategories.onlyOlderThan === null || (fountain.properties.construction_year !== null && fountain.properties.construction_year <= this.filterCategories.onlyOlderThan);
    return textOk && waterOk && ageOk && historicOk;
  }

  sortByProximity(location) {
    if (this._fountainsAll !== null){
      let userPoint:Feature<Point> = {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': location
        },
        'properties': {}
      };
      this._fountainsAll.features.forEach(f => {
        f.properties['distanceFromUser'] = distance(f.geometry.coordinates, location, {
          format: '[lon,lat]',
          unit: 'km'
        });
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
  selectCurrentFountain(selector:FountainSelector){

    // create parameter string
    let params = '';
    for (let key in selector) {
      if (selector.hasOwnProperty(key)) {
        params += `${key}=${selector[key]}&`;
      }
    }

    if (selector !== null){
      // use selector criteria to create api call
      let url = `${environment.datablueApiUrl}api/v1/fountain?${params}`;
      this.http.get(url)
        .subscribe((fountain:Feature<any>) => {
          this.ngRedux.dispatch({type: SELECT_FOUNTAIN_SUCCESS, payload: {fountain: fountain, selector: selector}});
        });
    }
  }

  // force Refresh of data for currently selected fountain
  forceRefresh(): any {
    try {
      let coords = this.ngRedux.getState().fountainSelected.geometry.coordinates;
      let url = `${environment.datablueApiUrl}api/v1/fountain?queryType=byCoords&lat=${coords[1]}&lng=${coords[0]}`;
      this.http.get(url)
        .subscribe((fountain: Feature<any>) => {
          this.ngRedux.dispatch({type: SELECT_FOUNTAIN_SUCCESS, payload: fountain});
        })
    } catch (error) {
      console.log('error fetching latest data')
    }
  }

  getDirections(){
  //  get directions for current user location, fountain, and travel profile
    let s = this.ngRedux.getState();
    let url = 'https://api.mapbox.com/directions/v5/mapbox/walking/' +
      s.userLocation[0] + ',' + s.userLocation[1] + ';' +
      s.fountainSelected.geometry.coordinates[0] + ',' + s.fountainSelected.geometry.coordinates[1] +
      '?access_token=' + environment.mapboxApiKey +
      '&geometries=geojson&steps=true';


    this.http.get(url)
      .subscribe(
        (data:FeatureCollection<any>) => {
          this.ngRedux.dispatch({type: GET_DIRECTIONS_SUCCESS, payload: data});
          this.directionsLoadedSuccess.emit(data);
        });
  }


  normalize(string:string) {
    if(!string){
      return '';
    }else{
      return string.trim().toLowerCase();
    }
  }
}


