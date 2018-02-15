import {
  permissionsMappings,
  PermissionsMapping,
} from '../../shared/permissions/permissions-mapping';
import { Action } from '../actions';
import { CurrentUser, SET_CURRENT_USER } from '../actions/current-user-action';

export interface IState {
  currentUser: CurrentUser;
  featureFlags: PermissionsMapping | null;
}

export const initialState: IState = {
  currentUser: null,
  featureFlags: null,
};

export const currentUserReducer = (state = initialState, action: Action): IState => {
  switch (action.type) {
    case SET_CURRENT_USER:
      const featureFlags = !!action.currentUser
        ? permissionsMappings[action.currentUser.permissions]
        : null;

      return {
        currentUser: action.currentUser,
        featureFlags,
      };
    default:
      return state;
  }
};
