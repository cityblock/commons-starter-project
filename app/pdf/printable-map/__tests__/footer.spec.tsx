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
    expect(wrapper.find(Text).text()).toBe(`${copy.mapAbbrev} Bob Smith`);
  });
});
