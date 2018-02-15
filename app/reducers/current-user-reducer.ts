import {
  permissionsMappings,
  PermissionsMapping,
} from '../../shared/permissions/permissions-mapping';
import { Action } from '../actions';
import { CurrentUser, SET_CURRENT_USER } from '../actions/current-user-action';

export interface IState {
  currentUser: CurrentUser;
  featureFlags: PermissionsMapping | {};
}

export const initialState: IState = {
  currentUser: null,
  featureFlags: {},
};

export const currentUserReducer = (state = initialState, action: Action): IState => {
  switch (action.type) {
    case SET_CURRENT_USER:
      const featureFlags = !!action.currentUser
        ? permissionsMappings[action.currentUser.permissions]
        : {};

      return {
        currentUser: action.currentUser,
        featureFlags,
      };
    default:
      return state;
  }
};
