import { selectedLocale } from '../locale-action';

describe('locale action', () => {
  it('correctly changes locale', () => {

    expect(selectedLocale('en').locale).toEqual('en');
  });
});
