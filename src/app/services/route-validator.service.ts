/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import {NgRedux, select} from '@angular-redux/store/lib/src';
import {Feature} from 'geojson';
import {HttpClient} from '@angular/common/http';
import {Observable, Subscription} from 'rxjs';
import {DataService} from '../data.service';
import {isObject} from 'util';
import {CHANGE_CITY, CHANGE_LANG, CHANGE_MODE, CLOSE_DETAIL, DESELECT_FOUNTAIN, UPDATE_FILTER_CATEGORIES} from '../actions';
import {FountainSelector, IAppState} from '../store';

import _ from 'lodash'

export interface QueryParams {
  lang?: string,
  l?: string,  // short version of lang param for #159
  mode?: string,
  queryType?: string,
  database?: string,
  idval?: string,
  i?: string, // url for identifiers, for #159
  lat?: number,
  lng?: number,
  onlyOlderThan?: number,
  onlyNotable?: boolean,
  onlySpringwater?: string,
  filterText?: string
}

@Injectable({
  providedIn: 'root'
})
export class RouteValidatorService {
  // Validates route names

  allowedValues = {
    lang: {
      action: CHANGE_LANG,
      default_code: 'de',
      values: [
        {
          name: 'English',
          code: 'en',
          aliases: ['english', 'anglais', 'englisch', 'en', 'e']
        }, {
          name: 'Français',
          code: 'fr',
          aliases: ['french', 'französisch', 'franzoesisch', 'francais', 'fr', 'f']
        }, {
          name: 'Deutsch',
          code: 'de',
          aliases: ['german', 'allemand', 'deutsch', 'de', 'd']
        }
      ]
    },
    mode: {
      action: CHANGE_MODE,
      default_code: 'map',
      values: [
        {
          aliases: ['map', 'karte', 'carte'],
          code: 'map'
        },
        {
          aliases: ['details'],
          code: 'details'
        },
        {
          aliases: ['navigate', 'directions', 'navigieren', 'navigation'],
          code: 'directions'
        },
      ]
    },
    city: {
      action: CHANGE_CITY,
      default_code: 'ch-zh',
      values: [
        {
          code: 'ch-zh',
          aliases: ['zuerich', 'zuri', 'zürich ', 'zurich', 'ch-zh']
        },
        {
          code: 'ch-ge',
          aliases: ['genève', 'geneve', 'genf', 'geneva', '/gen%C3%A8ve', 'ch-ge']
        },
        {
          code: 'ch-bl',
          aliases: ['bale', 'bâle', 'basel', '/b%C3%A2le', 'ch-bl']
        },
        {
          code: 'ch-lz',
          aliases: ['lucerne', 'luzern', 'ch-lz']
        },
        {
          code: "us-nyc",
          aliases: ["NewYork", 'new_york', 'nyc', 'us-nyc']
        }
      ]
    }
  };

  constructor(public router: Router,
              private route: ActivatedRoute,
              private http: HttpClient,
              private ngRedux: NgRedux<IAppState>,
              private dataService: DataService) {
  }

  validate(key: string, value: any): void {
    if (value !== null) {
      //  start with default code value
      let code = this.allowedValues[key].default_code;

      // see if there is a match among aliases
      for (let i = 0; i < this.allowedValues[key].values.length; ++i) {
        // find matching
        let index = this.allowedValues[key].values[i].aliases.indexOf(value.toLowerCase());
        if (index >= 0) {
          code = this.allowedValues[key].values[i].code;
        }
      }
      // update if different from current state
      if (code !== this.ngRedux.getState()[key]) {
        this.ngRedux.dispatch({type: this.allowedValues[key].action, payload: code});
      }
    }
  }

  getQueryParams() {
    // Get query parameter values from app state. use short query params by default for #159
    let state = this.ngRedux.getState();
    let queryParams:QueryParams = {
      l: state.lang, // use short language by default
      // mode: state.mode,
    };
    // if (state.fountainSelector !== null) {
    //   for (let p of ['queryType', 'database', 'idval', 'lat', 'lng']) {
    //     if (state.fountainSelector[p] !== null) {
    //       queryParams[p] = state.fountainSelector[p];
    //     }
    //   }
    //  determine if a fountain is selected
    if (state.fountainSelector !== null) {
      if (state.fountainSelector.queryType === 'byCoords') {
        // if selection by coordinates
        queryParams.lat = state.fountainSelector.lat;
        queryParams.lng = state.fountainSelector.lng;

      } else if (state.fountainSelector.queryType === 'byId') {
        // if selection by id
        queryParams.i = state.fountainSelector.idval

      }
    }
    return queryParams;
  }

  updateFromRouteParams(paramsMap):void {
    // update application state (indirectly) from url route params

    let state = this.ngRedux.getState();

    // validate lang
    let lang = paramsMap.get('lang') || paramsMap.get('l');
    this.validate('lang', lang);

    // create valid fountain selector from query params
    let fountainSelector:FountainSelector = {
      queryType: 'byId'
    };

    // See what values are available
    let id:string = paramsMap.get('i') || paramsMap.get('idval');
    let lat:number = paramsMap.get('lat');
    let lng:number = paramsMap.get('lng');
    // if id is in params, use to locate fountain
    if(id){
      fountainSelector.queryType = 'byId';
      fountainSelector.idval = id;
      // determine the database from the id if database not already provided
      let database = paramsMap.get('database');
      if(!database){
        if(id[0].toLowerCase() =='q'){
          database = 'wikidata'
        }else if(['node', 'way'].indexOf(id.split('/')[0]) >= 0){
          database = 'osm'
        }else{
          database = 'operator'
        }
      }
      fountainSelector.database = database;

    // otherwise, check if coordinates are specified and if so, use those
    }else if(lat && lng) {
      fountainSelector.queryType = 'byCoords';
      fountainSelector.lat = lat;
      fountainSelector.lng = lng;

    // it seems that it is not possible to select a fountain with the given information.
      // todo: Show an error message
    }else{
      // deselect fountain
      if (state.fountainSelector !== null){
        // this.ngRedux.dispatch({type: CLOSE_DETAIL})
      }
      return;
    }

    // if the query param fountain doesn't match the state fountain, select the query fountain
    if(JSON.stringify(fountainSelector)!== JSON.stringify(state.fountainSelector)){
      this.dataService.selectFountainBySelector(fountainSelector);
    }

    //
    // if(params.keys.indexOf('queryType')>=0){
    //   let fountainSelector:FountainSelector = {
    //     queryType: params.get('queryType')
    //   };
    //   if(fountainSelector.queryType === 'byId'){
    //     fountainSelector.database = params.get('database');
    //     fountainSelector.idval = params.get('idval');
    //   }else if(fountainSelector.queryType === 'byCoords'){
    //     fountainSelector.lat = params.get('lat');
    //     fountainSelector.lng = params.get('lng');
    //   }
    //
    //   if(JSON.stringify(fountainSelector)!== JSON.stringify(state.fountainSelector)){
    //     this.dataService.selectFountainBySelector(fountainSelector);
    //   }
    // }else{
    // }

    // // validate filter categories
    // let filterCategories:FilterCategories = {
    //   onlyOlderThan: parseInt(params.get('onlyOlderThan')) || null,
    //   onlyNotable: Boolean(params.get('onlyNotable')),
    //   onlySpringwater: Boolean(params.get('onlySpringwater')),
    //   filterText: params.get('filterText') || ''
    // };
    // if(JSON.stringify(filterCategories) !== JSON.stringify(state.filterCategories)){
    //   this.ngRedux.dispatch({type: UPDATE_FILTER_CATEGORIES, payload: filterCategories})
    // }
  }
}
