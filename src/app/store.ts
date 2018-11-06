import {
  EDIT_FILTER_TEXT, SELECT_FOUNTAIN, DESELECT_FOUNTAIN, SELECT_FOUNTAIN_SUCCESS, TOGGLE_LIST,
  SET_USER_LOCATION, CLOSE_SIDEBARS, UPDATE_FILTER_CATEGORIES, NAVIGATE_TO_FOUNTAIN, CLOSE_NAVIGATION, TOGGLE_MENU, GET_DIRECTIONS_SUCCESS,
  CHANGE_LANG, TOGGLE_PREVIEW, SELECT_PROPERTY, CLOSE_DETAIL, CHANGE_CITY, CHANGE_MODE, CHANGE_TRAVEL_MODE
} from './actions';
import {tassign} from 'tassign';
import {Feature} from 'geojson';
import { DEFAULT_USER_LOCATION} from '../assets/defaultData';

export interface FilterCategories {
  onlyOlderThan: number,
  onlyNotable: boolean,
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
  travelMode: string;
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
    onlyNotable: false,
    onlySpringwater: false,
    filterText: ''
  },
  showList: false,
  previewState: 'closed',
  showMenu: false,
  city: null,
  mode: null,
  fountainId: null,
  directions: null,
  travelMode: 'walking',
  fountainSelected: null,
  propertySelected: null,
  fountainSelector: null,
  lang: 'de',
  userLocation: null
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
    case CLOSE_DETAIL: {
      return tassign(state, {mode: 'map', fountainSelector: null})
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
    case CLOSE_SIDEBARS: {
      // close all sidebars
      return tassign(state, {showList: false, showMenu: false})
    }

    // Added state for Language Change
    case CHANGE_LANG:
      return tassign(state, { lang: action.payload });

    // Change city
    case CHANGE_CITY:
      return tassign(state, { city: action.payload });

    // Change mode
    case CHANGE_MODE:{
      if(action.payload === 'map') {
        return tassign(state, { mode: action.payload, fountainSelector: null })
      }else{
        return tassign(state, { mode: action.payload});
      }
    }

    case CHANGE_TRAVEL_MODE:
      return tassign(state, {travelMode: action.payload});

    case UPDATE_FILTER_CATEGORIES:
      return tassign(state, {filterCategories: action.payload});

    default: return state
  }
}

