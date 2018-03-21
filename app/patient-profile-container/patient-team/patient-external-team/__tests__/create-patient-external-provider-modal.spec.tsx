import { shallow } from 'enzyme';
import * as React from 'react';
import { patient } from '../../../../shared/util/test-data';
import { CreatePatientExternalProviderModal } from '../create-patient-external-provider-modal';
import PatientExternalProviderModal from '../patient-external-provider-modal';

describe('Render Create Patient External Provider Modal', () => {
  const closePopup = () => true;
  const createPatientExternalProviderMutation = jest.fn();

  const wrapper = shallow(
    <CreatePatientExternalProviderModal
      patientId={patient.id}
      isVisible={false}
      closePopup={closePopup}
      createPatientExternalProviderMutation={createPatientExternalProviderMutation}
    />,
  );

  it('renders external provider modal in not visible state', () => {
    expect(wrapper.find(PatientExternalProviderModal).length).toBe(1);

    const modal = wrapper.find(PatientExternalProviderModal).props();
    expect(modal.isVisible).toBeFalsy();
    expect(modal.closePopup).toBe(closePopup);
    expect(modal.titleMessageId).toBe('patientExternalProvider.createModalTitle');
    expect(modal.subTitleMessageId).toBe('patientExternalProvider.modalSubTitle');
  });

  it('renders external provider modal in visible state', () => {
    wrapper.setProps({ isVisible: true });
    expect(wrapper.find(PatientExternalProviderModal).length).toBe(1);

    const modal = wrapper.find(PatientExternalProviderModal).props();
    expect(modal.isVisible).toBeTruthy();
  });
});
