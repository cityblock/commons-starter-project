import { History } from 'history';
import { debounce } from 'lodash';
import { routerMiddleware } from 'react-router-redux';
import { routerReducer } from 'react-router-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import { combineReducers } from 'redux';
import { createLogger } from 'redux-logger';
import { answerReducer, IState as AnswerReducerState } from './reducers/answer-reducer';
import { browserReducer, Size } from './reducers/browser-reducer';
import { eventNotificationsReducer } from './reducers/event-notifications-reducer';
import { idleReducer } from './reducers/idle-reducer';
import { localeReducer, Lang } from './reducers/locale-reducer';
import { popupReducer, IState as PopupReducerState } from './reducers/popup-reducer';

export interface IState {
  routing: any;
  locale: {
    lang: Lang;
    messages: any;
  };
  browser: {
    size: Size;
  };
  task: {
    taskId?: string;
  };
  eventNotifications: {
    count: number;
  };
  idle: {
    isIdle: boolean;
  };
  popup: PopupReducerState;
  answer: AnswerReducerState;
}

async function setLastAction() {
  await localStorage.setItem('lastAction', new Date().valueOf().toString());
}
const debouncedSetLastAction = debounce(setLastAction, 500);

export default (history: History) => {
  const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const middleware = [routerMiddleware(history)];

  if (process.env.NODE_ENV === 'development') {
    middleware.push(createLogger());
  }

  const reducers = combineReducers<IState>({
    browser: browserReducer,
    locale: localeReducer,
    routing: routerReducer,
    idle: idleReducer,
    eventNotifications: eventNotificationsReducer,
    popup: popupReducer,
    answer: answerReducer,
  });

  const store = createStore(reducers, composeEnhancers(applyMiddleware(...middleware)));
  store.subscribe(debouncedSetLastAction);
  return store;
};
