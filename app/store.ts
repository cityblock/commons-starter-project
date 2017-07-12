import { History } from 'history';
import { ApolloClient } from 'react-apollo';
import { routerMiddleware } from 'react-router-redux';
import { routerReducer } from 'react-router-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import { combineReducers } from 'redux';
import { createLogger } from 'redux-logger';
import { browserReducer, Size } from './reducers/browser-reducer';
import { localeReducer, Lang } from './reducers/locale-reducer';
import { taskReducer } from './reducers/task-reducer';

export interface IState {
  routing: any;
  locale: {
    lang: Lang;
    messages: any;
  };
  browser: {
    size: Size,
  };
  task: {
    taskId?: string;
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
    apollo: client.reducer() as any,
    browser: browserReducer as any,
    locale: localeReducer as any,
    routing: routerReducer as any,
    task: taskReducer as any,
  });

  return createStore(reducers, composeEnhancers(applyMiddleware(...middleware)));
};
