import { selectLocale } from '../locale-action';

describe('locale action', () => {
  it('correctly changes locale', () => {

    expect(selectLocale('en').locale).toEqual('en');
  });
});
