import { History } from 'history';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import { debouncedSetLastAction } from './middleware-link';
import { currentUserReducer, IState as CurrentUserState } from './reducers/current-user-reducer';
import { eventNotificationsReducer } from './reducers/event-notifications-reducer';
import { idleReducer } from './reducers/idle-reducer';
import { localeReducer, Lang } from './reducers/locale-reducer';
import {
  patientLeftNavReducer,
  IState as PatientLeftNavReducerState,
} from './reducers/patient-left-nav-reducer';
import { popupReducer, IState as PopupReducerState } from './reducers/popup-reducer';

export interface IState {
  locale: {
    lang: Lang;
    messages: any;
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
  currentUser: CurrentUserState;
  patientLeftNav: PatientLeftNavReducerState;
}

export default (history: History) => {
  const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const middleware: any = [];

  if (process.env.NODE_ENV === 'development') {
    middleware.push(createLogger());
  }

  const reducers = combineReducers<IState>({
    locale: localeReducer,
    idle: idleReducer,
    eventNotifications: eventNotificationsReducer,
    popup: popupReducer,
    currentUser: currentUserReducer,
    patientLeftNav: patientLeftNavReducer,
  });

  const store = createStore(reducers, composeEnhancers(applyMiddleware(...middleware)));
  store.subscribe(debouncedSetLastAction);
  return store;
};
