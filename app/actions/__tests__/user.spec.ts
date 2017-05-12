import configureMockStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import { mockGraphQLFetch, restoreGraphQLFetch } from '../../spec.helpers';
import { getCurrentUser, logInUser } from '../user';

const mockStore = configureMockStore([promiseMiddleware()]);

const user = {
  email: 'brennan@sidewalklabs.com',
  firstName: null,
  id: '1',
  lastName: null,
  userRole: 'physician',
  __typename: 'User',
};

describe('user actions', () => {

  afterEach(restoreGraphQLFetch);

  it('logs in and returns current user', async () => {
    const store = mockStore({});
    const res = {
      data: {
        login: {
          user,
          authToken: 'cool-token',
        },
      },
    };
    mockGraphQLFetch(res);

    await store.dispatch(logInUser({ email: 'a@b.com', password: 'password' }));

    expect(store.getActions()[0]).toMatchObject({
      type: 'LOGIN_USER_PENDING',
      meta: { email: 'a@b.com' },
    });
    expect(store.getActions()[1]).toMatchObject({
      type: 'LOGIN_USER_FULFILLED',
      payload: user,
    });
  });

  it('returns current user', async () => {
    const store = mockStore({});
    const res = {
      data: {
        currentUser: user,
      },
    };
    mockGraphQLFetch(res);

    await store.dispatch(getCurrentUser());

    expect(store.getActions()[0]).toMatchObject({
      type: 'CURRENT_USER_PENDING',
    });
    expect(store.getActions()[1]).toMatchObject({
      type: 'CURRENT_USER_FULFILLED',
      payload: user,
    });
  });
});
