import { shallow } from 'enzyme';
import * as React from 'react';
import { FullCareTeamUserFragment } from '../../../../graphql/types';
import {
  formatCareTeamMemberRole,
  formatFullName,
} from '../../../../shared/helpers/format-helpers';
import Avatar from '../../../../shared/library/avatar/avatar';
import HamburgerMenuOption from '../../../../shared/library/hamburger-menu-option/hamburger-menu-option';
import HamburgerMenu from '../../../../shared/library/hamburger-menu/hamburger-menu';
import SmallText from '../../../../shared/library/small-text/small-text';
import {
  nonLeadUserForCareTeam,
  patient,
  userForCareTeam,
} from '../../../../shared/util/test-data';
import { CareTeamMember } from '../care-team-member';

describe('Render CareTeamMember component', () => {
  const onClickToRemove = (careTeamMemberToREmove: FullCareTeamUserFragment) => true;
  const careTeamMakeTeamLead = jest.fn();

  const wrapper = shallow(
    <CareTeamMember
      careTeamMakeTeamLead={careTeamMakeTeamLead}
      patientId={patient.id}
      onClickToRemove={onClickToRemove}
      careTeamMember={userForCareTeam}
    />,
  );

  it('renders a care team member', () => {
    expect(wrapper.find(Avatar)).toHaveLength(1);
    expect(wrapper.find(HamburgerMenu)).toHaveLength(1);
    expect(
      wrapper
        .find(HamburgerMenuOption)
        .at(0)
        .props().messageId,
    ).toBe('patientTeam.removeFromTeam');
    expect(
      wrapper
        .find(SmallText)
        .at(0)
        .props().text,
    ).toBe(formatFullName(userForCareTeam.firstName, userForCareTeam.lastName));
    expect(
      wrapper
        .find(SmallText)
        .at(1)
        .props().text,
    ).toBe(formatCareTeamMemberRole(userForCareTeam.userRole));
  });

  it('renders the make team lead button and no badge when not the care team lead', () => {
    wrapper.setProps({ careTeamMember: nonLeadUserForCareTeam });
    expect(wrapper.find('.row.hiddenStar')).toHaveLength(1);
    expect(wrapper.find(Avatar)).toHaveLength(1);
    expect(wrapper.find(HamburgerMenu)).toHaveLength(1);
    expect(
      wrapper
        .find(HamburgerMenuOption)
        .at(0)
        .props().messageId,
    ).toBe('patientTeam.makeTeamLead');
    expect(
      wrapper
        .find(HamburgerMenuOption)
        .at(1)
        .props().messageId,
    ).toBe('patientTeam.removeFromTeam');
    expect(
      wrapper
        .find(SmallText)
        .at(0)
        .props().text,
    ).toBe(formatFullName(nonLeadUserForCareTeam.firstName, nonLeadUserForCareTeam.lastName));
    expect(
      wrapper
        .find(SmallText)
        .at(1)
        .props().text,
    ).toBe(formatCareTeamMemberRole(nonLeadUserForCareTeam.userRole));
  });

  it('renders the team lead badge when the user is the care team lead', () => {
    wrapper.setProps({ careTeamMember: userForCareTeam });
    expect(wrapper.find('.row.hiddenStar')).toHaveLength(0);
    expect(wrapper.find('.row')).toHaveLength(3);
  });
});
