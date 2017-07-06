import { History } from 'history';
import { ApolloClient } from 'react-apollo';
import { routerMiddleware } from 'react-router-redux';
import { routerReducer } from 'react-router-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import { combineReducers } from 'redux';
import { createLogger } from 'redux-logger';
import { localeReducer, Lang } from './reducers/locale-reducer';

export interface IState {
  routing: any;
  locale: {
    lang: Lang;
    messages: any;
  };
}

export default (client: ApolloClient, history: History) => {
  const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const middleware = [
    createLogger(),
    routerMiddleware(history),
    client.middleware(),
  ];

  // `as any` are temporary fixes for ts 2.4 issues with redux typings
  const reducers = combineReducers<IState>({
    routing: routerReducer as any,
    locale: localeReducer as any,
    apollo: client.reducer() as any,
  });

  return createStore(reducers, composeEnhancers(applyMiddleware(...middleware)));
};
