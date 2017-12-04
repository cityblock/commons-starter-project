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

export interface IPatientConcernHamburgerMenuOptions {
  patientConcernId: string;
}

export interface IPatientConcernHamburgerMenu {
  name: 'PATIENT_CONCERN_OPTIONS';
  options: IPatientConcernHamburgerMenuOptions;
}

export interface IPatientGoalHamburgerMenuOptions {
  patientGoalId: string;
}

export interface IPatientGoalHamburgerMenu {
  name: 'PATIENT_GOAL_OPTIONS';
  options: IPatientGoalHamburgerMenuOptions;
}

export interface IDefaultState {
  name: '';
  options: {};
}

type PopupReducerState =
  | ICreatePatientConcernPopup
  | ICreatePatientGoalPopup
  | IProgressNotePopup
  | IPatientConcernHamburgerMenu
  | IPatientGoalHamburgerMenu
  | IDefaultState;

export default PopupReducerState;
