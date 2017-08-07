import { createMemoryHistory } from 'history';
import { ApolloClient } from 'react-apollo';
import createStore from '../store';

it('creates redux store', () => {
  const history = createMemoryHistory();
  const store = createStore(new ApolloClient(), history);
  const state = store.getState() as any;
  expect(state.locale.lang).toEqual('en');
  expect(state.locale.messages).not.toBeNull();
  expect(state.routing).toEqual({
    location: null,
  });
  expect(state.apollo).toEqual({data: {}, optimistic: [], reducerError: null});
});
