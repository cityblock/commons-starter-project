import { Text } from '@react-pdf/core';
import { shallow } from 'enzyme';
import React from 'react';
import HeaderText from '../header-text';

describe('CBO Referral PDF Header Text', () => {
  const label = 'Beyond the Wall';

  const wrapper = shallow(<HeaderText label={label} />);

  it('renders text', () => {
    expect(wrapper.find(Text).length).toBe(1);
    expect(wrapper.find(Text).text()).toBe(label);
  });
});
