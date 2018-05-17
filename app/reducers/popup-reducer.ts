import { Action } from '../actions';
import { FullCarePlanSuggestionFragment } from '../graphql/types';

export interface IProgressNotePopupOptions {
  progressNoteId: string;
}

interface IProgressNotePopup {
  name: 'PROGRESS_NOTE';
  options: IProgressNotePopupOptions;
}

interface IProgressNotesDrawer {
  name: 'PROGRESS_NOTES_DRAWER';
  options: {};
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

export interface IPatientQuestionHamburgerMenu {
  name: 'PATIENT_QUESTION_OPTIONS';
  options: IPatientQuestionHamburgerMenuOptions;
}

export interface IPatientQuestionHamburgerMenuOptions {
  questionId: string;
  patientAnswerIds: string[];
}

export interface IComputedFieldFlagPopup {
  name: 'COMPUTED_FIELD_FLAG';
  options: IComputedFieldFlagPopupOptions;
}

export interface IComputedFieldFlagPopupOptions {
  patientAnswerIds: string[];
}

export interface IQuickCallPopup {
  name: 'QUICK_CALL';
  options: IQuickCallPopupOptions;
}

export interface IQuickCallPopupOptions {
  patientId: string;
}

export interface IScreeningToolPopup {
  name: 'SCREENING_TOOL';
  options: IScreeningToolPopupOptions;
}

export interface IScreeningToolPopupOptions {
  patientId: string;
}

export interface IPatientPhotoPopup {
  name: 'PATIENT_PHOTO';
  options: IPatientPhotoPopupOptions;
}

export interface IPatientPhotoPopupOptions {
  patientId: string;
  patientInfoId: string;
}

export interface IGlobalErrorPopup {
  name: 'GLOBAL_ERROR';
  options: IGlobalErrorPopupOptions;
}

export interface IGlobalErrorPopupOptions {
  message: string;
}

export interface ICarePlanSuggestionsPopup {
  name: 'CARE_PLAN_SUGGESTIONS';
  options: ICarePlanSuggestionsPopupOptions;
}

export interface ICarePlanSuggestionsPopupOptions {
  patientId: string;
  carePlanSuggestions: FullCarePlanSuggestionFragment[];
}

export interface ITaskUnfollowPopup {
  name: 'TASK_UNFOLLOW';
  options: ITaskUnfollowPopupOptions;
}

export interface ITaskUnfollowPopupOptions {
  taskId: string;
  userId: string;
}

export interface IDefaultState {
  name: '';
  options: {};
}

export type IState =
  | ICreatePatientConcernPopup
  | ICreatePatientGoalPopup
  | IProgressNotePopup
  | IProgressNotesDrawer
  | IPatientConcernHamburgerMenu
  | IPatientGoalHamburgerMenu
  | IPatientGoalDeletePopup
  | IPatientConcernDeletePopup
  | IPatientQuestionHamburgerMenu
  | IComputedFieldFlagPopup
  | IQuickCallPopup
  | IScreeningToolPopup
  | IPatientPhotoPopup
  | IGlobalErrorPopup
  | ICarePlanSuggestionsPopup
  | ITaskUnfollowPopup
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
