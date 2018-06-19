import { shallow } from 'enzyme';
import React from 'react';
import { patient } from '../../../../shared/util/test-data';
import { CreatePatientExternalOrganizationModal } from '../create-patient-external-organization-modal';
import PatientExternalOrganizationModal from '../patient-external-organization-modal';

describe('Render Create Patient External Organization Modal', () => {
  const closePopup = () => true;
  const createPatientExternalOrganizationMutation = jest.fn();

  const wrapper = shallow(
    <CreatePatientExternalOrganizationModal
      patientId={patient.id}
      isVisible={false}
      closePopup={closePopup}
      createPatientExternalOrganizationMutation={createPatientExternalOrganizationMutation}
    />,
  );

  it('renders external organization modal in not visible state', () => {
    expect(wrapper.find(PatientExternalOrganizationModal).length).toBe(1);

    const modal = wrapper.find(PatientExternalOrganizationModal).props();
    expect(modal.isVisible).toBeFalsy();
    expect(modal.closePopup).toBe(closePopup);
    expect(modal.titleMessageId).toBe('patientExternalOrganization.createModalTitle');
    expect(modal.subTitleMessageId).toBe('patientExternalOrganization.modalSubTitle');
  });

  it('renders external organization modal in visible state', () => {
    wrapper.setProps({ isVisible: true });
    expect(wrapper.find(PatientExternalOrganizationModal).length).toBe(1);

    const modal = wrapper.find(PatientExternalOrganizationModal).props();
    expect(modal.isVisible).toBeTruthy();
  });
});
