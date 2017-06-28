import { createMemoryHistory } from 'history';
import { ApolloClient } from 'react-apollo';
import createStore from '../store';

it('creates redux store', () => {
  const history = createMemoryHistory();
  const store = createStore(new ApolloClient(), history);
  const state = store.getState();
  expect(state.locale).toEqual({
    lang: 'en',
    messages: {
      'login.logInGoogle': 'Sign in with Google',
    },
  });
  expect(state.routing).toEqual({
    location: null,
  });
  expect(state.apollo).toEqual({
    data: {},
    mutations: {},
    optimistic: [],
    queries: {},
    reducerError: null,
  });
});
