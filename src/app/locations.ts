/*
 * @license
 * (c) Copyright 2019 - 2020 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 *
 * Each time you change the datablue/config/locations.js, you need to run
 *
 *   ~/git/proximap$ npm run sync_datablue for=locations
 */

// import location.json from assets folder.
import { environment } from '../environments/environment';

//TODO it would make more sense to just share the typescript constant instead of using json IMO
import * as locationsJSON from './../assets/locations.json';
import { defaultCity } from './city/map.service';
import { BoundingBox, LngLat, uncheckedBoundingBoxToChecked } from './types';

// TODO it would make more sense to move common types to an own library which is consumed by both, datablue and proximap
// if you change something here, then you need to change it in datablue as well
export interface Location {
  name: string;
  description: Translated<string>;
  description_more: Translated<string>;
  bounding_box: UncheckedBoundingBox;
  //TODO @ralf.hauser not used as it seems, remove?
  operator_fountain_catalog_qid: string;
  issue_api: IssueApi;
}

// TODO it would make more sense to move common types to an own library which is consumed by both, datablue and proximap
// if you change something here, then you need to change it in datablue as well
export interface UncheckedBoundingBox {
  latMin: number;
  lngMin: number;
  latMax: number;
  lngMax: number;
}

// TODO it would make more sense to move common types to an own library which is consumed by both, datablue and proximap
// if you change something here, then you need to change it in datablue as well
export interface IssueApi {
  operator: string | null;
  //TODO @ralfhauser, is always null at definition site, do we still use this information somehwere?
  qid: null;
  thumbnail_url: string;
  url_template: string | null;
}

// TODO it would make more sense to move common types to an own library which is consumed by both, datablue and proximap
// if you change something here, then you need to change it in datablue as well
export interface Translated<T> {
  en: T;
  de: T;
  fr: T;
  it: T;
  tr: T;
}

export const locationsCollection = locationsJSON;
export type City = keyof typeof locationsCollection;
export type LocationsCollection = Record<City, Location>;

export const cities: City[] = Object.keys(locationsCollection).filter(
  city => city !== 'default' && (city !== 'test' || !environment.production)
) as City[];

// TODO it would make more sense to move common types to an own library which is consumed by both, datablue and proximap
// if you change something here, then you need to change it in datablue as well
export function getCityBoundingBox(city: City): BoundingBox {
  const uncheckedBoundingBox = locationsCollection[city].bounding_box;
  return uncheckedBoundingBoxToChecked(uncheckedBoundingBox);
}
export const defaultCityBoundingBox = getCityBoundingBox(defaultCity);

export function getCentre(bounds: BoundingBox): LngLat {
  return LngLat((bounds.min.lng + bounds.max.lng) / 2.0, (bounds.min.lat + bounds.max.lat) / 2);
}

// TODO it would make more sense to move common types to an own library which is consumed by both, datablue and proximap
// if you change something here, then you need to change it in datablue as well
// 0.05 lat is ~5km
export const TILE_SIZE = 0.05;
export const ROUND_FACTOR = 20; // 1 / 0.05;
export const LNG_LAT_STRING_PRECISION = 2;
