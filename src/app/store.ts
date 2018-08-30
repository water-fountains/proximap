import {
  EDIT_FILTER_TEXT, SELECT_FOUNTAIN, DESELECT_FOUNTAIN, SELECT_FOUNTAIN_SUCCESS, TOGGLE_LIST,
  SET_USER_LOCATION, RETURN_TO_ROOT, UPDATE_FILTER_CATEGORIES, NAVIGATE_TO_FOUNTAIN, CLOSE_NAVIGATION, TOGGLE_MENU, GET_DIRECTIONS_SUCCESS,
  CHANGE_LANG, TOGGLE_PREVIEW, SELECT_PROPERTY
} from './actions';
import {tassign} from 'tassign';
import {Feature} from 'geojson';
import { DEFAULT_USER_LOCATION} from '../assets/defaultData';

interface FilterCategories {
  onlyOlderThan: number,
  onlyHistoric: boolean,
  onlySpringwater: boolean,
  filterText: string
}

export interface FountainProperty{
  name?: string;
  value:any,
  source_url?: string,
  comment?: string,
  source_name?: string
}

export interface FountainSelector {
  queryType: string, // either 'byCoords' or 'byId'
  lat?: number,
  lng?: number,
  radius?: number,
  database?: string, // name of database for which the id is provided. Either 'wikidata' or 'osm'
  idval?: string  //
}

export interface IAppState {
  filterText: string;
  filterCategories: FilterCategories;
  showList: boolean;
  showMenu: boolean;
  city: string;
  mode: string;
  fountainId: string;
  directions: Object;
  previewState: string;
  fountainSelected: Feature<any>;
  propertySelected: FountainProperty;
  fountainSelector: FountainSelector;
  lang: string;
  userLocation: Array<number>;
}

export const INITIAL_STATE: IAppState = {
  filterText: '',
  filterCategories: {
    onlyOlderThan: null,
    onlyHistoric: false,
    onlySpringwater: false,
    filterText: ''
  },
  showList: false,
  previewState: 'closed',
  showMenu: false,
  city: 'zurich',
  mode: 'map',
  fountainId: null,
  directions: null,
  fountainSelected: null,
  propertySelected: null,
  fountainSelector: null,
  lang: 'de',
  userLocation: DEFAULT_USER_LOCATION
};

export function rootReducer(state: IAppState, action):IAppState {
  switch (action.type) {
    // change fountain filter text
    case EDIT_FILTER_TEXT: return tassign(state, {filterText: action.text});


    case SELECT_FOUNTAIN: {
      return tassign(state, {
        fountainSelected: action.payload,
        mode: 'details'});
    }
    case SELECT_PROPERTY: {
      return tassign(state, {
        propertySelected: action.payload});
    }
    case NAVIGATE_TO_FOUNTAIN: {
      return tassign(state, {mode: 'directions'})
    }
    case CLOSE_NAVIGATION: {
      return tassign(state, {mode: 'details'})
    }
    case SELECT_FOUNTAIN_SUCCESS: return tassign(state, {
      fountainSelected: action.payload.fountain,
      fountainSelector: action.payload.selector,
      mode: 'details',
      showList: false,
    });
    case GET_DIRECTIONS_SUCCESS: {return tassign(state, {mode: 'directions', directions: action.payload})}
    case DESELECT_FOUNTAIN: {return tassign(state, {
      mode: 'map',
      fountainSelected: null
    })}
    case SET_USER_LOCATION: {return tassign(state, {userLocation: action.payload})}
    case TOGGLE_LIST: {return tassign(state, {showList: action.payload})}
    case TOGGLE_MENU: {return tassign(state, {showMenu: action.payload})}
    case TOGGLE_PREVIEW: {return tassign(state, {previewState: action.payload})}
    case RETURN_TO_ROOT: return tassign(state, {showList: false, mode: 'map', showMenu: false});

    // Added state for Language Change
    case CHANGE_LANG:
    return tassign(state, { lang: action.payload });

    case UPDATE_FILTER_CATEGORIES: {
      return tassign(state, {filterCategories: action.payload});}
    default: return state
  }
}

