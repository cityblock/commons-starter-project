import { Action } from '../actions';

export interface IState {
  taskId?: string;
}

const initialState: IState = {
  taskId: undefined,
};

export const idleReducer = (state = initialState, action: Action) => {
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
