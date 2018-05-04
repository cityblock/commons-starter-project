import { addMinutes } from 'date-fns';
import { shallow } from 'enzyme';
import * as React from 'react';
import Calendar from '../../../shared/calendar/calendar';
import {
  partialCalendarEvent,
  partialCalendarEventSIU,
  patient,
} from '../../../shared/util/test-data';
import { PatientCalendar } from '../patient-calendar';

describe('Render Skinny Patient Calendar', () => {
  const match = { params: { patientId: patient.id } };
  const startDatetime = new Date().toISOString();
  const endDatetime = addMinutes(startDatetime, 30).toISOString();
  const response = {
    events: [
      {
        startDate: startDatetime,
        startTime: startDatetime,
        endDate: endDatetime,
        endTime: endDatetime,
        ...partialCalendarEventSIU,
      },
      {
        startDate: startDatetime,
        startTime: null,
        endDate: endDatetime,
        endTime: null,
        ...partialCalendarEvent,
      },
    ],
    pageInfo: null,
  };
  const fetchMoreCalendarEvents = jest.fn() as any;
  const createCalendarForPatient = jest.fn() as any;
  const refetchCalendar = () => true;
  const wrapper = shallow(
    <PatientCalendar
      match={match}
      calendarEventsResponse={response}
      fetchMoreCalendarEvents={fetchMoreCalendarEvents}
      createCalendarForPatient={createCalendarForPatient}
      refetchCalendar={refetchCalendar}
      isLoading={false}
      error={null}
    />,
  );

  it('renders the calendar list', () => {
    const events = wrapper.find(Calendar);
    expect(events).toHaveLength(1);
  });
});
