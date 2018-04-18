import { Action } from '../actions';

export type Selected = 'careTeam' | 'scratchPad' | 'message' | 'quickActions';
export type IState = Selected | null;

export const initialState: IState = null;

export const patientLeftNavReducer = (state = initialState, action: Action): IState => {
  switch (action.type) {
    case 'UPDATE_PATIENT_LEFT_NAV_SELECTED':
      return action.selected;
    default:
      return state;
  }
};
