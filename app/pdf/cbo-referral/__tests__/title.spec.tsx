import { Text, View } from '@react-pdf/core';
import { shallow } from 'enzyme';
import * as React from 'react';
import Divider from '../../shared/divider';
import copy from '../copy/copy';
import Title from '../title';

describe('CBO Referral PDF Title', () => {
  const CBOName = 'Arya Stark Food Pantry';

  const wrapper = shallow(<Title CBOName={CBOName} />);

  it('renders view containers', () => {
    expect(wrapper.find(View).length).toBe(3);
  });

  it('renders referral title text', () => {
    expect(wrapper.find(Text).length).toBe(2);
    expect(
      wrapper
        .find(Text)
        .at(0)
        .text(),
    ).toBe(copy.communityReferral);
  });

  it('renders CBO name', () => {
    expect(
      wrapper
        .find(Text)
        .at(1)
        .text(),
    ).toBe(CBOName);
  });

  it('renders divider', () => {
    expect(wrapper.find(Divider).length).toBe(1);
  });
});
