import { Text, View } from '@react-pdf/core';
import { shallow } from 'enzyme';
import * as React from 'react';
import { patientConcern } from '../../../shared/util/test-data';
import Concern from '../concern';
import copy from '../copy/copy';

describe('Printable MAP Concern Component', () => {
  const wrapper = shallow(<Concern patientConcern={patientConcern} index={0} />);

  it('renders view container', () => {
    expect(wrapper.find(View).length).toBe(1);
  });

  it('renders concern label with correct number', () => {
    expect(wrapper.find(Text).length).toBe(2);

    expect(
      wrapper
        .find(Text)
        .at(0)
        .text(),
    ).toBe(`${copy.concern} 1`);
  });

  it('renders concern title', () => {
    expect(
      wrapper
        .find(Text)
        .at(1)
        .text(),
    ).toBe(patientConcern.concern.title);
  });
});
