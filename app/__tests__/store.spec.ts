import { createMemoryHistory } from 'history';
import { ApolloClient } from 'react-apollo';
import createStore from '../store';

it('creates redux store', () => {
  const history = createMemoryHistory();
  const store = createStore(new ApolloClient(), history);

  expect(store.getState()).toEqual({
    apollo: {
      data: {},
      mutations: {},
      optimistic: [],
      queries: {},
      reducerError: null,
    },
    routing: {
      location: null,
    },
  });
});
