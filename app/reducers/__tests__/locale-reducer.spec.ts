import { ILocaleSelected } from '../../actions/locale-action';
import { localeReducer } from '../locale-reducer';

describe('locale reducer', () => {
  it('correctly changes locale', () => {
    const action: ILocaleSelected = {
      type: 'LOCALE_SELECTED',
      locale: 'es',
    };
    expect(localeReducer(undefined, action).lang).toEqual('es');
  });
});
