import { shallow } from 'enzyme';
import React from 'react';
import { FormattedRelative } from 'react-intl';
import { eventNotification } from '../../../shared/util/test-data';
import TaskNotification from '../task-notification';

describe('Dashboard Task Notification Component', () => {
  const wrapper = shallow(<TaskNotification notification={eventNotification} />);

  it('renders container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders title of notification', () => {
    expect(wrapper.find('h5').text()).toBe(eventNotification.title);
  });

  it('renders formatted notification date', () => {
    expect(wrapper.find(FormattedRelative).length).toBe(1);
    expect(wrapper.find(FormattedRelative).props().value).toBe(eventNotification.createdAt);
  });
});
