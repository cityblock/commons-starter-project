import { addMinutes } from 'date-fns';
import { shallow } from 'enzyme';
import React from 'react';
import Calendar from '../../../shared/calendar/calendar';
import Button from '../../../shared/library/button/button';
import {
  partialCalendarEvent,
  partialCalendarEventSIU,
  patient,
} from '../../../shared/util/test-data';
import { PatientCalendar } from '../patient-calendar';

describe('Render Patient Calendar', () => {
  const match = { params: { patientId: patient.id } };
  const startDatetime = new Date().toISOString();
  const endDatetime = addMinutes(startDatetime, 30).toISOString();
  const eventsResponse = {
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
      calendarEventsResponse={eventsResponse}
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

  it('renders the calendar nav bar buttons', () => {
    const buttons = wrapper.find(Button);
    expect(buttons).toHaveLength(0);

    wrapper.setProps({
      calendarResponse: {
        googleCalendarId: 'some-id',
        googleCalendarUrl: 'www.someurl.com',
        isCurrentUserPermissioned: true,
      },
    });

    const updatedButtons = wrapper.find(Button);
    expect(updatedButtons).toHaveLength(3);

    expect(updatedButtons.at(0).props().messageId).toBe('calendar.print');
    expect(updatedButtons.at(1).props().messageId).toBe('calendar.openCalendar');
    expect(updatedButtons.at(2).props().messageId).toBe('calendar.addAppointment');
  });
});
