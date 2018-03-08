import { shallow } from 'enzyme';
import * as React from 'react';
import { patientContactCreateMutation } from '../../../../graphql/types';
import { patient } from '../../../../shared/util/test-data';
import { CreatePatientProxyModal } from '../create-patient-proxy-modal';
import PatientProxyModal from '../patient-proxy-modal';

describe('Render Create Patient Proxy Modal', () => {
  const onSaved = (patientContact: patientContactCreateMutation['patientContactCreate']) => true;
  const closePopup = () => true;
  const createPhoneMutation = jest.fn();
  const createEmailMutation = jest.fn();
  const createPatientContactMutation = jest.fn();

  const wrapper = shallow(
    <CreatePatientProxyModal
      onSaved={onSaved}
      patientId={patient.id}
      isVisible={false}
      closePopup={closePopup}
      createPhoneMutation={createPhoneMutation}
      createEmailMutation={createEmailMutation}
      createPatientContactMutation={createPatientContactMutation}
    />,
  );

  it('renders proxy modal in not visible state', () => {
    expect(wrapper.find(PatientProxyModal).length).toBe(1);

    const modal = wrapper.find(PatientProxyModal).props();
    expect(modal.isVisible).toBeFalsy();
    expect(modal.closePopup).toBe(closePopup);
    expect(modal.titleMessageId).toBe('patientContact.addHealthcareProxy');
  });

  it('renders proxy modal in visible state', () => {
    wrapper.setProps({ isVisible: true });
    expect(wrapper.find(PatientProxyModal).length).toBe(1);

    const modal = wrapper.find(PatientProxyModal).props();
    expect(modal.isVisible).toBeTruthy();
  });
});
