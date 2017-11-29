import { closeProgressNote, openProgressNote } from '../popup-action';

describe('popup action', () => {
  it('correctly changes popup state', () => {
    expect(closeProgressNote().type).toEqual('PROGRESS_NOTE_CLOSE');
  });
  it('correctly changes popup state', () => {
    expect(openProgressNote('patient-id').patientId).toEqual('patient-id');
  });
});
