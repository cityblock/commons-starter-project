import { Text, View } from '@react-pdf/core';
import { shallow } from 'enzyme';
import React from 'react';
import { patientConcern } from '../../../shared/util/test-data';
import copy from '../copy/copy';
import Goal from '../goal';

describe('Printable MAP Concern Component', () => {
  const wrapper = shallow(<Goal patientGoal={patientConcern.patientGoals[0]} />);

  it('renders view container', () => {
    expect(wrapper.find(View).length).toBe(1);
  });

  it('renders text with name of goal', () => {
    expect(wrapper.find(Text).text()).toBe(`${copy.goal} ${patientConcern.patientGoals[0].title}`);
  });
});
