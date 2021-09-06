/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import { HttpResponseBase } from '@angular/common/http';
import { Feature, FeatureCollection, Geometry, Point } from 'geojson';

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
// if you change something here, then you need to change it in datablue as well
//TODO @ralfhauser as far as I can see, geometry is always defined.
// Do you know if there are exceptions to this rule? `geometry` is defined as different geometry type or null, i.e. it could also not exist. I have the feeling it always is
type DefaultFountainGeometry = Point;

// TODO it would make more sense to move common types to an own library which is consumed by both, datablue and proximap
// if you change something here, then you need to change it in datablue as well
//TODO @ralfhauser, same same as above and I also have the feeling properties is always defined. We would need to change this definition if there are cases where it does not exist
export type FountainPropertyCollection<T> = T & { [name: string]: any };

// TODO it would make more sense to move common types to an own library which is consumed by both, datablue and proximap
// if you change something here, then you need to change it in datablue as well
export interface TypedFountainProperty<T> {
  value: T;
}

// TODO it would make more sense to move common types to an own library which is consumed by both, datablue and proximap
// if you change something here, then you need to change it in datablue as well
export type Fountain<G extends Geometry = DefaultFountainGeometry, P = Record<string, unknown>> = Feature<
  G,
  FountainPropertyCollection<P>
>;

// TODO it would make more sense to move common types to an own library which is consumed by both, datablue and proximap
// if you change something here, then you need to change it in datablue as well
export type FountainCollection<G extends Geometry = DefaultFountainGeometry> = FeatureCollection<
  G,
  FountainPropertyCollection<Record<string, unknown>>
>;

export type LngLat = [number, number];

export type Bounds = [LngLat, LngLat];

// TODO it would make more sense to move common types to an own library which is consumed by both, datablue and proximap
// if you change something here, then you need to change it in proximap as well
export interface Image {
  big: string;
  medium: string;
  small: string;
  description: string;
  source_name: string;
  source_url: string;
}

// TODO it would make more sense to move common types to an own library which is consumed by both, datablue and proximap
// if you change something here, then you need to change it in datablue as well
export interface Source {
  //TODO @ralfhauser looks suspicious/buggy to me, shouldn't we know the status in all cases?
  status: PropStatus | null;
  raw: null;
  //TODO typing: try to get rid of any
  extracted: ImageLikeCollection | string | any | null;
  comments: string[];
}

// TODO it would make more sense to move common types to an own library which is consumed by both, datablue and proximap
// if you change something here, then you need to change it in datablue as well
export interface FountainConfigProperty {
  id: string;
  value: any;
  comments: string;
  status: PropStatus;
  source: SourceType;
  type: string;
  issues: [];
  sources: Record<SourceType, Source>;
}

// TODO it would make more sense to move common types to an own library which is consumed by both, datablue and proximap
// if you change something here, then you need to change it in datablue as well
export type PropStatus =
  | 'PROP_STATUS_OK'
  | 'PROP_STATUS_INFO'
  | 'PROP_STATUS_WARNING'
  | 'PROP_STATUS_ERROR'
  | 'PROP_STATUS_FOUNTAIN_NOT_EXIST'
  | 'PROP_STATUS_NOT_DEFINED'
  | 'PROP_STATUS_NOT_AVAILABLE';

// TODO it would make more sense to move common types to an own library which is consumed by both, datablue and proximap
// if you change something here, then you need to change it in proximap as well
export type SourceType = 'osm' | 'wikidata';

// TODO it would make more sense to move common types to an own library which is consumed by both, datablue and proximap
// if you change something here, then you need to change it in datablue as well
export type ImageLikeType =
  | 'wm'
  | 'ext-fullImgUrl'
  | 'flickr'
  | 'unk' // TODO @ralfhauser defined like this in conflate.data.service.ts
  | 'ext-flickr' //TODO @ralfhauser initially only defined for ImageLike and not for ImageLikeCollection but since we assign type to type in wikimedia.service.ts we need this as well.
  | 'ext'; //TODO @ralfhauser  initially only defined for ImageLikeCollection, same problem as for ext-flicker. Maybe only one of them is correct?

// TODO it would make more sense to move common types to an own library which is consumed by both, datablue and proximap
// if you change something here, then you need to change it in datablue as well
//TODO @ralfhauser is wd maybe a typo? see wikimedia.service line 490
export type ImageLikeSrc = 'osm' | 'wm' | 'wd';

// TODO it would make more sense to move common types to an own library which is consumed by both, datablue and proximap
// if you change something here, then you need to change it in datablue as well
export interface ImageLike {
  //TODO @ralfhauser, IMO we should rename this to type
  typ: ImageLikeType;
  src: ImageLikeSrc;
  value: string;
  //TODO @ralfhauser cat is not always given, bug or correct behaviour?
  cat?: Category;
}
// TODO it would make more sense to move common types to an own library which is consumed by both, datablue and proximap
// if you change something here, then you need to change it in datablue as well
export interface ImageLikeCollection {
  type: ImageLikeType;
  src: ImageLikeSrc;
  imgs: ImageLike[];
}

// TODO it would make more sense to move common types to an own library which is consumed by both, datablue and proximap
// if you change something here, then you need to change it in datablue as well
export interface Category {
  n: string;
  c: string;
  l: number;
  //TODO @ralfhauser provide a more precise typing please
  e?: any;
}
