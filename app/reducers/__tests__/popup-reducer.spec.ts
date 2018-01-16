import { IPopupClose, IPopupOpen } from '../../actions/popup-action';
import { initialState, popupReducer } from '../popup-reducer';

describe('popup reducer', () => {
  const progressNoteId = 'mikeWheeler';

  it('correctly changes popup state on open', () => {
    const action: IPopupOpen = {
      type: 'POPUP_OPEN',
      popup: {
        name: 'PROGRESS_NOTE',
        options: {
          progressNoteId,
        },
      },
    };
    expect(popupReducer(undefined, action).name).toBe('PROGRESS_NOTE');
    expect((popupReducer(undefined, action).options as any).progressNoteId).toBe(progressNoteId);
  });

  it('correctly changes popup state on close', () => {
    const action: IPopupClose = {
      type: 'POPUP_CLOSE',
    };
    expect(popupReducer({ name: 'PROGRESS_NOTE' } as any, action)).toEqual(initialState);
  });
});
