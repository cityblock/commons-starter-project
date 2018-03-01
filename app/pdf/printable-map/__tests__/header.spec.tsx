import { Image, Text, View } from '@react-pdf/core';
import { shallow } from 'enzyme';
import * as React from 'react';
import BodyText from '../../shared/body-text';
import HeaderText from '../../shared/header-text';
import copy from '../copy/copy';
import Header, { LOGO_PATH } from '../header';

describe('Printable MAP Header', () => {
  const oldDate = Date.now;
  Date.now = () => 1519836435207;

  const wrapper = shallow(<Header />);

  it('renders view containers', () => {
    expect(wrapper.find(View).length).toBe(4);
  });

  it('renders Cityblock logo image', () => {
    expect(wrapper.find(Image).length).toBe(1);
    expect(wrapper.find<{ src: string }>(Image).props().src).toBe(LOGO_PATH);
  });

  it('renders text for page title', () => {
    expect(wrapper.find(Text).length).toBe(1);
    expect(wrapper.find(Text).text()).toBe(copy.map);
  });

  it('renders printed on header', () => {
    expect(wrapper.find(HeaderText).length).toBe(1);
    expect(wrapper.find(HeaderText).props().label).toBe(copy.printedOn);
  });

  it('renders printedOn on date', () => {
    expect(wrapper.find(BodyText).length).toBe(1);
    expect(wrapper.find(BodyText).props().label).toBe('Feb 28, 2018');
  });

  Date.now = oldDate;
});
