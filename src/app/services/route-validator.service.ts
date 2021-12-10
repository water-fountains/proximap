/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ParamMap } from '@angular/router';
import _ from 'lodash';
import { Observable, of } from 'rxjs';
import { LanguageService } from '../core/language.service';
import { LayoutService } from '../core/layout.service';
import { DataService, lookupFountainAlias } from '../data.service';
import { FountainService } from '../fountain/fountain.service';
import { City } from '../locations';
import { CityService, defaultCity } from '../city/city.service';
import { illegalState } from '../shared/illegalState';
import { Database, FountainSelector, isDatabase, LngLat } from '../types';
import { getSingleNumericParam, getSingleStringParam, isNumeric } from './utils';
import { catchError, filter, first } from 'rxjs/operators';
import { MapConfig } from '../map/map.config';

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
  // Validates route names

  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private languageService: LanguageService,
    private fountainService: FountainService,
    private cityService: CityService,
    private layoutService: LayoutService,
    private mapConfig: MapConfig
  ) {}

  /**
   * we have the following precedence rules:
   * 1. if a valid fountain id (wikidata, osm or an alias) was defined in url => navigate to fountain, open detail, ignore id defined as queryparam, sharedLocation and/or city
   * 2. if a valid fountain id (wikidata, osm or an alias) was defined in queryParam => navigate to fountain, open detail, ignore sharedLocation and/or city
   * 3. if we find a valid shared location => navigate to the location, ignore city
   * 4. if we find a valid city (code or alias) => navigate to the city
   * 5. fallback to the default city which is ch-zh
   *
   * Which means we support the following urls:
   * https://.../Q27229902 => wikidata id
   * https://.../trevi => wikidata id alias
   * https://.../60018172 => OSM id
   * https://.../jetDeau => OSM id alias
   * https://.../?loc=... => shared location
   * https://.../ch-zh => city
   * https://.../genève => city alias
   * https://.../Q27229902?i=Q3429902 => wikidata id (id Q3429902 is ignored)
   * https://.../Q27229902?loc=... => wikidata id (shared location ignored)
   * https://.../?i=Q27229902&loc=... => wikidata id (shared location ignored)
   * https://.../ch-zh?i=Q27229902?loc=... => wikidata id (shared location and city ignored)
   * https://.../ch-zh?loc=... => shared location (city ignored)
   */
  handleUrlChange(routeParam: ParamMap, queryParam: ParamMap): Observable<boolean> {
    const fountainIdOrAlias_cityIdOrAlias = getSingleStringParam(
      routeParam,
      'fountainIdOrAlias_cityIdOrAlias',
      /* isOptional= */ true
    );

    // incorporates the side effect to change
    this.detectLanguageChange(queryParam);

    return this.navigateWithFirstValidMechanism(
      // fountain id or alias in routeParam
      this.navigateToFountain(fountainIdOrAlias_cityIdOrAlias),
      () => {
        const id = getSingleStringParam(queryParam, 'i', /* isOptional= */ true);
        return this.navigateToFountain(id);
      },
      () => {
        const loc = getSingleStringParam(queryParam, 'loc', /* isOptional= */ true);
        return this.navigateToSharedLocation(loc);
      },
      () => this.navigateToCity(fountainIdOrAlias_cityIdOrAlias),
      () => this.navigateToCity(defaultCity)
    );
  }

  private navigateWithFirstValidMechanism(
    firstMechanism: Observable<boolean>,
    ...others: (() => Observable<boolean>)[]
  ): Observable<boolean> {
    return others.reduce(
      (previousMechanism, nextMechanism) =>
        previousMechanism
          .pipe(filter(previousMechanismMatched => previousMechanismMatched === false))
          .switchMap(_ => nextMechanism()),
      /* initialValue = */ firstMechanism
    );
  }

  private navigateToFountain(maybeIdOrAlias: string | undefined): Observable<boolean> {
    if (maybeIdOrAlias !== undefined) {
      const id = lookupFountainAlias(maybeIdOrAlias) ?? maybeIdOrAlias;
      return this.getLngLatOfFountain(id).map(data => {
        if (data !== undefined) {
          const { lngLat, database, updateId } = data;
          const city = this.getCityByLngLat(lngLat);
          if (city !== undefined) {
            //TODO @ralf.hauser this function currently depends on that a fountain is in a city
            this.layoutService.flyToCity(city);
            this.updateFromId(database, updateId);
          }
          return true;
        } else {
          return false;
        }
      });
    } else {
      return of(false);
    }
  }

  private getLngLatOfFountain(id: string): Observable<LngLatUpdate | undefined> {
    if (isWikidataId(id)) {
      return this.getLngLatOfWikidataFountain(id);
    } else if (isOsmId(id)) {
      return this.getLngLatOfOsmFountain(id);
    } else {
      return of(undefined);
    }
  }

  private getLngLatOfWikidataFountain(id: string): Observable<LngLatUpdate | undefined> {
    const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${id}&format=json&origin=*`;
    return this.http
      .get(url)
      .map<LngLatUpdate | undefined>(data => {
        const coords = _.get(data, ['entities', id, 'claims', 'P625', 0, 'mainsnak', 'datavalue', 'value']);
        if (coords) {
          return {
            lngLat: LngLat(coords['longitude'], coords['latitude']),
            database: 'wikidata',
            updateId: id,
          };
        } else {
          console.log(
            'validateWikidata: Wikidata query returned no elements with coordinates for "' +
              id +
              '" ' +
              new Date().toISOString()
          );
          return undefined;
        }
      })
      .pipe(
        catchError(error => {
          console.log(
            'validateWikidata: Error when looking up Wikidata element: ' +
              JSON.stringify(error, null, 2) +
              ' - "' +
              id +
              '" ' +
              new Date().toISOString()
          );
          return of(undefined);
        })
      );
  }

  private getLngLatOfOsmFountain(id: string): Observable<LngLatUpdate | undefined> {
    // TODO @ralf.hauser I don't have OSM know-how. If it is possible that a node id has the same number as a way id
    // then the node always takes precedence with this implementation. We would need to prefix the id (additionally)
    // in order to support both
    return this.getLngLatOfOsmFountainByType(id, 'node').switchMap(data =>
      data ? of(data) : this.getLngLatOfOsmFountainByType(id, 'way')
    );
  }

  private getLngLatOfOsmFountainByType(id: string, type: 'node' | 'way'): Observable<LngLatUpdate | undefined> {
    const url = `https://overpass-api.de/api/interpreter?data=[out:json];${type}(${id});out center;`;
    return this.http
      .get(url)
      .map<LngLatUpdate | undefined>(data => {
        const lngLat = this.extractLngLatFromOsmData(type, data);
        if (lngLat) {
          return { lngLat: lngLat, database: 'osm', updateId: type + '/' + id };
        } else {
          console.log(
            'getOsmNodeByNumber: OSM query returned no elements for url "' + url + '" ' + new Date().toISOString()
          );
          return undefined;
        }
      })
      .pipe(
        catchError(error => {
          console.log(
            `Error when looking up OSM element via url ${url}: ${JSON.stringify(
              error,
              null,
              2
            )} ${new Date().toISOString()}`
          );
          return of(undefined);
        })
      );
  }

  private extractLngLatFromOsmData(type: string, data: Object): LngLat | undefined {
    let fountain = null;
    if (type === 'node') {
      fountain = _.get(data, ['elements', 0]);
    } else if (type === 'way') {
      fountain = _.get(data, ['elements', 0, 'center']);
    }
    return fountain ? LngLat(fountain['lon'], fountain['lat']) : undefined;
  }

  // Made for https://github.com/water-fountains/proximap/issues/244 to check if coords in any city
  private getCityByLngLat(lngLat: LngLat): City | undefined {
    const [locationsCollection, cities] = this.dataService.getLocationMetadata();

    return cities.find(city => {
      const boundingBox = locationsCollection[city].bounding_box;
      return (
        lngLat.lat > boundingBox.latMin &&
        lngLat.lat < boundingBox.latMax && //
        lngLat.lng > boundingBox.lngMin &&
        lngLat.lng < boundingBox.lngMax
      );
    });
  }

  private updateFromId(database: Database, id: string): void {
    const fountainSelector: FountainSelector = {
      queryType: 'byId',
      idval: id,
      database: database,
    };
    console.log('updateFromId: database "' + database + '", id "' + id + '" ' + new Date().toISOString());
    this.dataService.selectFountainBySelector(fountainSelector);
  }

  private navigateToSharedLocation(maybLocAsString: string | undefined): Observable<boolean> {
    const locArr = maybLocAsString !== undefined ? maybLocAsString.split(',') : [];
    if ((locArr.length === 2 || locArr.length === 3) && isNumeric(locArr[0]) && isNumeric(locArr[1])) {
      const lat = Number(locArr[0]);
      const lng = Number(locArr[1]);
      // TODO @robstoll implement sharedLocation here
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _sharedLocation = { lngLat: LngLat(lng, lat), zoom: this.parseZoomOrDefault(locArr) };
      return of(false);
    } else {
      return of(false);
    }
  }

  private navigateToCity(maybeCity: string | undefined): Observable<boolean> {
    const newCity = this.cityService.parse(maybeCity);
    console.log("cityCode '" + newCity + "' cityOrId  '" + maybeCity + "' " + new Date().toISOString()); //todo show what came as parameters: https://angular.io/api/router/ParamMap  for '"+paramMap.params+"'

    if (newCity !== undefined) {
      // we are only interested in the current value at the time we navigate, thus pipe(first)
      // if we don't use it we would get the update flyToCity produces (due to the subject change to newCity)
      // and since city is then alwas == newCity we would return false even though we navigated beforehand
      return this.cityService.city.pipe(first()).map(city => {
        // update if different from current state
        if (newCity !== city) {
          console.log('fly to city ' + newCity + "' based on value '" + city + "' " + new Date().toISOString());
          this.layoutService.flyToCity(newCity);
        }
        // regardless if we have to fly to the city or if we are already in the city
        // we return true as we do no longer need to navigate
        return true;
      });
    } else {
      return of(false);
    }
  }

  private parseZoomOrDefault(arr: string[]): number {
    let zoom = this.mapConfig.map.zoom;
    const arg2 = arr[2];
    if (arg2 !== undefined) {
      const tmpZoom = parseInt(arg2, 10);
      if (!isNaN(tmpZoom)) {
        if (tmpZoom > this.mapConfig.map.maxZoom) {
          zoom = this.mapConfig.map.maxZoom;
        } else if (tmpZoom < this.mapConfig.map.minZoom) {
          zoom = this.mapConfig.map.minZoom;
        } else {
          zoom = tmpZoom;
        }
      }
    }
    return zoom;
  }

  private detectLanguageChange(queryParams: ParamMap) {
    // validate lang
    const lang =
      getSingleStringParam(queryParams, 'lang', /*isOptional = */ true) ||
      getSingleStringParam(queryParams, 'l', /*isOptional = */ true);
    if (lang !== undefined) {
      try {
        this.languageService.changeLang(lang);
      } catch (e: unknown) {
        // just ignore if the language is not supported
      }
    }
  }

  getShortenedQueryParams(): Observable<QueryParams> {
    return this.fountainService.fountainSelector.map(fountainSelector => {
      // Get query parameter values from app state. use short query params by default for #159
      const queryParams: QueryParams = {
        l: this.languageService.currentLang, // use short language by default
        // mode: state.mode,
      };
      if (fountainSelector !== null && !(typeof fountainSelector === 'string')) {
        if (fountainSelector.queryType === 'byCoords') {
          // if selection by coordinates
          queryParams.lat = fountainSelector.lat;
          queryParams.lng = fountainSelector.lng;
        } else if (fountainSelector.queryType === 'byId') {
          // if selection by id
          queryParams.i = fountainSelector.idval;
        }
      }
      return queryParams;
    });
  }
}

function isWikidataId(id: string): boolean {
  return id.length > 1 && id[0] === 'Q' && isNumeric(id.slice(1));
}

function isOsmId(id: string): boolean {
  return isNumeric(id);
}

interface LngLatUpdate {
  lngLat: LngLat;
  database: Database;
  updateId: string;
}
