import { Lang } from '../reducers/locale-reducer';

export interface ILocaleSelected {
  type: 'LOCALE_SELECTED';
  locale: Lang;
}

export function selectLocale(locale: Lang): ILocaleSelected {
  return {
    type: 'LOCALE_SELECTED',
    locale,
  };
}
