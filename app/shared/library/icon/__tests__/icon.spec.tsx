import { shallow } from 'enzyme';
import * as React from 'react';
import EventIcon = require('react-icons/lib/md/event');
import Icon from '../icon';

describe('Library Icon Component', () => {
  it('returns an icon with the specified name', () => {
    const wrapper = shallow(<Icon name='event' />);

    expect(wrapper.find(EventIcon).length).toBe(1);
    expect(wrapper.find(EventIcon).props().className).toBe('icon');
  });

  it('returns an icon with custom styles applied', () => {
    const className = 'custom';
    const wrapper = shallow(<Icon name='event' className={className} />);

    expect(wrapper.find(EventIcon).props().className).toBe(`icon ${className}`);
  });
});
