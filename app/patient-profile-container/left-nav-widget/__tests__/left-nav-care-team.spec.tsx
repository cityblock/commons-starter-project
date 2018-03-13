import { shallow } from 'enzyme';
import * as React from 'react';
import Spinner from '../../../shared/library/spinner/spinner';
import { currentUser, user } from '../../../shared/util/test-data';
import CareTeamMember from '../care-team-member';
import { LeftNavCareTeam } from '../left-nav-care-team';

describe('Patient Left Navigation Care Team View', () => {
  const wrapper = shallow(
    <LeftNavCareTeam patientId="sansaStark" careTeam={[user, currentUser]} />,
  );

  it('renders container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders care team member component for each user on care team', () => {
    expect(wrapper.find(CareTeamMember).length).toBe(2);

    expect(
      wrapper
        .find(CareTeamMember)
        .at(0)
        .props().careTeamMember,
    ).toEqual(user);
    expect(
      wrapper
        .find(CareTeamMember)
        .at(0)
        .props().isSelected,
    ).toBeFalsy();
    expect(
      wrapper
        .find(CareTeamMember)
        .at(0)
        .props().isLead,
    ).toBeTruthy();

    expect(
      wrapper
        .find(CareTeamMember)
        .at(1)
        .props().careTeamMember,
    ).toEqual(currentUser);
    expect(
      wrapper
        .find(CareTeamMember)
        .at(1)
        .props().isSelected,
    ).toBeFalsy();
    expect(
      wrapper
        .find(CareTeamMember)
        .at(1)
        .props().isLead,
    ).toBeFalsy();
  });

  it('selects a care team member', () => {
    wrapper.setState({ selectedCareTeamMemberId: currentUser.id });

    expect(
      wrapper
        .find(CareTeamMember)
        .at(0)
        .props().isSelected,
    ).toBeFalsy();
    expect(
      wrapper
        .find(CareTeamMember)
        .at(1)
        .props().isSelected,
    ).toBeTruthy();
  });

  it('renders spinner if loading', () => {
    wrapper.setProps({ loading: true });

    expect(wrapper.find(Spinner).length).toBe(1);
    expect(wrapper.find(CareTeamMember).length).toBe(0);
  });
});
