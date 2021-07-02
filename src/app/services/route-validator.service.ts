/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import { NgRedux } from '@angular-redux/store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import _ from 'lodash';
import { CHANGE_CITY, CHANGE_LANG, CHANGE_MODE, SELECT_FOUNTAIN_SUCCESS } from '../actions';
import { aliases } from '../aliases';
import { DataService, lookupAlias } from '../data.service';
import { FountainSelector, IAppState } from '../store';

export interface QueryParams {
  lang?: string;
  l?: string; // short version of lang param for #159
  mode?: string;
  queryType?: string;
  database?: string;
  idval?: string;
  i?: string; // url for identifiers, for #159
  lat?: number;
  lng?: number;
  onlyOlderThan?: number;
  onlyNotable?: boolean;
  onlySpringwater?: string;
  filterText?: string;
}

@Injectable({
  providedIn: 'root',
})
export class RouteValidatorService {
  // Use data from aliases.ts.
  private aliases = aliases;

  // Validates route names

  allowedValues = {
    lang: {
      action: CHANGE_LANG,
      default_code: 'de',
      values: [
        {
          name: 'English',
          code: 'en',
          aliases: ['english', 'anglais', 'englisch', 'en', 'e'],
        },
        {
          name: 'Français',
          code: 'fr',
          aliases: ['french', 'französisch', 'franzoesisch', 'francais', 'fr', 'f'],
        },
        {
          name: 'Deutsch',
          code: 'de',
          aliases: ['german', 'allemand', 'deutsch', 'de', 'd'],
        },
        {
          name: 'Italiano',
          code: 'it',
          aliases: ['italian', 'italiano', 'italien', 'italienisch', 'it', 'i'],
        },
        {
          name: 'Türkçe',
          code: 'tr',
          aliases: ['tr', 'turc', 'türkisch', 'turco', 't', 'turkish'],
        },
        {
          name: 'Српски',
          code: 'sr',
          aliases: ['srpski', 'serbian', 'serbian', 'sr', 'srb'],
        },
      ],
    },
    mode: {
      action: CHANGE_MODE,
      default_code: 'map',
      values: [
        {
          aliases: ['map', 'karte', 'carte'],
          code: 'map',
        },
        {
          aliases: ['details'],
          code: 'details',
        },
        {
          aliases: ['navigate', 'directions', 'navigieren', 'navigation'],
          code: 'directions',
        },
      ],
    },
    city: {
      action: CHANGE_CITY,
      default_code: 'ch-zh',
      values: [
        {
          code: 'ch-zh',
          aliases: ['zuerich', 'zuri', 'zürich ', 'zurich', 'zürih', 'züri', 'zueri', 'ch-zh'],
        },
        {
          code: 'ch-ge',
          aliases: ['genève', 'geneve', 'genf', 'geneva', 'cenevre', '/gen%C3%A8ve', 'ch-ge'],
        },
        {
          code: 'ch-bs',
          aliases: ['bale', 'bâle', 'basel', '/b%C3%A2le', 'ch-bs'],
        },
        {
          code: 'ch-lu',
          aliases: ['lucerne', 'luzern', 'ch-lu'],
        },
        {
          code: 'ch-nw',
          aliases: ['nidwalden', 'nidwald', 'nidvaldo', 'sutsilvania', 'ch-nw'],
        },
        {
          code: 'de-hh',
          aliases: ['Hamburg', 'hamburg', 'Hambourg', 'hambourg', 'Amburgo', 'amburgo', 'de-hh'],
        },
        {
          code: 'fr-paris',
          aliases: ['Paris', 'paris', 'Parigi', '75', 'fr-75', 'parigi', 'fr-paris'],
        },
        {
          code: 'in-ch',
          aliases: ['Chennai', 'chennai', 'in-ch'],
        },
        {
          code: 'test',
          aliases: ['Test-City', 'dev', 'dev-city', 'test'],
        },
        {
          code: 'it-roma',
          aliases: ['rome', 'roma', 'rom', 'it-roma'],
        },
        {
          code: 'us-nyc',
          aliases: ['NewYork', 'new_york', 'nyc', 'us-nyc', 'us-ny'],
        },
        {
          code: 'tr-be',
          aliases: ['bergama', 'Pergamon', 'tr-be'],
        },
        {
          code: 'sr-bg',
          aliases: ['Belgrade', 'belgrade', 'beograd', 'sr-bg'],
        },
      ],
    },
  };

  constructor(
    //public router: Router,
    //private route: ActivatedRoute,
    private http: HttpClient,
    private ngRedux: NgRedux<IAppState>,
    private dataService: DataService
  ) {}

  validate(key: string, value: any, useDefault = true): string {
    let code: string = null;
    const allwValsKey = this.allowedValues[key];
    if (null !== allwValsKey && null !== value) {
      if (useDefault) {
        //  start with default code value
        code = allwValsKey.default_code;
      }

      // see if there is a match among aliases
      for (let i = 0; i < allwValsKey.values.length && null != value && 0 < value.trim().length; ++i) {
        const val = allwValsKey.values[i];
        // find matching
        const index = val.aliases.indexOf(value.toLowerCase());
        if (index >= 0) {
          code = val.code;
          console.log(
            i +
              ": key '" +
              key +
              "' found location-alias '" +
              code +
              "' for '" +
              value +
              "' " +
              new Date().toISOString()
          );
          break;
        }
      }

      // update if different from current state
      if (code !== null && code !== this.ngRedux.getState()[key]) {
        console.log(
          "redux dispatch action '" +
            allwValsKey.action +
            "' code '" +
            code +
            "' for '" +
            value +
            "' key '" +
            key +
            "' useDefault '" +
            useDefault +
            "'" +
            new Date().toISOString()
        );
        this.ngRedux.dispatch({ type: allwValsKey.action, payload: code });
      } else {
        console.log(
          "no redux dispatch for '" +
            value +
            "' key '" +
            key +
            "' useDefault '" +
            useDefault +
            "' " +
            new Date().toISOString()
        );
      }
    }
    return code;
  }

  getOsmNodeByNumber(cityOrId: string, type = 'node') {
    // attempt to fetch OSM node
    const url = `https://overpass-api.de/api/interpreter?data=[out:json];${type}(${cityOrId});out center;`;
    this.http.get(url).subscribe(
      data => {
        let fountain = null;
        if (type === 'node') {
          fountain = _.get(data, ['elements', 0]);
        } else if (type === 'way') {
          fountain = _.get(data, ['elements', 0, 'center']);
        } else {
          console.log('getOsmNodeByNumber: Don\'t know how to handle type "' + type + '" ' + new Date().toISOString());
        }
        if (fountain) {
          this.checkCoordinatesInCity(
            fountain['lat'],
            fountain['lon'],
            'getOsmNodeByNumber by ' + type + ' ' + cityOrId
          )
            .then(cityCode => {
              // if a city was found, then broadcast the change
              this.ngRedux.dispatch({ type: CHANGE_CITY, payload: cityCode });
              this.updateFromId('osm', type + '/' + cityOrId);
              return cityCode;
            })
            .catch(message => {
              console.log(message + ' ' + new Date().toISOString());
              return null;
            });
        } else {
          console.log(
            'getOsmNodeByNumber: OSM query returned no elements for url "' + url + '" ' + new Date().toISOString()
          );
          return null;
        }
      },
      error => {
        console.log(
          'Error when looking up OSM element: ' + JSON.stringify(error, null, 2) + ' ' + new Date().toISOString()
        );
        return null;
      }
    );
    return null;
  }

  getOsmNodeByWikiDataQnumber(qNumb: string, type = 'node', amenity = 'fountain') {
    // attempt to fetch OSM node
    //as per https://github.com/water-fountains/proximap/issues/244#issuecomment-578483473, https://overpass-turbo.eu/s/Q62
    //DaveF suggested:  If you don't know if the entity was mapped as a single point, swap node for nwr (Node, Way, Relation) type='nrw' could be an alternative
    const url = `https://overpass-api.de/api/interpreter?data=[out:json];${type}[amenity=${amenity}][wikidata=${qNumb}];out%20center;`; //
    console.log('getOsmNodeByWikiDataQnumber: about to "' + url + '" ' + new Date().toISOString());
    const getOsmNodeByWikiDataQnumberGet = this.http.get(url).subscribe(
      data => {
        let fountain = null; //test with http://localhost:4200/Q83630092 and http://localhost:4200/Q94066483
        if (type === 'node') {
          fountain = _.get(data, ['elements', 0]);
        } else if (type === 'way') {
          fountain = _.get(data, ['elements', 0, 'center']);
        } else {
          console.log(
            'getOsmNodeByWikiDataQnumber: Don\'t know how to handle type "' + type + '" ' + new Date().toISOString()
          );
        }
        if (fountain) {
          this.checkCoordinatesInCity(
            fountain['lat'],
            fountain['lon'],
            'getOsmNodeByWikiDataQnumber ' + qNumb + ' ' + type + ' ' + amenity
          )
            .then(cityCode => {
              // if a city was found, then broadcast the change
              this.ngRedux.dispatch({ type: CHANGE_CITY, payload: cityCode });
              this.updateFromId('wikidata', type + '/' + qNumb);
              console.log(
                'getOsmNodeByWikiDataQnumber: for "' +
                  qNumb +
                  '" found city "' +
                  cityCode +
                  '" ' +
                  new Date().toISOString()
              );
              return cityCode;
            })
            .catch(message => {
              console.log(message + ' ' + new Date().toISOString());
              return null;
            });
        } else {
          console.log(
            'getOsmNodeByWikiDataQnumber: OSM query returned no elements for url "' +
              url +
              '" ' +
              new Date().toISOString()
          );
          return null;
        }
      },
      error => {
        console.log(
          'Error when looking up OSM element: ' + JSON.stringify(error, null, 2) + ' ' + new Date().toISOString()
        );
        return null;
      }
    );
    //getOsmNodeByWikiDataQnumberGet.caller = "getOsmNodeByWikiDataQnumberGet:"+qNumb; //seems not to work with TypeScript: Property 'caller' does not exist on type 'Subscription'.
    return getOsmNodeByWikiDataQnumberGet;
  }

  /**
   * Check if a query to OSM with the given string gives a fountain that is in one of the valid cities
   * @param cityOrId query parameter that may be an OSM id
   * @param type either "node" or "way"
   */
  validateOsm(cityOrId: string, type = 'node'): Promise<string> {
    return new Promise((resolve, reject) => {
      // Check is exist filter text in aliases data.
      const alias = lookupAlias(cityOrId);
      if (null != alias && 0 < alias.trim().length) {
        cityOrId = alias;
      }
      if (isNaN(+cityOrId)) {
        //check if number
        reject('string ' + cityOrId + ' does not match osm node format - ' + type);
      } else {
        const cityCode = this.getOsmNodeByNumber(cityOrId, type);
        if (null == cityCode) {
          reject();
        }
        resolve(cityCode);
      }
    });
  }

  /**
   * Check if a query to Wikidata with the given string gives a fountain that is in one of the valid cities
   * @param cityOrId query parameter that may be an Wikidata id
   */
  validateWikidata(cityOrId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // Check is exist filter text in aliases data.
      const alias = lookupAlias(cityOrId);
      if (null != alias && 0 < alias.trim().length) {
        cityOrId = alias;
      }
      if (null == cityOrId || 0 == cityOrId.trim().length || cityOrId[0] !== 'Q' || isNaN(+cityOrId.slice(1))) {
        reject('string "' + cityOrId + '" does not match wikidata format');
      } else {
        console.log('attempt to fetch Wikidata node "' + cityOrId + '" ' + new Date().toISOString());
        // TODO first check the fountains of the currently loaded city
        const currFtns = null; // this.dataService.fountainsAll();
        if (null != currFtns) {
          for (const ftn of currFtns.features) {
            if (ftn['properties']['id_wikidata'] !== null) {
              if (ftn['properties']['id_wikidata'] === cityOrId) {
                this.ngRedux.dispatch({
                  type: SELECT_FOUNTAIN_SUCCESS,
                  payload: { fountain: ftn, selector: cityOrId },
                });
                resolve(cityOrId);
              }
            }
          }
        }
        const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${cityOrId}&format=json&origin=*`;
        this.http.get(url).subscribe(
          data => {
            const coords = _.get(data, ['entities', cityOrId, 'claims', 'P625', 0, 'mainsnak', 'datavalue', 'value']);
            //this is also an inefficient query like EuroPuddle Artist
            if (!coords) {
              const osmNodeByWikiDataQnumberPromises = [];
              osmNodeByWikiDataQnumberPromises.push(this.getOsmNodeByWikiDataQnumber(cityOrId, 'node', 'fountain'));
              Promise.all(osmNodeByWikiDataQnumberPromises).then(() => {
                //test with http://localhost:4200/Q83630092 ch-zh Klusdörfli Sandstein BL
                const osmNodeByWikiDataQnumberPromisesDrinking = [];
                osmNodeByWikiDataQnumberPromisesDrinking.push(
                  this.getOsmNodeByWikiDataQnumber(cityOrId, 'node', 'drinking_water')
                );
                Promise.all(osmNodeByWikiDataQnumberPromisesDrinking).then(rd => {
                  //test with http://localhost:4200/Q94066483 ch-zh Brunnen röm. kath Kirche Zollikon
                  if (null != rd) {
                    //resolve(rd);
                  }
                });
              });
            }
            if (coords) {
              this.checkCoordinatesInCity(coords['latitude'], coords['longitude'], 'validateWikidata ' + cityOrId)
                .then(cityCode => {
                  // if a city was found, then broadcast the change
                  this.ngRedux.dispatch({ type: CHANGE_CITY, payload: cityCode });
                  this.updateFromId('wikidata', cityOrId);
                  resolve(cityCode);
                })
                .catch(message => {
                  console.log(message + ' - "' + cityOrId + '"');
                  reject();
                });
            } else {
              console.log(
                'validateWikidata: Wikidata query returned no elements with coordinates for "' +
                  cityOrId +
                  '" ' +
                  new Date().toISOString()
              );
              reject();
            }
          },
          error => {
            console.log(
              'validateWikidata: Error when looking up Wikidata element: ' +
                JSON.stringify(error, null, 2) +
                ' - "' +
                cityOrId +
                '" ' +
                new Date().toISOString()
            );
            reject();
          }
        );
      }
    });
  }

  // Made for https://github.com/water-fountains/proximap/issues/244 to check if coords in any city
  checkCoordinatesInCity(lat: number, lon: number, debug = ''): Promise<string> {
    return new Promise((resolve, reject) => {
      // loop through locations and see if coords are in a city
      this.dataService
        .fetchLocationMetadata()
        .then(locations => {
          const locKeys = Object.keys(locations);
          const ll = locKeys.length;
          for (let i = 0; i < ll; ++i) {
            const key = locKeys[i];
            const b = locations[key].bounding_box;
            if (lat > b.latMin && lat < b.latMax && lon > b.lngMin && lon < b.lngMax) {
              console.log(
                'checkCoordinatesInCity: found "' +
                  key +
                  '" ' +
                  i +
                  '/' +
                  ll +
                  ' -  lat ' +
                  b.latMin +
                  ' < ' +
                  lat +
                  ' < ' +
                  b.latMax +
                  ' &&  lon ' +
                  b.lngMin +
                  ' < ' +
                  lon +
                  ' < ' +
                  b.lngMax +
                  ' ' +
                  new Date().toISOString() +
                  ' ' +
                  debug
              );
              //if cities have box overlaps, then only the first one is found
              resolve(key);
              break; //don't understand why after resolve, it would continue ?
            }
          }
          reject(`None of the ${ll} supported locations have those coordinates lat: ${lat},  lon: ${lon} - ` + debug);
        })
        .catch(err => {
          reject(
            'checkCoordinatesInCity: Could not fetch location metadata for ' +
              lat +
              '/' +
              lon +
              ' ' +
              new Date().toISOString() +
              ' ' +
              err.stack +
              ' ' +
              debug
          );
        });
    });
  }

  getQueryParams() {
    // Get query parameter values from app state. use short query params by default for #159
    const state = this.ngRedux.getState();
    const queryParams: QueryParams = {
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
        queryParams.i = state.fountainSelector.idval;
      }
    }
    return queryParams;
  }

  updateFromId(database: string, id: string): void {
    const fountainSelector: FountainSelector = {
      queryType: 'byId',
      idval: id,
      database: database,
    };
    console.log('updateFromId: database "' + database + '", id "' + id + '" ' + new Date().toISOString());
    this.dataService.selectFountainBySelector(fountainSelector);
  }

  updateFromRouteParams(paramsMap): void {
    // update application state (indirectly) from url route params

    const state = this.ngRedux.getState();

    // validate lang
    const lang = paramsMap.get('lang') || paramsMap.get('l');
    this.validate('lang', lang, true);

    // create valid fountain selector from query params
    const fountainSelector: FountainSelector = {
      queryType: 'byId',
    };

    // See what values are available
    const id: string = paramsMap.get('i') || paramsMap.get('idval');
    const lat: number = paramsMap.get('lat');
    const lng: number = paramsMap.get('lng');
    // if id is in params, use to locate fountain
    if (id) {
      fountainSelector.queryType = 'byId';
      fountainSelector.idval = id;
      // determine the database from the id if database not already provided
      let database = paramsMap.get('database');
      if (!database) {
        if (id[0].toLowerCase() == 'q') {
          database = 'wikidata';
        } else if (['node', 'way'].indexOf(id.split('/')[0]) >= 0) {
          database = 'osm';
        } else {
          database = 'operator';
        }
      }
      fountainSelector.database = database;

      // otherwise, check if coordinates are specified and if so, use those
    } else if (lat && lng) {
      fountainSelector.queryType = 'byCoords';
      fountainSelector.lat = lat;
      fountainSelector.lng = lng;

      // it seems that it is not possible to select a fountain with the given information.
      // todo: Show an error message
    } else {
      // deselect fountain
      if (state.fountainSelector !== null) {
        // this.ngRedux.dispatch({type: CLOSE_DETAIL})
      }
      return;
    }

    // if the query param fountain doesn't match the state fountain, select the query fountain
    if (JSON.stringify(fountainSelector) !== JSON.stringify(state.fountainSelector)) {
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
