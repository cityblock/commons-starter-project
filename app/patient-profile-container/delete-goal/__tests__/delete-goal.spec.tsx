import { shallow } from 'enzyme';
import * as React from 'react';
import DeleteModal from '../../../shared/library/delete-modal/delete-modal';
import { DeleteGoalModal } from '../delete-goal';

describe('Delete Goal Modal', () => {
  const placeholderFn = () => true as any;
  const patientGoalTitle = 'Defeat the Night King';
  const patientGoalId = 'jonSnow';

  const wrapper = shallow(
    <DeleteGoalModal
      closePopup={placeholderFn}
      visible={true}
      patientGoalTitle={patientGoalTitle}
      deletePatientGoal={placeholderFn}
      patientGoalId={patientGoalId}
    />,
  );

  it('renders delete goal modal with correct props', () => {
    expect(wrapper.find(DeleteModal).length).toBe(1);
    expect(wrapper.find(DeleteModal).props().visible).toBeTruthy();
    expect(wrapper.find(DeleteModal).props().titleMessageId).toBe('goalDelete.title');
    expect(wrapper.find(DeleteModal).props().descriptionMessageId).toBe('goalDelete.description');
    expect(wrapper.find(DeleteModal).props().deletedItemHeaderMessageId).toBe('goalDelete.name');
    expect(wrapper.find(DeleteModal).props().deletedItemName).toBe(patientGoalTitle);
  });

  it('closes delete goal modal', () => {
    wrapper.setProps({ visible: false });
    expect(wrapper.find(DeleteModal).props().visible).toBeFalsy();
  });
});
