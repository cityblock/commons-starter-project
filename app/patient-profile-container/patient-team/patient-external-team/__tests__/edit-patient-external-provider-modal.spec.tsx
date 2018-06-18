import { shallow } from 'enzyme';
import React from 'react';
import { externalProviderPerson, patient } from '../../../../shared/util/test-data';
import { EditPatientExternalProviderModal } from '../edit-patient-external-provider-modal';
import PatientExternalProviderModal from '../patient-external-provider-modal';

describe('Render Edit Patient External Provider Modal', () => {
  const closePopup = () => true;
  const editPatientExternalProviderMutation = jest.fn();

  const wrapper = shallow(
    <EditPatientExternalProviderModal
      patientExternalProvider={externalProviderPerson}
      patientId={patient.id}
      isVisible={false}
      closePopup={closePopup}
      editPatientExternalProviderMutation={editPatientExternalProviderMutation}
    />,
  );

  it('renders external provider modal in not visible state', () => {
    expect(wrapper.find(PatientExternalProviderModal).length).toBe(1);

    const modal = wrapper.find(PatientExternalProviderModal).props();
    expect(modal.isVisible).toBeFalsy();
    expect(modal.closePopup).toBe(closePopup);
    expect(modal.titleMessageId).toBe('patientExternalProvider.editModalTitle');
    expect(modal.subTitleMessageId).toBe('patientExternalProvider.modalSubTitle');
    expect(modal.patientExternalProvider).toMatchObject(externalProviderPerson);
  });

  it('renders external provider modal in visible state', () => {
    wrapper.setProps({ isVisible: true });
    expect(wrapper.find(PatientExternalProviderModal).length).toBe(1);

    const modal = wrapper.find(PatientExternalProviderModal).props();
    expect(modal.isVisible).toBeTruthy();
  });
});
