import { Image, Text, View } from '@react-pdf/core';
import { shallow } from 'enzyme';
import * as React from 'react';
import { patient } from '../../../shared/util/test-data';
import HeaderText from '../../shared/header-text';
import copy from '../copy/copy';
import PatientHeader from '../patient-header';

describe('Printable MAP patient header', () => {
  const wrapper = shallow(<PatientHeader patient={patient} />);

  it('renders container views', () => {
    expect(wrapper.find(View).length).toBe(2);
  });

  it('renders image for patient', () => {
    expect(wrapper.find(Image).length).toBe(1);
  });

  it('renders member header text', () => {
    expect(wrapper.find(HeaderText).props().label).toBe(copy.member);
  });

  it('renders text with patient name', () => {
    expect(wrapper.find(Text).text()).toBe('Bob Smith');
  });
});
