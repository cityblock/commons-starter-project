import { shallow } from 'enzyme';
import * as React from 'react';
import TextDivider from '../../../shared/library/text-divider/text-divider';
import Calendar from '../calendar';

describe('Render Calendar List', () => {
  const startDatetime = new Date().toISOString();
  const fetchMore = () => {
    return true;
  };
  const calendarEvents = [
    {
      id: 'id0',
      title: 'First Appointment',
      startDatetime,
      htmlLink: 'www.fakeurl.com',
      status: 'confirmed',
    },
    {
      id: 'id1',
      title: 'Second Appointment',
      startDatetime,
      htmlLink: 'www.fakeurl.com',
      status: 'cancelled',
    },
  ];

  const wrapper = shallow(
    <Calendar calendarEvents={calendarEvents} loading={false} fetchMore={fetchMore} />,
  );

  it('renders the calendar list', () => {
    const events = wrapper.find('.eventContainer');
    expect(events).toHaveLength(2);

    const dividers = wrapper.find(TextDivider);
    expect(dividers).toHaveLength(1);
  });
});
