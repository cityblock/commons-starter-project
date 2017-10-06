import { Action } from '../actions';

interface IState {
  taskId?: string;
}

const initialState: IState = {
  taskId: undefined,
};

export const taskReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case 'TASK_SELECTED':
      return {
        ...initialState,
        taskId: action.taskId,
      };
    default:
      return state;
  }
};
