/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import {
  SELECT_FOUNTAIN,
  DESELECT_FOUNTAIN,
  SELECT_FOUNTAIN_SUCCESS,
  NAVIGATE_TO_FOUNTAIN,
  CLOSE_NAVIGATION,
  SELECT_PROPERTY,
  CLOSE_DETAIL,
  CHANGE_CITY,
  CHANGE_MODE,
} from './actions';
import { tassign } from 'tassign';
import { DataIssue, Fountain } from './types';
import { City } from './locations';

export interface FountainProperty {
  id?: string;
  value: any;
  source_url?: string;
  comment?: string;
  source_name?: string;
  issues?: DataIssue[];
}

export interface FountainSelector {
  queryType: string; // either 'byCoords' or 'byId'
  lat?: number;
  lng?: number;
  radius?: number;
  database?: string; // name of database for which the id is provided. Either 'wikidata' or 'osm'
  idval?: string; //
}

export interface IAppState {
  city: City | null;
  mode: string;
  fountainId: string;
  fountainSelected: Fountain;
  propertySelected: FountainProperty;
  fountainSelector: FountainSelector;
}

export const INITIAL_STATE: IAppState = {
  city: null,
  mode: 'map',
  fountainId: null,
  fountainSelected: null,
  propertySelected: null,
  fountainSelector: null,
};

export function rootReducer(state: IAppState, action: any): IAppState {
  switch (action.type) {
    case SELECT_FOUNTAIN: {
      return tassign(state, {
        fountainSelected: action.payload,
        mode: 'details',
      });
    }
    case SELECT_PROPERTY: {
      if (action.payload !== null) {
        return tassign(state, {
          propertySelected: state.fountainSelected.properties[action.payload],
        });
      } else {
        return tassign(state, {
          propertySelected: null,
        });
      }
    }
    case NAVIGATE_TO_FOUNTAIN: {
      return tassign(state, { mode: 'directions' });
    }
    case CLOSE_NAVIGATION: {
      return tassign(state, { mode: 'details' });
    }
    case CLOSE_DETAIL: {
      return tassign(state, { mode: 'map', fountainSelector: null });
    }
    case SELECT_FOUNTAIN_SUCCESS:
      return tassign(state, {
        fountainSelected: action.payload.fountain,
        fountainSelector: action.payload.selector,
        mode: 'details',
      });
    case DESELECT_FOUNTAIN: {
      return tassign(state, {
        mode: 'map',
        fountainSelected: null,
      });
    }

    // Change city
    case CHANGE_CITY:
      // when changing city, change to map mode and unselect fountain
      return tassign(state, { city: action.payload, mode: 'map', fountainSelector: null });

    // Change mode
    case CHANGE_MODE: {
      if (action.payload === 'map') {
        return tassign(state, { mode: action.payload, fountainSelector: null });
      } else {
        return tassign(state, { mode: action.payload });
      }
    }

    default:
      return state;
  }
}
