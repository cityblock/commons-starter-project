import { shallow } from 'enzyme';
import React from 'react';
import { patientContactCreate } from '../../../graphql/types';
import { patient } from '../../util/test-data';
import { CreatePatientContactModal } from '../create-patient-contact-modal';
import PatientContactModal from '../patient-contact-modal';

describe('Render Create Patient Proxy Modal', () => {
  const onSaved = (patientContact: patientContactCreate['patientContactCreate']) => true;
  const closePopup = () => true;
  const createPatientContact = jest.fn();
  const editPatientInfo = jest.fn();

  const wrapper = shallow(
    <CreatePatientContactModal
      onSaved={onSaved}
      patientId={patient.id}
      isVisible={false}
      closePopup={closePopup}
      contactType="healthcareProxy"
      titleMessageId="testTitle"
      createPatientContact={createPatientContact}
      editPatientInfo={editPatientInfo}
    />,
  );

  it('renders proxy modal in not visible state', () => {
    expect(wrapper.find(PatientContactModal).length).toBe(1);

    const modal = wrapper.find(PatientContactModal).props();
    expect(modal.isVisible).toBeFalsy();
    expect(modal.closePopup).toBe(closePopup);
    expect(modal.titleMessageId).toBe('testTitle');
  });

  it('renders proxy modal in visible state', () => {
    wrapper.setProps({ isVisible: true });
    expect(wrapper.find(PatientContactModal).length).toBe(1);

    const modal = wrapper.find(PatientContactModal).props();
    expect(modal.isVisible).toBeTruthy();
  });
});
