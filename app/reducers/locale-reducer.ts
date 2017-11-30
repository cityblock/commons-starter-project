import { Action } from '../actions';
import { ENGLISH_TRANSLATION } from './messages/en';
import { SPANISH_TRANSLATION } from './messages/es';

export type Lang = 'en' | 'es';

interface IState {
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
            ...state,
            lang: SPANISH_TRANSLATION.lang,
            messages: SPANISH_TRANSLATION.messages,
          };
        default:
          return {
            ...state,
            lang: ENGLISH_TRANSLATION.lang,
            messages: ENGLISH_TRANSLATION.messages,
          };
      }
    default:
      return state;
  }
};
