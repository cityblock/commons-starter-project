import { Action } from '../actions';
import { ENGLISH_TRANSLATION } from './messages/en';
import { SPANISH_TRANSLATION } from './messages/es';

export type Lang = 'en' | 'es';

export interface IState {
  lang: Lang;
  messages: any;
}

const initialState: IState = {
  lang: ENGLISH_TRANSLATION.lang,
  messages: ENGLISH_TRANSLATION.messages,
};

export const localeReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case 'LOCALE_SELECTED':
      switch (action.locale) {
        case 'es':
          return {
            ...initialState,
            lang: SPANISH_TRANSLATION.lang,
            messages: SPANISH_TRANSLATION.messages,
          };
        default:
          return {
            ...initialState,
            lang: ENGLISH_TRANSLATION.lang,
            messages: ENGLISH_TRANSLATION.messages,
          };
      }
    default:
      return state;
  }
};
