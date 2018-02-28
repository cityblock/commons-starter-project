import { shallow } from 'enzyme';
import * as React from 'react';
import PhoneModal, { ISavedPhone } from '../../../../shared/phone-modal/phone-modal';
import { patient, phone1 } from '../../../../shared/util/test-data';
import { EditPhoneModal } from '../edit-phone-modal';

describe('Render Edit Phone Modal', () => {
  const onSaved = (phone: ISavedPhone) => true;
  const closePopup = () => true;
  const editPhoneMutation = jest.fn();
  const editPatientInfoMutation = jest.fn();

  const wrapper = shallow(
    <EditPhoneModal
      onSaved={onSaved}
      patientId={patient.id}
      patientInfoId={patient.patientInfo.id}
      isVisible={false}
      closePopup={closePopup}
      editPhoneMutation={editPhoneMutation}
      editPatientInfoMutation={editPatientInfoMutation}
      phone={phone1}
    />,
  );

  it('renders phone modal in not visible state with a blank phone', () => {
    expect(wrapper.find(PhoneModal)).toHaveLength(1);

    const modal = wrapper.find(PhoneModal).props();
    expect(modal.isVisible).toBeFalsy();
    expect(modal.closePopup).toBe(closePopup);
    expect(modal.titleMessageId).toBe('phone.editPhone');
    expect(modal.phone).toMatchObject(phone1);
  });

  it('renders phone modal in visible state', () => {
    wrapper.setProps({ isVisible: true });
    expect(wrapper.find(PhoneModal)).toHaveLength(1);

    const modal = wrapper.find(PhoneModal).props();
    expect(modal.isVisible).toBeTruthy();
  });
});
