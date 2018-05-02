import { addMinutes } from 'date-fns';
import { shallow } from 'enzyme';
import * as React from 'react';
import TextDivider from '../../../shared/library/text-divider/text-divider';
import { partialCalendarEvent, partialCalendarEventSIU } from '../../util/test-data';
import Calendar from '../calendar';
import CalendarEvent from '../calendar-event';

describe('Render Calendar List', () => {
  const startDatetime = new Date().toISOString();
  const endDatetime = addMinutes(startDatetime, 30).toISOString();
  const fetchMore = () => {
    return true;
  };
  const calendarEvents = [
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
  ];

  const wrapper = shallow(
    <Calendar calendarEvents={calendarEvents} loading={false} fetchMore={fetchMore} />,
  );

  it('renders the calendar list', () => {
    const events = wrapper.find(CalendarEvent);
    expect(events).toHaveLength(2);

    const dividers = wrapper.find(TextDivider);
    expect(dividers).toHaveLength(1);
  });
});
