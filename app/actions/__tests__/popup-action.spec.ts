import { closePopup, openPopup } from '../popup-action';

describe('popup action', () => {
  const progressNoteId = 'janeIves';

  it('correctly changes popup state', () => {
    expect(closePopup().type).toBe('POPUP_CLOSE');
  });
  it('correctly changes popup state', () => {
    const openAction = openPopup({
      name: 'PROGRESS_NOTE',
      options: {
        progressNoteId,
      },
    });

    expect(openAction.type).toBe('POPUP_OPEN');
    expect(openAction.popup.name).toBe('PROGRESS_NOTE');
    expect((openAction.popup.options as any).progressNoteId).toBe(progressNoteId);
  });
});
