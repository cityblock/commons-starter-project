export interface IProgressNotePopupOptions {
  patientId: string;
}

interface IProgressNotePopup {
  name: 'PROGRESS_NOTE';
  options: IProgressNotePopupOptions;
}

export interface ICreatePatientGoalPopupOptions {
  patientId: string;
  patientConcernId: string;
  goalSuggestionTemplateIds: string[];
}

interface ICreatePatientGoalPopup {
  name: 'CREATE_PATIENT_GOAL';
  options: ICreatePatientGoalPopupOptions;
}

export interface IDefaultState {
  name: '';
  options: {};
}

type PopupReducerState = ICreatePatientGoalPopup | IProgressNotePopup | IDefaultState;

export default PopupReducerState;
