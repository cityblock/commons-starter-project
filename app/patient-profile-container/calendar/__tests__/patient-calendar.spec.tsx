import { shallow } from 'enzyme';
import * as React from 'react';
import TextDivider from '../../../shared/library/text-divider/text-divider';
import { patient } from '../../../shared/util/test-data';
import { PatientCalendar } from '../patient-calendar';

describe('Render Skinny Patient Calendar', () => {
  const match = { params: { patientId: patient.id } };
  const response = {
    events: [
      { id: 'id0', title: 'First Appointment', startDatetime: new Date().toISOString() },
      { id: 'id1', title: 'Second Appointment', startDatetime: new Date().toISOString() },
    ],
    pageInfo: null,
  };
  const wrapper = shallow(<PatientCalendar match={match} calendarEventsResponse={response} />);

  it('renders the calendar list', () => {
    const events = wrapper.find('.eventContainer');
    expect(events).toHaveLength(2);

    const dividers = wrapper.find(TextDivider);
    expect(dividers).toHaveLength(1);
  });
});
