import { Text, View } from '@react-pdf/core';
import { shallow } from 'enzyme';
import * as React from 'react';
import { patient } from '../../../shared/util/test-data';
import copy from '../copy/copy';
import Footer from '../footer';

const oldDate = Date.now;

describe('Printable MAP footer component', () => {
  beforeAll(() => {
    Date.now = jest.fn(() => 1500494779252);
  });
  afterAll(() => {
    Date.now = oldDate;
  });

  it('renders view container', () => {
    const wrapper = shallow(<Footer patient={patient} />);
    expect(wrapper.find(View).length).toBe(1);
  });

  it('renders text with correct copy', () => {
    const wrapper = shallow(<Footer patient={patient} />);
    const expected = `${copy.mapAbbrev} Bob Smith  |  ${copy.printedOn} Jul 19, 2017`;
    expect(wrapper.find(Text).text()).toBe(expected);
  });
});
