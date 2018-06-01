import { Action } from '../actions';

export interface IState {
  isIdle: boolean;
}

const initialState: IState = {
  isIdle: false,
};

export const idleReducer = (state = initialState, action: Action): IState => {
  switch (action.type) {
    case 'IDLE_START':
      return {
        isIdle: true,
      };
    case 'IDLE_END':
      return {
        isIdle: false,
      };
    default:
      return state;
  }
};
