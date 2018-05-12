import {
  EDIT_FILTER_TEXT, SELECT_FOUNTAIN, DESELECT_FOUNTAIN, SELECT_FOUNTAIN_SUCCESS, TOGGLE_LIST, HIGHLIGHT_FOUNTAIN,
  SET_USER_LOCATION, RETURN_TO_ROOT, UPDATE_FILTER_CATEGORIES, NAVIGATE_TO_FOUNTAIN, CLOSE_NAVIGATION, TOGGLE_MENU
} from './actions';
import {tassign} from 'tassign';
import {Feature} from 'geojson';
import {DEFAULT_FOUNTAINS, DEFAULT_USER_LOCATION} from '../assets/defaultData';

interface FilterCategories {
  onlyOlderThan: number,
  onlyHistoric: boolean,
  onlySpringwater: boolean,
  filterText: string
}

export interface IAppState {
  filterText: string;
  filterCategories: FilterCategories;
  showList: boolean;
  showMenu: boolean;
  city: string;
  mode: string;
  fountainId: string;
  fountainSelected: Feature<any>;
  lang: string;
  userLocation: Array<number>;
  fountainHighlighted: Feature<any>;
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
  showMenu: false,
  city: 'zurich',
  mode: 'map',
  fountainId: '',
  fountainSelected: DEFAULT_FOUNTAINS.features[0],
  lang: 'en',
  userLocation: DEFAULT_USER_LOCATION,
  fountainHighlighted: null
};

export function rootReducer(state: IAppState, action):IAppState {
  switch (action.type) {
    // change fountain filter text
    case EDIT_FILTER_TEXT: return tassign(state, {filterText: action.text});

    case HIGHLIGHT_FOUNTAIN: {
      // only highlight fountain if the fountain isn't already selected
      if(state.fountainSelected !== null && action.payload !== null){
        if(state.fountainSelected.properties.nummer == action.payload.properties.nummer){
          // return tassign(state, {fountainHighlighted: null});
        }
      }
      return tassign(state, {fountainHighlighted: action.payload});
    }

    case SELECT_FOUNTAIN: {
      return tassign(state, {
        fountainSelected: action.payload,
        fountainHighlighted: null,
        showList: false,
        mode: 'details'});
    }
    case NAVIGATE_TO_FOUNTAIN: {
      return tassign(state, {mode: 'directions'})
    }
    case CLOSE_NAVIGATION: {
      return tassign(state, {mode: 'details'})
    }
    case SELECT_FOUNTAIN_SUCCESS: return tassign(state, {fountainSelected: action.payload, mode: 'details'});
    case DESELECT_FOUNTAIN: {return tassign(state, {mode: 'map'})}
    case SET_USER_LOCATION: {return tassign(state, {userLocation: action.payload})}
    case TOGGLE_LIST: {return tassign(state, {showList: action.payload})}
    case TOGGLE_MENU: {return tassign(state, {showMenu: action.payload})}
    case RETURN_TO_ROOT: return tassign(state, {showList: false, mode: 'map', showMenu: false});
    case UPDATE_FILTER_CATEGORIES: {
      return tassign(state, {filterCategories: action.payload});}
    default: return state
  }
}

