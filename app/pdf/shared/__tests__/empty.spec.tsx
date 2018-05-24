import { Text, View } from '@react-pdf/core';
import { shallow } from 'enzyme';
import * as React from 'react';
import Empty from '../empty';

describe('Printable MAP Empty Care Plan Component', () => {
  const label = 'this is empty';
  const wrapper = shallow(<Empty label={label} />);

  it('renders view container', () => {
    expect(wrapper.find(View).length).toBe(1);
  });

  it('renders empty care plan text', () => {
    expect(wrapper.find(Text).text()).toBe(label);
  });
});
