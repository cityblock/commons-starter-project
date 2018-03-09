import { shallow } from 'enzyme';
import * as React from 'react';
import { FullUserFragment } from '../../../../graphql/types';
import {
  formatCareTeamMemberRole,
  formatFullName,
} from '../../../../shared/helpers/format-helpers';
import Avatar from '../../../../shared/library/avatar/avatar';
import HamburgerMenuOption from '../../../../shared/library/hamburger-menu-option/hamburger-menu-option';
import HamburgerMenu from '../../../../shared/library/hamburger-menu/hamburger-menu';
import SmallText from '../../../../shared/library/small-text/small-text';
import { user } from '../../../../shared/util/test-data';
import CareTeamMember from '../care-team-member';

describe('Render CareTeamMember component', () => {
  const onClickToRemove = (careTeamMemberToREmove: FullUserFragment) => true;

  const wrapper = shallow(
    <CareTeamMember onClickToRemove={onClickToRemove} careTeamMember={user} />,
  );

  it('renders a care team member', () => {
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
    ).toBe(formatFullName(user.firstName, user.lastName));
    expect(
      wrapper
        .find(SmallText)
        .at(1)
        .props().text,
    ).toBe(formatCareTeamMemberRole(user.userRole));
  });
});
