import { shallow } from 'enzyme';
import * as React from 'react';
import Icon from '../../../library/icon/icon';
import SuggestedTask from '../suggested-task';

describe('Suggested Task Component in Create Goal Modal', () => {
  const title = 'Stranger Things 2';
  const onClick = () => true as any;

  const wrapper = shallow(<SuggestedTask title={title} onClick={onClick} />);

  it('renders basic suggested task', () => {
    expect(wrapper.find('.container').length).toBe(1);
    expect(wrapper.find('p').length).toBe(1);
    expect(wrapper.find('p').text()).toBe(title);
    expect(wrapper.find(Icon).length).toBe(1);
    expect(wrapper.find(Icon).props().name).toBe('highlightOff');
    expect(wrapper.find(Icon).props().className).toBe('icon');
  });

  it('applies styles if rejected', () => {
    wrapper.setProps({ isRejected: true });
    expect(wrapper.find('div').props().className).toBe('container rejected');
  });

  it('changes icon if rejected', () => {
    expect(wrapper.find(Icon).props().name).toBe('addCircle');
  });

  it('applies custom styles', () => {
    const className = 'mikeWheeler';
    wrapper.setProps({ className, isRejected: false });
    expect(wrapper.find('div').props().className).toBe(`container ${className}`);
  });
});
