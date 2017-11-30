export interface IProgressNotePopupOptions {
  patientId: string;
}

interface IProgressNotePopup {
  name: 'PROGRESS_NOTE';
  options: IProgressNotePopupOptions;
}

export interface IDefaultState {
  name: '';
  options: {};
}

type PopupReducerState = IProgressNotePopup | IDefaultState;

export default PopupReducerState;
