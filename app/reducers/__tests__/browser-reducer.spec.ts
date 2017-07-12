import { IBrowserChanged } from '../../actions/browser-action';
import { browserReducer } from '../browser-reducer';

describe('browser reducer', () => {
  it('correctly changes browser size', () => {
    const action: IBrowserChanged = {
      type: 'BROWSER_CHANGED',
      mediaQueryMatch: true,
    };
    expect(browserReducer(undefined, action).size).toEqual('small');
  });
});
