import { shallow } from 'enzyme';
import * as React from 'react';
import DeleteModal from '../../../shared/library/delete-modal/delete-modal';
import { DeleteConcernModal } from '../delete-concern';

describe('Delete Goal Modal', () => {
  const placeholderFn = jest.fn();
  const patientConcernTitle = 'Defeat the Night King';
  const patientConcernId = 'jonSnow';

  const wrapper = shallow(
    <DeleteConcernModal
      closePopup={placeholderFn}
      visible={true}
      patientConcernTitle={patientConcernTitle}
      deletePatientConcern={placeholderFn}
      patientConcernId={patientConcernId}
    />,
  );

  it('renders delete concern modal with correct props', () => {
    expect(wrapper.find(DeleteModal).length).toBe(1);
    expect(wrapper.find(DeleteModal).props().visible).toBeTruthy();
    expect(wrapper.find(DeleteModal).props().titleMessageId).toBe('concernDelete.title');
    expect(wrapper.find(DeleteModal).props().descriptionMessageId).toBe(
      'concernDelete.description',
    );
    expect(wrapper.find(DeleteModal).props().deletedItemHeaderMessageId).toBe('concernDelete.name');
    expect(wrapper.find(DeleteModal).props().deletedItemName).toBe(patientConcernTitle);
  });

  it('closes delete concern modal', () => {
    wrapper.setProps({ visible: false });
    expect(wrapper.find(DeleteModal).props().visible).toBeFalsy();
  });
});
