import { shallow } from 'enzyme';
import * as React from 'react';
import AddressModal, { ISavedAddress } from '../../../../shared/address-modal/address-modal';
import { address1, patient } from '../../../../shared/util/test-data';
import { EditAddressModal } from '../edit-address-modal';

describe('Render Edit Address Modal', () => {
  const onSaved = (address: ISavedAddress) => true;
  const closePopup = () => true;
  const editAddressMutation = jest.fn();

  const wrapper = shallow(
    <EditAddressModal
      onSaved={onSaved}
      patientId={patient.id}
      isVisible={false}
      closePopup={closePopup}
      editAddressMutation={editAddressMutation}
      address={address1}
    />,
  );

  it('renders address modal in not visible state with a blank address', () => {
    expect(wrapper.find(AddressModal).length).toBe(1);

    const modal = wrapper.find(AddressModal).props();
    expect(modal.isVisible).toBeFalsy();
    expect(modal.closePopup).toBe(closePopup);
    expect(modal.titleMessageId).toBe('address.editAddress');
    expect(modal.address).toMatchObject(address1);
  });

  it('renders address modal in visible state', () => {
    wrapper.setProps({ isVisible: true });
    expect(wrapper.find(AddressModal).length).toBe(1);

    const modal = wrapper.find(AddressModal).props();
    expect(modal.isVisible).toBeTruthy();
  });
});
