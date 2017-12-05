import { IState as PopupReducerState } from '../reducers/popup-reducer';

export interface IPopupClose {
  type: 'POPUP_CLOSE';
}

export interface IPopupOpen {
  type: 'POPUP_OPEN';
  popup: PopupReducerState;
}

export const closePopup = (): IPopupClose => ({
  type: 'POPUP_CLOSE',
});

export const openPopup = (popup: PopupReducerState): IPopupOpen => ({
  type: 'POPUP_OPEN',
  popup,
});
