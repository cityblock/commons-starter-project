import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';
import user, { State as UserState } from './user';

export interface State {
  routing: any;
  user: UserState;
}

export const reducers = combineReducers<State>({
  user,
  routing: routerReducer,
});
