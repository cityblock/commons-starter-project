import { shallow } from 'enzyme';
import React from 'react';
import EmailModal, { ISavedEmail } from '../../../../shared/email-modal/email-modal';
import { email1, patient } from '../../../../shared/util/test-data';
import { EditEmailModal } from '../edit-email-modal';

describe('Render Edit Email Modal', () => {
  const onSaved = (email: ISavedEmail) => true;
  const closePopup = () => true;
  const editEmail = jest.fn();
  const editPatientInfo = jest.fn();

  const wrapper = shallow(
    <EditEmailModal
      onSaved={onSaved}
      patientId={patient.id}
      patientInfoId={patient.patientInfo.id}
      isVisible={false}
      closePopup={closePopup}
      editEmail={editEmail}
      editPatientInfo={editPatientInfo}
      email={email1}
    />,
  );

  it('renders email modal in not visible state with a blank email', () => {
    expect(wrapper.find(EmailModal)).toHaveLength(1);

    const modal = wrapper.find(EmailModal).props();
    expect(modal.isVisible).toBeFalsy();
    expect(modal.closePopup).toBe(closePopup);
    expect(modal.titleMessageId).toBe('email.editEmail');
    expect(modal.email).toMatchObject(email1);
  });

  it('renders email modal in visible state', () => {
    wrapper.setProps({ isVisible: true });
    expect(wrapper.find(EmailModal)).toHaveLength(1);

    const modal = wrapper.find(EmailModal).props();
    expect(modal.isVisible).toBeTruthy();
  });
});
