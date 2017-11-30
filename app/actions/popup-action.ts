import PopupReducerState from '../reducers/popup-reducer/popup-reducer-types';

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
