import { shallow } from 'enzyme';
import * as React from 'react';
import { AddProgressNote } from '../add-progress-note';
import LeftNavQuickAction from '../left-nav-quick-action';

describe('Patient Left Navigation Quick Action: Add Progress Note', () => {
  const placeholderFn = jest.fn();
  const patientId = 'aryaStark';

  const wrapper = shallow(
    <AddProgressNote
      patientId={patientId}
      openProgressNotePopup={placeholderFn}
      progressNoteCreate={placeholderFn}
      onClose={placeholderFn}
    />,
  );

  it('renders a left nav quick action to open progress note', () => {
    expect(wrapper.find(LeftNavQuickAction).props().quickAction).toBe('addProgressNote');
  });
});
