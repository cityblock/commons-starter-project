import { View } from '@react-pdf/core';
import { shallow } from 'enzyme';
import React from 'react';
import { nonLeadUserForCareTeam, userForCareTeam } from '../../../shared/util/test-data';
import CareTeam from '../care-team';
import CareTeamMember from '../care-team-member';

describe('Printable MAP care team (right pane)', () => {
  const wrapper = shallow(<CareTeam careTeam={[nonLeadUserForCareTeam, userForCareTeam]} />);

  it('renders view container', () => {
    expect(wrapper.find(View).length).toBe(1);
  });

  it('renders care team members', () => {
    expect(wrapper.find(CareTeamMember)).toHaveLength(2);
    expect(
      wrapper
        .find(CareTeamMember)
        .at(0)
        .props().user,
    ).toBe(userForCareTeam);
    expect(
      wrapper
        .find(CareTeamMember)
        .at(1)
        .props().user,
    ).toBe(nonLeadUserForCareTeam);
  });
});
