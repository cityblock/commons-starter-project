import { getCurrentUserQuery } from '../graphql/types';

type SET_CURRENT_USER = 'SET_CURRENT_USER';
export const SET_CURRENT_USER: SET_CURRENT_USER = 'SET_CURRENT_USER';

export type CurrentUser = getCurrentUserQuery['currentUser'];

export interface ISetCurrentUser {
  type: SET_CURRENT_USER;
  currentUser: CurrentUser;
}

export const setCurrentUser = (currentUser: CurrentUser): ISetCurrentUser => {
  return {
    type: SET_CURRENT_USER,
    currentUser,
  };
};
