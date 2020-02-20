/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

export interface PropertyMetadata {
  essential: boolean,
  type: string,
  name: Object,
  descriptions: Object,
  src_pref: Array<string>,
  src_config: Object,
  id: string,
  value: any,
  comments: string,
  status: string,
  source: string
}


// for #115 - #118 additional filtering functions
export interface FilterData {
  text: string,
  onlyInView: boolean,
  onlyNotable: { //wikipedia
    active: boolean,
    mode: "with" | 'without'
  },
  onlyOlderYoungerThan: {
    active: boolean,
    mode: "before" | "after",
    date: number
  },
  showRemoved: boolean,
  swimmingPlace:  { 
    active: boolean,
    mode: "is" | 'isNot'
  },
  curatedPanoI228pm:  { 
    active: boolean,
    mode: "is" | 'isNot'
  },
  odSrcI233pm:  { 
    active: boolean,
    mode: "WikiData" | 'OSM'| 'both'| 'WikiData only'| 'OSM only'
  },
  waterType: {
    active: boolean,
    value: string
  },
  photo:{
    active: boolean,
    mode: "with" | 'without'
  },
  potable: {
    active: boolean,
    strict: boolean
  },
  access_wheelchair: {
    active: boolean,
    strict: boolean
  },
  access_pet: {
    active: boolean,
    strict: boolean
  },
  access_bottle: {
    active: boolean,
    strict: boolean
  }
}

export interface PropertyMetadataCollection{
  [propName: string]: PropertyMetadata,
}

export interface QuickLink{
  id: string,
  title: string,
  value: string,
  styleClass: string
}

export type DeviceMode = 'mobile' | 'desktop';

export interface DataIssue {
  level: string;
  message: string;
  type: string;
  timeStamp: Date;
 // timeStamp: Date; #p320 todo
  context: {
    fountain_name: string;
    property_id: string;
    id_osm: string;
    id_wikidata: string;
  }
  data: object;
}

export interface AppError {
  incident: string;
  message: string;
  data: object;
}
