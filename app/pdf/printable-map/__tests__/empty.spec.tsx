import { Text, View } from '@react-pdf/core';
import { shallow } from 'enzyme';
import * as React from 'react';
import copy from '../copy/copy';
import Empty from '../empty';

describe('Printable MAP Empty Care Plan Component', () => {
  const wrapper = shallow(<Empty />);

  it('renders view container', () => {
    expect(wrapper.find(View).length).toBe(1);
  });

  it('renders empty care plan text', () => {
    expect(wrapper.find(Text).text()).toBe(copy.noCarePlan);
  });
});
