import {EDIT_FILTER_TEXT, SELECT_FOUNTAIN, DESELECT_FOUNTAIN} from './actions';
import {tassign} from 'tassign';

export interface IAppState {
  filterText: string;
  filterCategory: Array<string>;
  hideList: boolean;
  city: string;
  mode: string;
  fountainId: number;
  lang: string;
  fountain: Object;
}

export const INITIAL_STATE: IAppState = {
  filterText: '',
  filterCategory: [],
  hideList: false,
  city: 'zurich',
  mode: 'map',
  fountainId: 999,
  lang: 'en',
  fountain: {},
};

export function rootReducer(state: IAppState, action):IAppState {
  switch (action.type) {
    // change fountain filter text
    case EDIT_FILTER_TEXT: return tassign(state, {filterText: action.text});
    case SELECT_FOUNTAIN: return tassign(state, {fountainId: action.fountainId, mode: 'details'});
    case DESELECT_FOUNTAIN: {return tassign(state, {mode: 'map'})};
    default: return state
  }
}
