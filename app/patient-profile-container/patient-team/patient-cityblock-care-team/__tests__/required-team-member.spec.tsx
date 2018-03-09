import { shallow } from 'enzyme';
import * as React from 'react';
import SmallText from '../../../../shared/library/small-text/small-text';
import { clinic, user } from '../../../../shared/util/test-data';
import RequiredTeamMember from '../required-team-member';

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

describe('Render Required Team Member Component', () => {
  const onClick = () => true;

  const wrapper = shallow(
    <RequiredTeamMember
      isLoading={false}
      requiredRoleType="communityHealthPartner"
      onClick={onClick}
    />,
  );

  it('renders the component when the required team member is missing', () => {
    wrapper.setProps({ patientCareTeam: [user] });
    expect(wrapper.isEmptyRender()).toBe(false);
    expect(wrapper.find(SmallText)).toHaveLength(2);
    expect(
      wrapper
        .find(SmallText)
        .at(0)
        .props().messageId,
    ).toBe('patientTeam.missingChpHeader');
  });

  it('renders null when the required team member is not missing', () => {
    wrapper.setProps({ patientCareTeam: [user, user2] });
    expect(wrapper.isEmptyRender()).toBe(true);
  });
});
