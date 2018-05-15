import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient, ErrorPolicy, FetchPolicy } from 'apollo-client';
import createHistory from 'history/createBrowserHistory';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './app';
import { getMiddlewareLink } from './middleware-link';
import createStore from './store';

const defaultOptions = {
  watchQuery: {
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
  ReactDOM.render(
    <AppContainer>
      <Component store={store} client={client} />
    </AppContainer>,
    rootEl,
  );

render(App);
if ((module as any).hot) (module as any).hot.accept('./app', () => render(App));
