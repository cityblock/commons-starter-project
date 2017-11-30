import { Action } from '../../actions';
import PopupReducerState, { IDefaultState } from './popup-reducer-types';

export const initialState: IDefaultState = {
  name: '',
  options: {},
};

export const popupReducer = (state = initialState, action: Action): PopupReducerState => {
  switch (action.type) {
    case 'POPUP_OPEN':
      return action.popup;
    case 'POPUP_CLOSE':
      return initialState;
    default:
      return state;
  }
};
