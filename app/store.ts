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

  const reducers = combineReducers<IState>({
    routing: routerReducer,
    locale: localeReducer,
    apollo: client.reducer(),
  });

  return createStore(reducers, composeEnhancers(applyMiddleware(...middleware)));
};
