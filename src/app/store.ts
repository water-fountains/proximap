/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import { CHANGE_CITY } from './actions';
import { tassign } from 'tassign';
import { DataIssue } from './types';
import { City } from './locations';
import { LayoutService } from './core/layout.service';

export interface FountainProperty {
  id?: string;
  value: any;
  source_url?: string;
  comment?: string;
  source_name?: string;
  issues?: DataIssue[];
}
// TODO @ralf.hauser, there was the comment here that it should either be wikidata or osm, but operator is defined in route-validator.service.ts
export type Database = 'wikidata' | 'osm' | 'operator'; // name of database for which the id is provided

export function isDatabase(s: string): s is Database {
  return s === 'wikidata' || s === 'osm' || s === 'operator';
}

export interface FountainSelector {
  queryType: 'byCoords' | 'byId';
  lat?: number;
  lng?: number;
  radius?: number;
  database?: Database;
  idval?: string;
}

export interface IAppState {
  city: City | null;
}

export const INITIAL_STATE: IAppState = {
  city: null,
};

export function rootReducer(state: IAppState, action: any, layoutService: LayoutService): IAppState {
  switch (action.type) {
    // Change city
    case CHANGE_CITY:
      // when changing city, change to map mode and unselect fountain
      layoutService.closeDetail();
      return tassign(state, { city: action.payload });

    default:
      return state;
  }
}
