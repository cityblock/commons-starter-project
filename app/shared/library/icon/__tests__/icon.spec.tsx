import EventIcon from '@material-ui/icons/Event';
import { shallow } from 'enzyme';
import * as React from 'react';
import Icon from '../icon';

describe('Library Icon Component', () => {
  it('returns an icon with the specified name', () => {
    const wrapper = shallow(<Icon name="event" />);

    expect(wrapper.find(EventIcon).length).toBe(1);
    expect(wrapper.find(EventIcon).props().className).toBe('icon');
    expect(wrapper.find(EventIcon).props().onClick).toBeFalsy();
  });

  it('returns an icon with custom styles applied', () => {
    const className = 'custom';
    const wrapper = shallow(<Icon name="event" className={className} />);

    expect(wrapper.find(EventIcon).props().className).toBe(`icon ${className}`);
  });

  it('returns an icon with click handler when given', () => {
    const onClick = () => true as any;
    const wrapper = shallow(<Icon name="event" onClick={onClick} />);

    expect(wrapper.find(EventIcon).props().onClick).toBe(onClick);
  });
});
