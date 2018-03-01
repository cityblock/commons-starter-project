import { Text, View } from '@react-pdf/core';
import { shallow } from 'enzyme';
import * as React from 'react';
import { patient } from '../../../shared/util/test-data';
import copy from '../copy/copy';
import Footer from '../footer';

describe('Printable MAP footer component', () => {
  const wrapper = shallow(<Footer patient={patient} />);

  it('renders view container', () => {
    expect(wrapper.find(View).length).toBe(1);
  });

  it('renders text with correct copy', () => {
    const oldDateFn = Date.now;
    Date.now = () => 1519940493877;

    const expected = `${copy.mapAbbrev} Bob Smith  |  ${copy.printedOn} Mar 1, 2018`;
    expect(wrapper.find(Text).text()).toBe(expected);

    Date.now = oldDateFn;
  });
});
