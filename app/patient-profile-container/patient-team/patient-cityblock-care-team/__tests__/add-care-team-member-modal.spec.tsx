import { shallow } from 'enzyme';
import * as React from 'react';
import { UserRole } from '../../../../graphql/types';
import { formatFullName } from '../../../../shared/helpers/format-helpers';
import ModalHeader from '../../../../shared/library/modal-header/modal-header';
import Option from '../../../../shared/library/option/option';
import { clinic, patient, user, userForCareTeam } from '../../../../shared/util/test-data';
import { AddCareTeamMemberModal } from '../add-care-team-member-modal';

const userForSummary = { patientCount: 1, ...user };

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
  patientCount: 2,
  isCareTeamLead: false,
};

describe('Render Care Team Member Modal', () => {
  const closePopup = () => true;
  const addUser = jest.fn();

  const wrapper = shallow(
    <AddCareTeamMemberModal
      isVisible={false}
      closePopup={closePopup}
      patientId={patient.id}
      addUserToPatientCareTeamMutation={addUser}
      patientCareTeam={[userForCareTeam]}
      userSummaryList={[userForSummary, user2]}
    />,
  );

  it('renders the correct care team member options', () => {
    const userRoleCount = Object.keys(UserRole).length;
    // There is an empty option for all userRoles without users in them. Add 1 for placeholder
    expect(wrapper.find(Option)).toHaveLength(userRoleCount + 1);
    expect(
      wrapper
        .find(Option)
        .at(0)
        .props().disabled,
    ).toBe(true);
    expect(
      wrapper
        .find(ModalHeader)
        .at(0)
        .props().titleMessageId,
    ).toBe('patientTeam.addCareTeamMemberModalHeader');
  });

  it('renders the success body after saving', () => {
    wrapper.setState({ addUserSuccess: true, addedCareMember: user2 });
    expect(
      wrapper
        .find(ModalHeader)
        .at(0)
        .props().titleText,
    ).toBe(`${formatFullName(user2.firstName, user2.lastName)} was successfully added`);
  });
});
