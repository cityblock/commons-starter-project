import { IPopupClose, IPopupOpen } from '../../actions/popup-action';
import { initialState, popupReducer } from '../popup-reducer/popup-reducer';

describe('popup reducer', () => {
  const patientId = 'mikeWheeler';

  it('correctly changes popup state on open', () => {
    const action: IPopupOpen = {
      type: 'POPUP_OPEN',
      popup: {
        name: 'PROGRESS_NOTE',
        options: {
          patientId,
        },
      },
    };
    expect(popupReducer(undefined, action).name).toBe('PROGRESS_NOTE');
    expect((popupReducer(undefined, action).options as any).patientId).toBe(patientId);
  });

  it('correctly changes popup state on close', () => {
    const action: IPopupClose = {
      type: 'POPUP_CLOSE',
    };
    expect(popupReducer({ name: 'PROGRESS_NOTE' } as any, action)).toEqual(initialState);
  });
});
