import { Action } from '../actions';

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

export interface IPatientGoalDeletePopupOptions {
  patientGoalTitle: string;
  patientGoalId: string;
}

export interface IPatientGoalDeletePopup {
  name: 'DELETE_PATIENT_GOAL';
  options: IPatientGoalDeletePopupOptions;
}

export interface IPatientConcernDeletePopupOptions {
  patientConcernTitle: string;
  patientConcernId: string;
}

export interface IPatientConcernDeletePopup {
  name: 'DELETE_PATIENT_CONCERN';
  options: IPatientConcernDeletePopupOptions;
}

export interface IDefaultState {
  name: '';
  options: {};
}

export type IState =
  | ICreatePatientConcernPopup
  | ICreatePatientGoalPopup
  | IProgressNotePopup
  | IPatientConcernHamburgerMenu
  | IPatientGoalHamburgerMenu
  | IPatientGoalDeletePopup
  | IPatientConcernDeletePopup
  | IDefaultState;

export const initialState: IDefaultState = {
  name: '',
  options: {},
};

export const popupReducer = (state = initialState, action: Action): IState => {
  switch (action.type) {
    case 'POPUP_OPEN':
      return action.popup;
    case 'POPUP_CLOSE':
      return initialState;
    default:
      return state;
  }
};
