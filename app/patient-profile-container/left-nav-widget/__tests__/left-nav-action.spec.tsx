import { shallow } from 'enzyme';
import React from 'react';
import Icon from '../../../shared/library/icon/icon';
import LeftNavAction from '../left-nav-action';

describe('Patient Left Navigation Action Button', () => {
  const wrapper = shallow(<LeftNavAction action="scratchPad" onClick={jest.fn()} />);

  it('renders button', () => {
    expect(wrapper.find('button').props().className).toBe('button');
  });

  it('renders appropriate icon', () => {
    expect(wrapper.find(Icon).props().name).toBe('contentPaste');
    expect(wrapper.find(Icon).props().color).toBe('white');
    expect(wrapper.find(Icon).props().className).toBe('icon');
  });
});
