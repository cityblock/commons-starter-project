import { History } from 'history';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import { debouncedSetLastAction } from './middleware-link';
import { currentUserReducer, IState as CurrentUserState } from './reducers/current-user-reducer';
import {
  eventNotificationsReducer,
  IState as EventNotificationsState,
} from './reducers/event-notifications-reducer';
import { idleReducer, IState as IdleReducerState } from './reducers/idle-reducer';
import { localeReducer, IState as LocaleReducerState } from './reducers/locale-reducer';
import {
  patientLeftNavReducer,
  IState as PatientLeftNavReducerState,
} from './reducers/patient-left-nav-reducer';
import { popupReducer, IState as PopupReducerState } from './reducers/popup-reducer';

export interface IState {
  locale: LocaleReducerState;
  idle: IdleReducerState;
  eventNotifications: EventNotificationsState;
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
    popup: popupReducer as any,
    currentUser: currentUserReducer,
    patientLeftNav: patientLeftNavReducer as any,
  });

  const store = createStore(reducers, composeEnhancers(applyMiddleware(...middleware)));
  store.subscribe(debouncedSetLastAction);
  return store;
};
