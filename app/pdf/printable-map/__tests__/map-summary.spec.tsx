import { View } from '@react-pdf/core';
import { shallow } from 'enzyme';
import * as React from 'react';
import { patientConcern } from '../../../shared/util/test-data';
import HeaderText from '../../shared/header-text';
import TextGroup from '../../shared/text-group';
import copy from '../copy/copy';
import MapSummary from '../map-summary';

describe('Printable MAP care plan summary component', () => {
  const wrapper = shallow(<MapSummary carePlan={[patientConcern]} />);

  it('renders container view', () => {
    expect(wrapper.find(View).length).toBe(1);
  });

  it('renders MAP summary header text', () => {
    expect(wrapper.find(HeaderText).props().label).toBe(copy.mapSummary);
  });

  it('renders text group for concerns, goals, and tasks', () => {
    expect(wrapper.find(TextGroup).length).toBe(3);
  });

  it('renders correct concern count', () => {
    expect(
      wrapper
        .find(TextGroup)
        .at(0)
        .props().label,
    ).toBe(copy.activeConcerns);
    expect(
      wrapper
        .find(TextGroup)
        .at(0)
        .props().value,
    ).toBe(1);
  });

  it('renders correct goal count', () => {
    expect(
      wrapper
        .find(TextGroup)
        .at(1)
        .props().label,
    ).toBe(copy.activeGoals);
    expect(
      wrapper
        .find(TextGroup)
        .at(1)
        .props().value,
    ).toBe(1);
  });

  it('renders correct task count', () => {
    expect(
      wrapper
        .find(TextGroup)
        .at(2)
        .props().label,
    ).toBe(copy.activeTasks);
    expect(
      wrapper
        .find(TextGroup)
        .at(2)
        .props().value,
    ).toBe(1);
  });
});
