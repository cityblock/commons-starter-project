import { History } from 'history';
import { ApolloClient } from 'react-apollo';
import { routerReducer } from 'react-router-redux';
import { routerMiddleware } from 'react-router-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import { combineReducers } from 'redux';
import { createLogger } from 'redux-logger';

export interface IState {
  routing: any;
}

export default (client: ApolloClient, history: History) => {
  const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const middleware = [
    createLogger(),
    routerMiddleware(history),
    client.middleware(),
  ];

  const reducers = combineReducers<IState>({
    routing: routerReducer,
    apollo: client.reducer(),
  });

  return createStore(reducers, composeEnhancers(applyMiddleware(...middleware)));
};
