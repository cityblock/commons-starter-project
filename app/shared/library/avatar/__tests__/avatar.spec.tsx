import { shallow } from 'enzyme';
import * as React from 'react';
import Avatar, { DEFAULT_AVATAR_URL } from '../avatar';

describe('Library Avatar Component', () => {
  const wrapper = shallow(<Avatar />);

  it('renders image with default avatar URL if no src given', () => {
    expect(wrapper.find('img').length).toBe(1);
    expect(wrapper.find('img').props().src).toBe(DEFAULT_AVATAR_URL);
  });

  it('applies default avatar styles', () => {
    expect(wrapper.find('img').props().className).toBe('avatar');
  });

  it('applies styles for different size if specified', () => {
    wrapper.setProps({ size: 'large' });
    expect(wrapper.find('img').props().className).toBe('avatar large');
  });

  it('applies styles for different size if specified', () => {
    wrapper.setProps({ size: '', borderColor: 'white' });
    expect(wrapper.find('img').props().className).toBe('avatar whiteBorder');
  });

  it('applies custom styles if specified', () => {
    const className = 'custom';
    wrapper.setProps({ borderColor: '', className });

    expect(wrapper.find('img').props().className).toBe(`avatar ${className}`);
  });
});
