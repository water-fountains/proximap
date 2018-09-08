import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import {NgRedux, select} from '@angular-redux/store/lib/src';
import {Feature} from 'geojson';
import {HttpClient} from '@angular/common/http';
import {Observable, Subscription} from 'rxjs';
import {DataService} from '../data.service';
import {isObject} from 'util';
import {CHANGE_CITY, CHANGE_LANG, CHANGE_MODE} from '../actions';
import {IAppState} from '../store';

export interface QueryParams {
  lang: string,
  mode: string,
  queryType?: string,
  database?: string,
  idval?: string,
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
      values: [
        {
          name: 'English',
          code: 'en',
          aliases: ['english', 'anglais', 'englisch', 'en']
        }, {
          name: 'Français',
          code: 'fr',
          aliases: ['french', 'französisch', 'franzoesisch', 'francais', 'fr']
        }, {
          name: 'Deutsch',
          code: 'de',
          aliases: ['german', 'allemand', 'deutsch', 'de']
        }
      ]
    },
    mode: {
      action: CHANGE_MODE,
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
      values: [
        {
          code: 'zurich',
          aliases: ['zuerich', 'zuri', 'zürich ', 'zurich']
        },
        {
          code: 'geneva',
          aliases: ['genève', 'geneve', 'genf', 'geneva', '/gen%C3%A8ve']
        },
        {
          code: 'basel',
          aliases: ['bale', 'bâle', 'basel', '/b%C3%A2le']
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
      for (let i = 0; i < this.allowedValues[key].values.length; ++i) {
        // find matching lang
        let index = this.allowedValues[key].values[i].aliases.indexOf(value.toLowerCase());
        if (index >= 0) {
          let code = this.allowedValues[key].values[i].code;
          // update lang if new
          if (code !== this.ngRedux.getState()[key]) {
            this.ngRedux.dispatch({type: this.allowedValues[key].action, payload: code});
          }
        }
      }
    }
  }

  getQueryParams(): QueryParams {
    let state = this.ngRedux.getState();
    let queryParams: QueryParams = {
      lang: state.lang,
      mode: state.mode,
    };
    if (state.fountainSelector !== null) {
      for (let p of ['queryType', 'database', 'idval', 'lat', 'lng']) {
        if (state.fountainSelector[p] !== null) {
          queryParams[p] = state.fountainSelector[p];
        }
      }
    }
    if (state.filterCategories !== null) {
      for (let p of ['onlyOlderThan', 'onlyNotable', 'onlySpringwater', 'filterText']) {
        if (state.filterCategories[p] ) {
          queryParams[p] = state.filterCategories[p];
        }
      }
    }
    return queryParams;
  }
}
