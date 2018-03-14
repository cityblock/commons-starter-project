import { View } from '@react-pdf/core';
import { shallow } from 'enzyme';
import * as React from 'react';
import { userForCareTeam } from '../../../shared/util/test-data';
import HeaderText from '../../shared/header-text';
import CareTeamList from '../care-team-list';
import copy from '../copy/copy';
import TextGroup from '../text-group';

describe('Printable MAP Care Team List', () => {
  const wrapper = shallow(<CareTeamList careTeam={[userForCareTeam]} />);

  it('renders container view', () => {
    expect(wrapper.find(View).length).toBe(1);
  });

  it('renders care team label text', () => {
    expect(wrapper.find(HeaderText).props().label).toBe(copy.careTeam);
  });

  it('renders text group for each care team member', () => {
    expect(wrapper.find(TextGroup).length).toBe(1);
    expect(wrapper.find(TextGroup).props().label).toBe('first last');
    expect(wrapper.find(TextGroup).props().value).toBe('Physician');
    expect(wrapper.find(TextGroup).props().valueColor).toBe('gray');
    expect(wrapper.find(TextGroup).props().fullWidth).toBeTruthy();
    expect(wrapper.find(TextGroup).props().starImage).toBeTruthy();
  });
});
