import { Action } from '../actions';
import { User } from '../actions/graphql';

export interface State {
  currentUser?: User;
  isLoginLoading: boolean;
  currentUserFetched: boolean;
  error?: string;
}

const initialState: State = {
  isLoginLoading: false,
  currentUserFetched: false,
};

/**
 * This reducer is for the current user - not for users generally
 */
export default function user(
  state = initialState,
  action: Action,
): State {
  switch (action.type) {
    case 'CURRENT_USER_PENDING':
      return {
        ...state,
        isUserLoading: true,
      };
    case 'CURRENT_USER_FULFILLED':
      return {
        ...state,
        isUserLoading: false,
        currentUser: action.payload,
        currentUserFetched: true,
      };
    case 'CURRENT_USER_REJECTED':
      return {
        ...state,
        isUserLoading: false,
        currentUser: undefined,
        currentUserFetched: true,
      };

    case 'LOGIN_USER_PENDING':
      return {
        ...state,
        isLoginLoading: true,
      };
    case 'LOGIN_USER_FULFILLED':
      return {
        ...state,
        currentUser: action.payload,
        isLoginLoading: false,
      };
    case 'LOGIN_USER_REJECTED':
      return {
        ...state,
        currentUser: undefined,
        isLoginLoading: false,
        error: action.error,
      };
    default:
      return state;
  }
}
