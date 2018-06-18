import { shallow } from 'enzyme';
import React from 'react';
import { clinic, patient, userForCareTeam } from '../../../../shared/util/test-data';
import CareTeamMember from '../care-team-member';
import { PatientCityblockCareTeam } from '../patient-cityblock-care-team';
import RemoveCareTeamMemberModal from '../remove-care-team-member-modal';
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
  isCareTeamLead: false,
};

describe('Render Patient Cityblock Care Team', () => {
  const onAddCareTeamMember = () => true;

  const wrapper = shallow(
    <PatientCityblockCareTeam
      patientId={patient.id}
      onAddCareTeamMember={onAddCareTeamMember}
      patientCareTeam={[userForCareTeam, user2]}
      loading={false}
      error={null}
    />,
  );

  it('renders patient care team members', () => {
    expect(wrapper.find(CareTeamMember)).toHaveLength(2);
  });

  it('renders required team member components', () => {
    expect(wrapper.find(RequiredTeamMember)).toHaveLength(2);
    expect(
      wrapper
        .find(RequiredTeamMember)
        .at(0)
        .props().requiredRoleType,
    ).toBe('communityHealthPartner');
    expect(
      wrapper
        .find(RequiredTeamMember)
        .at(1)
        .props().requiredRoleType,
    ).toBe('primaryCarePhysician');
  });

  it('renders the remove care team member modal', () => {
    expect(wrapper.find(RemoveCareTeamMemberModal)).toHaveLength(1);
  });
});
