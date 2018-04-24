import { shallow } from 'enzyme';
import * as React from 'react';
import Calendar from '../../../shared/calendar/calendar';
import { patient } from '../../../shared/util/test-data';
import { PatientCalendar } from '../patient-calendar';

describe('Render Skinny Patient Calendar', () => {
  const match = { params: { patientId: patient.id } };
  const response = {
    events: [
      {
        id: 'id0',
        title: 'First Appointment',
        startDatetime: new Date().toISOString(),
        htmlLink: 'www.fakeurl.com',
        status: 'confirmed',
      },
      {
        id: 'id1',
        title: 'Second Appointment',
        startDatetime: new Date().toISOString(),
        htmlLink: 'www.fakeurl.com',
        status: 'cancelled',
      },
    ],
    pageInfo: null,
  };
  const wrapper = shallow(
    <PatientCalendar
      match={match}
      calendarEventsResponse={response}
      isLoading={false}
      error={null}
    />,
  );

  it('renders the calendar list', () => {
    const events = wrapper.find(Calendar);
    expect(events).toHaveLength(1);
  });
});
