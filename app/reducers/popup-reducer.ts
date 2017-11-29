import { Action } from '../actions';

interface IState {
  progressNoteOpen: boolean;
  patientId?: string;
}

const initialState: IState = {
  progressNoteOpen: false,
};

export const popupReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case 'PROGRESS_NOTE_OPEN':
      return {
        ...initialState,
        progressNoteOpen: true,
        patientId: action.patientId,
      };
    case 'PROGRESS_NOTE_CLOSE':
      return {
        ...initialState,
        progressNoteOpen: false,
      };
    default:
      return {
        ...initialState,
      };
  }
};
