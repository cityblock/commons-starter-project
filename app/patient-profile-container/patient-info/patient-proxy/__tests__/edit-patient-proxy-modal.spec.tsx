import { shallow } from 'enzyme';
import * as React from 'react';
import { patientContactEditMutation } from '../../../../graphql/types';
import { healthcareProxy, patient } from '../../../../shared/util/test-data';
import { EditPatientProxyModal } from '../edit-patient-proxy-modal';
import PatientProxyModal from '../patient-proxy-modal';

describe('Render Edit Patient Proxy Modal', () => {
  const onSaved = (patientContact: patientContactEditMutation['patientContactEdit']) => true;
  const closePopup = () => true;
  const createEmailMutation = jest.fn();
  const editEmailMutation = jest.fn();
  const editPhoneMutation = jest.fn();
  const editPatientContactMutation = jest.fn();

  const wrapper = shallow(
    <EditPatientProxyModal
      onSaved={onSaved}
      patientProxy={healthcareProxy}
      patientId={patient.id}
      isVisible={false}
      closePopup={closePopup}
      createEmailMutation={createEmailMutation}
      editPatientContactMutation={editPatientContactMutation}
      editPhoneMutation={editPhoneMutation}
      editEmailMutation={editEmailMutation}
    />,
  );

  it('renders proxy modal in not visible state', () => {
    expect(wrapper.find(PatientProxyModal).length).toBe(1);

    const modal = wrapper.find(PatientProxyModal).props();
    expect(modal.isVisible).toBeFalsy();
    expect(modal.closePopup).toBe(closePopup);
    expect(modal.titleMessageId).toBe('patientContact.editHealthcareProxy');
    expect(modal.patientProxy).toMatchObject(healthcareProxy);
  });

  it('renders proxy modal in visible state', () => {
    wrapper.setProps({ isVisible: true });
    expect(wrapper.find(PatientProxyModal).length).toBe(1);

    const modal = wrapper.find(PatientProxyModal).props();
    expect(modal.isVisible).toBeTruthy();
  });
});
