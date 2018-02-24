import {
  EDIT_FILTER_TEXT, SELECT_FOUNTAIN, DESELECT_FOUNTAIN, SELECT_FOUNTAIN_SUCCESS, TOGGLE_LIST, HIGHLIGHT_FOUNTAIN,
  SET_USER_LOCATION
} from './actions';
import {tassign} from 'tassign';
import {Feature} from 'geojson';
import {DEFAULT_FOUNTAINS, DEFAULT_USER_LOCATION} from '../assets/defaultData';

export interface IAppState {
  filterText: string;
  filterCategory: Array<string>;
  showList: boolean;
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
  filterCategory: [],
  showList: false,
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
    case HIGHLIGHT_FOUNTAIN: return tassign(state, {fountainHighlighted: action.payload});
    case SELECT_FOUNTAIN: return tassign(state, {fountainSelected: action.payload, showList: false, mode: 'details'});
    case SELECT_FOUNTAIN_SUCCESS: return tassign(state, {fountainSelected: action.payload, mode: 'details'});
    case DESELECT_FOUNTAIN: {return tassign(state, {mode: 'map'})}
    case SET_USER_LOCATION: {return tassign(state, {userLocation: action.payload})}
    case TOGGLE_LIST: {return tassign(state, {showList: action.payload})}
    default: return state
  }
}

