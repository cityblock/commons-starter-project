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

export interface ICreatePatientConcernPopupOptions {
  patientId: string;
}

interface ICreatePatientConcernPopup {
  name: 'CREATE_PATIENT_CONCERN';
  options: ICreatePatientConcernPopupOptions;
}

export interface IDefaultState {
  name: '';
  options: {};
}

type PopupReducerState =
  | ICreatePatientConcernPopup
  | ICreatePatientGoalPopup
  | IProgressNotePopup
  | IDefaultState;

export default PopupReducerState;
