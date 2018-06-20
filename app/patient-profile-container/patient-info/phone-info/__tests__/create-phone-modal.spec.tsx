import { shallow } from 'enzyme';
import React from 'react';
import PhoneModal, { ISavedPhone } from '../../../../shared/phone-modal/phone-modal';
import { patient } from '../../../../shared/util/test-data';
import { CreatePhoneModal } from '../create-phone-modal';

describe('Render Create Phone Modal', () => {
  const onSaved = (phone: ISavedPhone) => true;
  const closePopup = () => true;
  const createPhone = jest.fn();

  const wrapper = shallow(
    <CreatePhoneModal
      onSaved={onSaved}
      patientId={patient.id}
      isVisible={false}
      closePopup={closePopup}
      createPhone={createPhone}
    />,
  );

  it('renders phone  modal in not visible state', () => {
    expect(wrapper.find(PhoneModal).length).toBe(1);

    const modal = wrapper.find(PhoneModal).props();
    expect(modal.isVisible).toBeFalsy();
    expect(modal.closePopup).toBe(closePopup);
    expect(modal.titleMessageId).toBe('phone.addAdditional');
  });

  it('renders phone modal in visible state', () => {
    wrapper.setProps({ isVisible: true });
    expect(wrapper.find(PhoneModal).length).toBe(1);

    const modal = wrapper.find(PhoneModal).props();
    expect(modal.isVisible).toBeTruthy();
  });

  it('renders phone modal for primary phone', () => {
    wrapper.setProps({ isPrimary: true });
    expect(wrapper.find(PhoneModal).props().titleMessageId).toBe('phone.addPrimary');
  });
});
