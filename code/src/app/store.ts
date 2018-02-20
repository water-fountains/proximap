import {EDIT_FILTER_TEXT, SELECT_FOUNTAIN, DESELECT_FOUNTAIN, SELECT_FOUNTAIN_SUCCESS, SHOW_LIST} from './actions';
import {tassign} from 'tassign';
import {Feature} from 'geojson';
import {DEFAULT_FOUNTAINS} from '../assets/defaultData';

export interface IAppState {
  filterText: string;
  filterCategory: Array<string>;
  showList: boolean;
  city: string;
  mode: string;
  fountainId: string;
  fountainSelected: Feature<any>;
  lang: string;
}

export const INITIAL_STATE: IAppState = {
  filterText: '',
  filterCategory: [],
  showList: false,
  city: 'zurich',
  mode: 'map',
  fountainId: '',
  fountainSelected: DEFAULT_FOUNTAINS.features[0],
  lang: 'en'
};

export function rootReducer(state: IAppState, action):IAppState {
  switch (action.type) {
    // change fountain filter text
    case EDIT_FILTER_TEXT: return tassign(state, {filterText: action.text});
    case SELECT_FOUNTAIN: return tassign(state, {fountainId: action.fountainId, showList: false});
    case SELECT_FOUNTAIN_SUCCESS: return tassign(state, {fountainSelected: action.payload, mode: 'details'});
    case DESELECT_FOUNTAIN: {return tassign(state, {mode: 'map'})}
    case SHOW_LIST: {return tassign(state, {showList: true})}
    default: return state
  }
}
