import { shallow } from 'enzyme';
import React from 'react';
import AddressModal, { ISavedAddress } from '../../../../shared/address-modal/address-modal';
import { patient } from '../../../../shared/util/test-data';
import { CreateAddressModal } from '../create-address-modal';

describe('Render Create Address Modal', () => {
  const onSaved = (address: ISavedAddress) => true;
  const closePopup = () => true;
  const createAddress = jest.fn();

  const wrapper = shallow(
    <CreateAddressModal
      onSaved={onSaved}
      patientId={patient.id}
      isVisible={false}
      closePopup={closePopup}
      createAddress={createAddress}
    />,
  );

  it('renders address  modal in not visible state', () => {
    expect(wrapper.find(AddressModal).length).toBe(1);

    const modal = wrapper.find(AddressModal).props();
    expect(modal.isVisible).toBeFalsy();
    expect(modal.closePopup).toBe(closePopup);
    expect(modal.titleMessageId).toBe('address.addAdditional');
  });

  it('renders address modal in visible state', () => {
    wrapper.setProps({ isVisible: true });
    expect(wrapper.find(AddressModal).length).toBe(1);

    const modal = wrapper.find(AddressModal).props();
    expect(modal.isVisible).toBeTruthy();
  });

  it('renders address modal for primary address', () => {
    wrapper.setProps({ isPrimary: true });
    expect(wrapper.find(AddressModal).props().titleMessageId).toBe('address.addPrimary');
  });
});
