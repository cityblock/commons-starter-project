import { shallow } from 'enzyme';
import * as React from 'react';
import AddressModal, { ISavedAddress } from '../../../../shared/address-modal/address-modal';
import { patient } from '../../../../shared/util/test-data';
import { CreatePrimaryAddressModal } from '../create-primary-address-modal';

describe('Render Create Primary Address Modals', () => {
  const onSaved = (address: ISavedAddress) => true;
  const closePopup = () => true;
  const createPrimaryAddressMutation = jest.fn();

  const wrapper = shallow(
    <CreatePrimaryAddressModal
      onSaved={onSaved}
      patientInfoId={patient.patientInfo.id}
      isVisible={false}
      closePopup={closePopup}
      createPrimaryAddressMutation={createPrimaryAddressMutation}
    />,
  );

  it('renders address  modal in not visible state', () => {
    expect(wrapper.find(AddressModal).length).toBe(1);

    const modal = wrapper.find(AddressModal).props();
    expect(modal.isVisible).toBeFalsy();
    expect(modal.closePopup).toBe(closePopup);
    expect(modal.titleMessageId).toBe('address.addPrimary');
  });

  it('renders address modal in visible state', () => {
    wrapper.setProps({ isVisible: true });
    expect(wrapper.find(AddressModal).length).toBe(1);

    const modal = wrapper.find(AddressModal).props();
    expect(modal.isVisible).toBeTruthy();
  });
});
