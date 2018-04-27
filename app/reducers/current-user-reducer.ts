import {
  permissionsMappings,
  PermissionsMapping,
} from '../../shared/permissions/permissions-mapping';
import { Action } from '../actions';
import { CurrentUser, SET_CURRENT_USER } from '../actions/current-user-action';

export interface IState {
  currentUser: CurrentUser;
  featureFlags: PermissionsMapping | null;
  isAuthenticated: boolean;
}

export const initialState: IState = {
  currentUser: null,
  featureFlags: null,
  isAuthenticated: false,
};

export const currentUserReducer = (state = initialState, action: Action): IState => {
  switch (action.type) {
    case SET_CURRENT_USER:
      const featureFlags = !!action.currentUser
        ? permissionsMappings[action.currentUser.permissions]
        : null;

      return {
        currentUser: action.currentUser,
        isAuthenticated: action.currentUser && action.currentUser.id ? true : false,
        featureFlags,
      };
    default:
      return state;
  }
};
