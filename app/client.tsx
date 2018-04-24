import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import createHistory from 'history/createBrowserHistory';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './app';
import { getMiddlewareLink } from './middleware-link';
import createStore from './store';

// TODO: Resolve weird apollo types
const client = new ApolloClient({
  link: getMiddlewareLink(),
  cache: new InMemoryCache().restore({}),
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
