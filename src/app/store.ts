/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import { NAVIGATE_TO_FOUNTAIN, CLOSE_NAVIGATION, CLOSE_DETAIL, CHANGE_CITY, CHANGE_MODE } from './actions';
import { tassign } from 'tassign';
import { DataIssue } from './types';
import { City } from './locations';
import { FountainService } from './fountain/fountain.service';

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
  mode: string;
}

export const INITIAL_STATE: IAppState = {
  city: null,
  mode: 'map',
};

export function rootReducer(state: IAppState, action: any, fountainService: FountainService): IAppState {
  switch (action.type) {
    case NAVIGATE_TO_FOUNTAIN: {
      return tassign(state, { mode: 'directions' });
    }
    case CLOSE_NAVIGATION: {
      return tassign(state, { mode: 'details' });
    }
    case CLOSE_DETAIL: {
      fountainService.deselectFountain();
      return tassign(state, { mode: 'map' });
    }

    // Change city
    case CHANGE_CITY:
      // when changing city, change to map mode and unselect fountain
      fountainService.deselectFountain();
      return tassign(state, { city: action.payload, mode: 'map' });

    // Change mode
    case CHANGE_MODE: {
      if (action.payload === 'map') {
        fountainService.deselectFountain();
        return tassign(state, { mode: action.payload });
      } else {
        return tassign(state, { mode: action.payload });
      }
    }

    default:
      return state;
  }
}
