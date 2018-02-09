import {FILTER_TEXT} from './actions';
import {tassign} from 'tassign';

export interface IAppState {
  filterText: string;
}

export const INITIAL_STATE: IAppState = {
  filterText: ''
};

export function rootReducer(state: IAppState, action):IAppState {
  switch (action.type) {
    // change fountain filter text
    case FILTER_TEXT: return tassign(state, {filterText: action.text})
  }
}
