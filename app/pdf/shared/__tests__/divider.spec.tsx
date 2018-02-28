import { View } from '@react-pdf/core';
import { shallow } from 'enzyme';
import * as React from 'react';
import Divider from '../divider';

describe('CBO Referral PDF Divider', () => {
  const wrapper = shallow(<Divider />);

  it('renders divider', () => {
    expect(wrapper.find(View).length).toBe(1);
  });
});
