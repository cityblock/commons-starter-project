import { fetchCurrentUser, logIn, User } from './graphql';

export interface LogInUserPending {
  type: 'LOGIN_USER_PENDING';
  meta: { email: string; };
}

export interface LogInUserFulfilled {
  type: 'LOGIN_USER_FULFILLED';
  payload: User;
  meta: { email: string; };
}

export interface LogInUserRejected {
  type: 'LOGIN_USER_REJECTED';
  meta: { email: string; };
  error: string;
}

export type LogInUserAction = LogInUserPending | LogInUserFulfilled | LogInUserRejected;

interface LogInUserOptions {
  email: string;
  password: string;
}

export function logInUser({ email, password }: LogInUserOptions) {
  const payload = (async () => {
    try {
      const { data } = await logIn({ email, password });
      await localStorage.setItem('authToken', data.login!.authToken!);
      return data.login!.user;
    } catch (error) {
      await localStorage.removeItem('authToken');
    }
  })();
  return {
    type: 'LOGIN_USER',
    payload,
    meta: { email },
  };
}

export interface CurrentUserPending {
  type: 'CURRENT_USER_PENDING';
}
export interface CurrentUserSuccess {
  type: 'CURRENT_USER_FULFILLED';
  payload: User;
}
export interface CurrentUserRejected {
  type: 'CURRENT_USER_REJECTED';
  error: string;
}

export type CurrentUserAction =
  CurrentUserPending |
  CurrentUserSuccess |
  CurrentUserRejected;

export function getCurrentUser() {
  const payload = (async () => {
    try {
      const { data } = await fetchCurrentUser({});
      return data.currentUser;
    } catch (error) {
      await localStorage.removeItem('authToken');
    }
  })();
  return {
    type: 'CURRENT_USER',
    payload,
  };
}
