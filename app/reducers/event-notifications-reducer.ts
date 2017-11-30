import { Action } from '../actions';

interface IState {
  count: number;
}

const initialState: IState = { count: 0 };

export const eventNotificationsReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case 'EVENT_NOTIFICATIONS_COUNT_UPDATED':
      return {
        ...state,
        count: action.count,
      };
    default:
      return state;
  }
};
