import { IProgressNoteClose, IProgressNoteOpen } from '../../actions/popup-action';
import { popupReducer } from '../popup-reducer';

describe('popup reducer', () => {
  it('correctly changes popup state on open', () => {
    const action: IProgressNoteOpen = {
      type: 'PROGRESS_NOTE_OPEN',
      patientId: 'patient-id',
    };
    expect(popupReducer(undefined, action).progressNoteOpen).toBeTruthy();
    expect(popupReducer(undefined, action).patientId).toEqual('patient-id');
  });

  it('correctly changes popup state on close', () => {
    const action: IProgressNoteClose = {
      type: 'PROGRESS_NOTE_CLOSE',
    };
    expect(popupReducer(undefined, action).progressNoteOpen).toBeFalsy();
  });
});
