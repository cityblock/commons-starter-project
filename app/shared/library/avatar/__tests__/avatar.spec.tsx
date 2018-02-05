import { shallow } from 'enzyme';
import * as React from 'react';
import Icon from '../../icon/icon';
import Avatar from '../avatar';

describe('Library Avatar Component', () => {
  const wrapper = shallow(<Avatar />);

  it('renders image with default avatar URL if no src given', () => {
    expect(wrapper.find(Icon).length).toBe(1);
    expect(wrapper.find(Icon).props().name).toBe('accountCircle');
  });

  it('applies default avatar styles', () => {
    expect(wrapper.find(Icon).props().className).toBe('avatar');
  });

  it('applies styles for different size if specified', () => {
    wrapper.setProps({ size: 'large' });
    expect(wrapper.find(Icon).props().className).toBe('avatar large');
  });

  it('applies styles for different size if specified', () => {
    wrapper.setProps({ size: '', borderColor: 'white' });
    expect(wrapper.find(Icon).props().className).toBe('avatar whiteBorder');
  });

  it('applies custom styles if specified', () => {
    const className = 'custom';
    wrapper.setProps({ borderColor: '', className });

    expect(wrapper.find(Icon).props().className).toBe(`avatar ${className}`);
  });

  it('renders an imag tag if src is passed in ', () => {
    const className = 'custom';
    wrapper.setProps({
      borderColor: '',
      className,
      src: 'https://www.got-ending-spoilers.com/finaly.jpg',
    });

    expect(wrapper.find('img').props().className).toBe(`avatar ${className}`);
  });
});
