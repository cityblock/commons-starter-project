import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient, ErrorPolicy, FetchPolicy } from 'apollo-client';
import createHistory from 'history/createBrowserHistory';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import { getMiddlewareLink } from './middleware-link';
import createStore from './store';

// NOTE: These do absolutely nothing unfortunately
const defaultOptions = {
  watch: {
    fetchPolicy: 'network-only' as FetchPolicy,
    errorPolicy: 'all' as ErrorPolicy,
  },
  query: {
    fetchPolicy: 'network-only' as FetchPolicy,
    errorPolicy: 'all' as ErrorPolicy,
  },
  mutate: {
    errorPolicy: 'all' as ErrorPolicy,
  },
};

const client = new ApolloClient({
  link: getMiddlewareLink(),
  cache: new InMemoryCache().restore({}),
  defaultOptions,
});

const history = createHistory();
const store = createStore(history);

const rootEl = document.getElementById('app');
const render = (Component: typeof App) =>
  ReactDOM.render(<Component store={store} client={client} />, rootEl);

render(App);
