/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import { HttpResponseBase } from '@angular/common/http';
import { Feature, Point } from 'geojson';

export interface PropertyMetadata {
  essential: boolean;
  type: string;
  name: Object;
  descriptions: Object;
  src_pref: string[];
  src_config: Object;
  id: string;
  value: any;
  comments: string;
  status: string;
  source: string;
}

// for #115 - #118 additional filtering functions
export interface FilterData {
  text: string;
  onlyInView: boolean;
  onlyNotable: {
    //wikipedia
    active: boolean;
    mode: 'with' | 'without';
  };
  onlyOlderYoungerThan: {
    active: boolean;
    mode: 'before' | 'after';
    date: number;
  };
  showRemoved: boolean;
  swimmingPlace: {
    active: boolean;
    mode: 'is' | 'isNot';
  };
  curatedPanoI228pm: {
    active: boolean;
    mode: 'is' | 'isNot';
  };
  odSrcI233pm: {
    active: boolean;
    mode: 'WikiData' | 'OSM' | 'both' | 'WikiData only' | 'OSM only';
  };
  waterType: {
    active: boolean;
    value: string;
  };
  photo: {
    active: boolean;
    mode: 'with' | 'without';
  };
  potable: {
    active: boolean;
    strict: boolean;
  };
  access_wheelchair: {
    active: boolean;
    strict: boolean;
  };
  access_pet: {
    active: boolean;
    strict: boolean;
  };
  access_bottle: {
    active: boolean;
    strict: boolean;
  };
}

export interface PropertyMetadataCollection {
  [propName: string]: PropertyMetadata;
}

export interface QuickLink {
  id: string;
  title: string;
  value: string;
  styleClass: string;
}

export interface DataIssue {
  level: string;
  message: string;
  type: string;
  date: Date;
  context: {
    fountain_name: string;
    property_id: string;
    id_osm: string;
    id_wikidata: string;
  };
  data: object;
}

export interface AppError {
  incident: string;
  message: string;
  data: HttpResponseBase;
  date: Date;
}

// TODO it would make more sense to move common types to an own library which is consumed by both, datablue and proximap
// if you change something here, then you need to change it in proximap as well
//TODO @ralfhauser as far as I can see, all features in the FeatureCollection collection has Point as type of `geometry`. Also, geometry is always defined.
// Do you know if there are exceptions to this rule? `geometry` is defined as different geometry type or null, i.e. it could also not exist. I have the feeling it always is
type FountainGeometry = Point;

// TODO it would make more sense to move common types to an own library which is consumed by both, datablue and proximap
// if you change something here, then you need to change it in proximap as well
//TODO @ralfhauser, same same as above and I also have the feeling properties is always defined. We would need to change this definition if there are cases where it does not exist
export type FountainPropertyCollection<T> = T & { [name: string]: any };

// TODO it would make more sense to move common types to an own library which is consumed by both, datablue and proximap
// if you change something here, then you need to change it in proximap as well
export interface TypedFountainProperty<T> {
  value: T;
}

// TODO it would make more sense to move common types to an own library which is consumed by both, datablue and proximap
// if you change something here, then you need to change it in proximap as well
export type Fountain<P = Record<string, unknown>> = Feature<FountainGeometry, FountainPropertyCollection<P>>;
