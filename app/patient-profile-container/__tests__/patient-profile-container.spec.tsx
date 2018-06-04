import { shallow } from 'enzyme';
import * as React from 'react';
import ProgressNotePopupContainer from '../../progress-note-container/progress-note-popup-container';
import { PatientProfileContainer as Component, SelectableTabs } from '../patient-profile-container';

const oldDate = Date.now;
const match = {
  params: {
    patientId: 'patient-1',
    tabId: 'map' as SelectableTabs,
  },
};

describe('patient profile container', () => {
  beforeAll(() => {
    Date.now = jest.fn(() => 1500494779252);
  });
  afterAll(() => {
    Date.now = oldDate;
  });
  it('renders patient profile container', async () => {
    const wrapper = shallow(
      <Component
        match={match}
        patientId={'patient-1'}
        tab={'map' as any}
        loading={false}
        glassBreakId={null}
      />,
    );
    const progressNotePopup = wrapper.find(ProgressNotePopupContainer);
    expect(progressNotePopup).toHaveLength(1);
    expect(progressNotePopup.props().patientId).toEqual('patient-1');
  });
});
