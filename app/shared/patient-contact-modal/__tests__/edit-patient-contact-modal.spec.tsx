import { shallow } from 'enzyme';
import React from 'react';
import { patientContactEdit } from '../../../graphql/types';
import { healthcareProxy, patient } from '../../../shared/util/test-data';
import { EditPatientContactModal } from '../edit-patient-contact-modal';
import PatientContactModal from '../patient-contact-modal';

describe('Render Edit Patient Proxy Modal', () => {
  const onSaved = (patientContact: patientContactEdit['patientContactEdit']) => true;
  const closePopup = () => true;
  const editPatientContact = jest.fn();

  const wrapper = shallow(
    <EditPatientContactModal
      onSaved={onSaved}
      patientContact={healthcareProxy}
      patientId={patient.id}
      isVisible={false}
      closePopup={closePopup}
      contactType="healthcareProxy"
      titleMessageId="testTitle"
      editPatientContact={editPatientContact}
    />,
  );

  it('renders proxy modal in not visible state', () => {
    expect(wrapper.find(PatientContactModal).length).toBe(1);

    const modal = wrapper.find(PatientContactModal).props();
    expect(modal.isVisible).toBeFalsy();
    expect(modal.closePopup).toBe(closePopup);
    expect(modal.titleMessageId).toBe('testTitle');
    expect(modal.patientContact).toMatchObject(healthcareProxy);
  });

  it('renders proxy modal in visible state', () => {
    wrapper.setProps({ isVisible: true });
    expect(wrapper.find(PatientContactModal).length).toBe(1);

    const modal = wrapper.find(PatientContactModal).props();
    expect(modal.isVisible).toBeTruthy();
  });
});
