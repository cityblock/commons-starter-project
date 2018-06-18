import { shallow } from 'enzyme';
import React from 'react';
import Modal from '../../../../shared/library/modal/modal';
import { patient, task, userForCareTeam } from '../../../../shared/util/test-data';
import RemoveCareTeamMember from '../remove-care-team-member';
import { RemoveCareTeamMemberModal } from '../remove-care-team-member-modal';

describe('Render Remove Care Team Member Modal Component', () => {
  const closePopup = () => true;
  const careTeamReassignUser = jest.fn();

  const wrapper = shallow(
    <RemoveCareTeamMemberModal
      closePopup={closePopup}
      isVisible={true}
      patientId={patient.id}
      careTeamMember={userForCareTeam}
      careTeam={[userForCareTeam]}
      careTeamMemberTasks={[task]}
      careTeamReassignUser={careTeamReassignUser}
    />,
  );

  it('renders the remove care team member component in a modal', () => {
    expect(wrapper.find(Modal)).toHaveLength(1);
    expect(wrapper.find(RemoveCareTeamMember)).toHaveLength(1);
  });

  it('renders the correct modal title and submit button when there are tasks to reassign', () => {
    expect(
      wrapper
        .find(Modal)
        .at(0)
        .props().subTitleMessageId,
    ).toBe('patientTeam.removeCityblockTeamModalHeaderBodyWithTasks');
    expect(
      wrapper
        .find(Modal)
        .at(0)
        .props().submitMessageId,
    ).toBe('patientTeam.removeCityblockTeamModalSubmitButtonWithTasks');
  });

  it('renders the correct modal title and submit button when no tasks to reassign', () => {
    wrapper.setProps({ careTeamMemberTasks: [] });
    expect(
      wrapper
        .find(Modal)
        .at(0)
        .props().subTitleMessageId,
    ).toBe('patientTeam.removeCityblockTeamModalHeaderBody');
    expect(
      wrapper
        .find(Modal)
        .at(0)
        .props().submitMessageId,
    ).toBe('patientTeam.removeCityblockTeamModalSubmitButton');
  });
});
