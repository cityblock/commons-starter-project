import createHistory from 'history/createBrowserHistory';
import * as React from 'react';
import {
  createBatchingNetworkInterface,
  ApolloClient,
  ApolloProvider,
} from 'react-apollo';
import { render } from 'react-dom';
import { Route } from 'react-router-dom';
import { routerReducer } from 'react-router-redux';
import { routerMiddleware, ConnectedRouter } from 'react-router-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import { combineReducers } from 'redux';
import { createLogger } from 'redux-logger';
import { API_URL } from './config';

import LogIn from './containers/login-container';
import Main from './containers/main';

const history = createHistory();

const networkInterface = createBatchingNetworkInterface({
  uri: process.env.NODE_ENV === 'test' ? `https://localhost:3000${API_URL}` : API_URL,
  batchInterval: 10,
});
networkInterface.use([
  {
    async applyBatchMiddleware(req, next) {
      if (!req.options.headers) {
        req.options.headers = {}; // Create the header object if needed.
      }
      // This returns null if authToken is not in store.
      const authToken = await localStorage.getItem('authToken');
      if (authToken) {
        req.options.headers.auth_token = authToken;
      }
      next();
    },
  },
]);

const client = new ApolloClient({ networkInterface });

const middleware = [
  createLogger(),
  routerMiddleware(history),
  client.middleware(),
];

export interface IState {
  routing: any;
}

const reducers = combineReducers<IState>({
  routing: routerReducer,
  apollo: client.reducer(),
});

const store = createStore(reducers, compose(applyMiddleware(...middleware)));

render(
  <ApolloProvider store={store} client={client}>
    <ConnectedRouter history={history}>
      <Main>
        <Route exact path='/' component={(LogIn as any)} />
      </Main>
    </ConnectedRouter>
  </ApolloProvider>,
  document.getElementById('app'),
);
