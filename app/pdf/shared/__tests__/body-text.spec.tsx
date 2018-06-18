import { Text } from '@react-pdf/core';
import { shallow } from 'enzyme';
import React from 'react';
import BodyText from '../body-text';

describe('CBO Referral PDF Body Text', () => {
  const label = 'Beyond the Wall';

  const wrapper = shallow(<BodyText label={label} />);

  it('renders text', () => {
    expect(wrapper.find(Text).length).toBe(1);
    expect(wrapper.find(Text).text()).toBe(label);
  });
});
