import { shallow } from 'enzyme';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import TaskCountItem from '../task-count-item';

describe('Dashboard Task Count item', () => {
  const messageId = 'kingInTheNorth';

  const wrapper = shallow(<TaskCountItem count={null} messageId={messageId} />);

  it('renders container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders label for the item', () => {
    expect(wrapper.find(FormattedMessage).length).toBe(2);
    expect(
      wrapper
        .find(FormattedMessage)
        .at(0)
        .props().id,
    ).toBe(messageId);
  });

  it('renders loading message if loading', () => {
    expect(
      wrapper
        .find(FormattedMessage)
        .at(1)
        .props().id,
    ).toBe('dashboard.countLoading');
  });

  it('renders count if not loading', () => {
    const count = 11;
    wrapper.setProps({ count });

    expect(wrapper.find(FormattedMessage).length).toBe(1);
    expect(wrapper.find('p').text()).toBe(`${count}`);
  });
});
