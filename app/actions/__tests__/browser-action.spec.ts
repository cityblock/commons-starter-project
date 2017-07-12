import { changeBrowser } from '../browser-action';

describe('browser action', () => {
  it('correctly changes browser size', () => {
    expect(changeBrowser(true).mediaQueryMatch).toEqual(true);
  });
});
