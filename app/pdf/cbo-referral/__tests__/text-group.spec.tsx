import { View } from '@react-pdf/core';
import { shallow } from 'enzyme';
import React from 'react';
import BodyText from '../../shared/body-text';
import HeaderText from '../../shared/header-text';
import TextGroup from '../text-group';

describe('CBO Referral PDF Text Group', () => {
  const headerLabel = 'Queen of the Seven Kingdoms';
  const bodyLabel = 'Cersei Lannister';

  const wrapper = shallow(<TextGroup headerLabel={headerLabel} bodyLabel={bodyLabel} />);

  it('renders view container', () => {
    expect(wrapper.find(View).length).toBe(1);
  });

  it('renders header text', () => {
    expect(wrapper.find(HeaderText).length).toBe(1);
    expect(wrapper.find(HeaderText).props().label).toBe(headerLabel);
  });

  it('renders body text', () => {
    expect(wrapper.find(BodyText).length).toBe(1);
    expect(wrapper.find(BodyText).props().label).toBe(bodyLabel);
  });
});
