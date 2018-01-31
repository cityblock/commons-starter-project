import { Image, View } from '@react-pdf/core';
import { format } from 'date-fns';
import { shallow } from 'enzyme';
import * as React from 'react';
import BodyText from '../body-text';
import copy from '../copy/copy';
import Header, { LOGO_PATH } from '../header';
import HeaderText from '../header-text';

describe('CBO Referral PDF Header', () => {
  const referredOn = '2017-11-07T13:45:14.532Z';

  const wrapper = shallow(<Header referredOn={referredOn} />);

  it('renders view containers', () => {
    expect(wrapper.find(View).length).toBe(2);
  });

  it('renders Cityblock logo image', () => {
    expect(wrapper.find(Image).length).toBe(1);
    expect(wrapper.find<{ src: string; }>(Image).props().src).toBe(LOGO_PATH);
  });

  it('renders referred on header', () => {
    expect(wrapper.find(HeaderText).length).toBe(1);
    expect(wrapper.find(HeaderText).props().label).toBe(copy.referredOn);
  });

  it('renders referred on date', () => {
    expect(wrapper.find(BodyText).length).toBe(1);
    expect(wrapper.find(BodyText).props().label).toBe(format(referredOn, 'MMM DD, YYYY'));
    expect(wrapper.find(BodyText).props().noMargin).toBeTruthy();
  });
});
