import { shallow } from 'enzyme';
import * as React from 'react';
import AddressModal, { ISavedAddress } from '../../../../shared/address-modal/address-modal';
import { patient } from '../../../../shared/util/test-data';
import { CreateAddressModal } from '../create-address-modal';

describe('Render Create Address Modal', () => {
  const onSaved = (address: ISavedAddress) => true;
  const closePopup = () => true;
  const createAddressMutation = jest.fn();

  const wrapper = shallow(
    <CreateAddressModal
      onSaved={onSaved}
      patientId={patient.id}
      isVisible={false}
      closePopup={closePopup}
      createAddressMutation={createAddressMutation}
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
});
