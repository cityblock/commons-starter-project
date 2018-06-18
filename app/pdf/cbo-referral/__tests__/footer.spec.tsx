import { Text } from '@react-pdf/core';
import { shallow } from 'enzyme';
import React from 'react';
import copy from '../copy/copy';
import Footer from '../footer';

describe('CBO Referral PDF Footer', () => {
  const wrapper = shallow(<Footer />);

  it('renders footer text', () => {
    expect(wrapper.find(Text).length).toBe(1);
    expect(wrapper.find(Text).text()).toBe(copy.cityblockInfo);
  });
});
