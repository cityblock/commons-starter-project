import { shallow } from 'enzyme';
import * as React from 'react';
import { formatFullName } from '../../../../shared/helpers/format-helpers';
import SmallText from '../../../../shared/library/small-text/small-text';
import { clinic, user } from '../../../../shared/util/test-data';
import RemoveCareTeamMember from '../remove-care-team-member';

const user2 = {
  id: 'user2id',
  locale: 'en',
  phone: '(212) 555-2828',
  firstName: 'user',
  lastName: 'two',
  userRole: 'communityHealthPartner' as any,
  email: 'c@d.com',
  homeClinicId: clinic.id,
  googleProfileImageUrl: null,
  createdAt: '2017-09-07T13:45:14.532Z',
  updatedAt: '2017-09-07T13:45:14.532Z',
  permissions: 'blue' as any,
};

describe('Render Remove Care Team Member Component', () => {
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => true;

  const wrapper = shallow(
    <RemoveCareTeamMember
      onChange={onChange}
      tasksCount={0}
      isLoading={false}
      careTeamMember={user}
      careTeam={[user, user2]}
    />,
  );

  it('renders info about the user being removed from the care team', () => {
    expect(
      wrapper
        .find(SmallText)
        .at(0)
        .props().messageId,
    ).toBe('patientTeam.careMemberToRemoveLabel');
    expect(
      wrapper
        .find(SmallText)
        .at(1)
        .props().text,
    ).toBe(formatFullName(user.firstName, user.lastName));
    expect(
      wrapper
        .find(SmallText)
        .at(2)
        .props().messageId,
    ).toBe(`patientTeam.${user.userRole}`);
  });

  it('renders task stats and the care team select when tasks need to be reassigned', () => {
    wrapper.setProps({ tasksCount: 1 });
    expect(wrapper.find('.careTeamMemberReassignmentSection').hasClass('hidden')).toBe(false);
    expect(wrapper.find('.careTeamMemberStats').hasClass('hidden')).toBe(false);
  });

  it('does not render the task stats or care team select when tasks do not need to be reassigned', () => {
    wrapper.setProps({ tasksCount: 0 });
    expect(wrapper.find('.careTeamMemberReassignmentSection').hasClass('hidden')).toBe(true);
    expect(wrapper.find('.careTeamMemberStats').hasClass('hidden')).toBe(true);
  });
});
