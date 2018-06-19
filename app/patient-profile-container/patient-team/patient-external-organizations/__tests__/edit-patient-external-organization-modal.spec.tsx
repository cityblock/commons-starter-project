import { shallow } from 'enzyme';
import React from 'react';
import { externalOrganization, patient } from '../../../../shared/util/test-data';
import { EditPatientExternalOrganizationModal } from '../edit-patient-external-organization-modal';
import PatientExternalOrganizationModal from '../patient-external-organization-modal';

describe('Render Edit Patient External Organization Modal', () => {
  const closePopup = () => true;
  const editPatientExternalOrganizationMutation = jest.fn();

  const wrapper = shallow(
    <EditPatientExternalOrganizationModal
      patientExternalOrganization={externalOrganization}
      patientId={patient.id}
      isVisible={false}
      closePopup={closePopup}
      editPatientExternalOrganizationMutation={editPatientExternalOrganizationMutation}
    />,
  );

  it('renders external organization modal in not visible state', () => {
    expect(wrapper.find(PatientExternalOrganizationModal).length).toBe(1);

    const modal = wrapper.find(PatientExternalOrganizationModal).props();
    expect(modal.isVisible).toBeFalsy();
    expect(modal.closePopup).toBe(closePopup);
    expect(modal.titleMessageId).toBe('patientExternalOrganization.editModalTitle');
    expect(modal.subTitleMessageId).toBe('patientExternalOrganization.modalSubTitle');
    expect(modal.patientExternalOrganization).toMatchObject(externalOrganization);
  });

  it('renders external organization modal in visible state', () => {
    wrapper.setProps({ isVisible: true });
    expect(wrapper.find(PatientExternalOrganizationModal).length).toBe(1);

    const modal = wrapper.find(PatientExternalOrganizationModal).props();
    expect(modal.isVisible).toBeTruthy();
  });
});
