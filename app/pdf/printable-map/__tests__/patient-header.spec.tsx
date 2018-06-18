import { Image, Text, View } from '@react-pdf/core';
import { shallow } from 'enzyme';
import React from 'react';
import { patient } from '../../../shared/util/test-data';
import HeaderText from '../../shared/header-text';
import copy from '../copy/copy';
import PatientHeader from '../patient-header';

describe('Printable MAP patient header', () => {
  const profilePhotoUrl = '/mother/of/dragons.com';

  const wrapper = shallow(<PatientHeader patient={patient} profilePhotoUrl={profilePhotoUrl} />);

  it('renders container views', () => {
    expect(wrapper.find(View).length).toBe(2);
  });

  it('renders image for patient', () => {
    expect(wrapper.find(Image).length).toBe(1);
    expect(wrapper.find<{ src: string }>(Image).props().src).toBe(profilePhotoUrl);
  });

  it('renders member header text', () => {
    expect(wrapper.find(HeaderText).props().label).toBe(copy.member);
  });

  it('renders text with patient name', () => {
    expect(wrapper.find(Text).text()).toBe('Bob Smith');
  });

  it('does not render image if no profile photo url', () => {
    wrapper.setProps({ profilePhotoUrl: null });

    expect(wrapper.find(Image).length).toBe(0);
  });
});
