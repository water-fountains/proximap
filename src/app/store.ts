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
  TOGGLE_LIST,
  SET_USER_LOCATION,
  CLOSE_SIDEBARS,
  NAVIGATE_TO_FOUNTAIN,
  CLOSE_NAVIGATION,
  TOGGLE_MENU,
  GET_DIRECTIONS_SUCCESS,
  TOGGLE_PREVIEW,
  SELECT_PROPERTY,
  CLOSE_DETAIL,
  CHANGE_CITY,
  CHANGE_MODE,
  CHANGE_TRAVEL_MODE,
  SET_DEVICE,
} from './actions';
import { tassign } from 'tassign';
import { Feature } from 'geojson';
import { DataIssue, DeviceMode } from './types';
import { _ } from 'lodash';
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
  isMetadataLoaded: boolean;
  filterText: string;
  showList: boolean;
  showMenu: boolean;
  city: City | null;
  mode: string;
  fountainId: string;
  directions: Object;
  travelMode: string;
  previewState: string;
  fountainSelected: Feature<any>;
  propertySelected: FountainProperty;
  fountainSelector: FountainSelector;
  device: DeviceMode;
  userLocation: number[];
}

export const INITIAL_STATE: IAppState = {
  isMetadataLoaded: false,
  filterText: '',
  showList: false,
  previewState: 'closed',
  showMenu: false,
  city: null,
  mode: 'map',
  fountainId: null,
  directions: null,
  travelMode: 'walking',
  fountainSelected: null,
  propertySelected: null,
  fountainSelector: null,
  device: 'mobile',
  userLocation: null,
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
        showList: false,
      });
    case GET_DIRECTIONS_SUCCESS: {
      return tassign(state, { mode: 'directions', directions: action.payload });
    }
    case DESELECT_FOUNTAIN: {
      return tassign(state, {
        mode: 'map',
        fountainSelected: null,
      });
    }
    case SET_USER_LOCATION: {
      return tassign(state, { userLocation: action.payload });
    }
    case TOGGLE_LIST: {
      return tassign(state, { showList: action.payload });
    }
    case TOGGLE_MENU: {
      return tassign(state, { showMenu: action.payload });
    }
    case TOGGLE_PREVIEW: {
      return tassign(state, { previewState: action.payload });
    }
    case CLOSE_SIDEBARS: {
      // close all sidebars
      return tassign(state, { showList: false, showMenu: false });
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

    case CHANGE_TRAVEL_MODE:
      return tassign(state, { travelMode: action.payload });

    case SET_DEVICE:
      return tassign(state, { device: action.payload });

    default:
      return state;
  }
}
