import createHistory from 'history/createBrowserHistory';
import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';
import { routerMiddleware, ConnectedRouter } from 'react-router-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import promiseMiddleware from 'redux-promise-middleware';
import LogIn from './containers/login-container';
import Main from './containers/main';
import { reducers } from './reducers/index';

const history = createHistory();

const middleware = [
  promiseMiddleware(),
  createLogger(),
  routerMiddleware(history),
];

const store = createStore(reducers, compose(applyMiddleware(...middleware)));

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Main>
        <Route exact path='/' component={(LogIn as any)} />
      </Main>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('app'),
);
