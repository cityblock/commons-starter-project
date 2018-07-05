import { shallow } from 'enzyme';
import React from 'react';
import Modal from '../../library/modal/modal';
import { address1 } from '../../util/test-data';
import AddressForm from '../address-form';
import AddressModal, { IAddress } from '../address-modal';

describe('Render Address Info Component', () => {
  const closePopup = () => true;
  const wrapper = shallow(
    <AddressModal
      saveAddress={async (address: IAddress) => Promise.resolve()}
      closePopup={closePopup}
      onSaved={(response: any) => true}
      isVisible={false}
      titleMessageId="title.id"
    />,
  );

  it('renders address modal popup', () => {
    expect(wrapper.find(Modal).length).toBe(1);
    expect(wrapper.find(Modal).props().visible).toBeFalsy();
    expect(wrapper.find(Modal).props().closePopup).not.toBe(closePopup);
    expect(wrapper.find(Modal).props().cancelMessageId).toBe('address.cancel');
    expect(wrapper.find(Modal).props().submitMessageId).toBe('address.save');
    expect(wrapper.find(Modal).props().titleMessageId).toBe('title.id');
  });

  it('renders address modal form without an address', () => {
    expect(wrapper.find(AddressForm).length).toBe(1);
    expect(wrapper.find(AddressForm).props().street1).toBe(undefined);
    expect(wrapper.find(AddressForm).props().state).toBe(undefined);
    expect(wrapper.find(AddressForm).props().city).toBe(undefined);
    expect(wrapper.find(AddressForm).props().zip).toBe(undefined);
    expect(wrapper.find(AddressForm).props().description).toBe(undefined);
  });

  it('renders address modal form with an address', () => {
    wrapper.setProps({ address: address1 });

    expect(wrapper.find(AddressForm).length).toBe(1);
    expect(wrapper.find(AddressForm).props().street1).toBe(address1.street1);
    expect(wrapper.find(AddressForm).props().street2).toBe(address1.street2);
    expect(wrapper.find(AddressForm).props().state).toBe(address1.state);
    expect(wrapper.find(AddressForm).props().city).toBe(address1.city);
    expect(wrapper.find(AddressForm).props().zip).toBe(address1.zip);
    expect(wrapper.find(AddressForm).props().description).toBe(address1.description);

    wrapper.setState({
      street1: '111 First Ave',
      street2: 'Apt 2',
      state: 'CA',
      city: 'San Francisco',
      zip: '99999',
      description: 'edited address',
    });

    expect(wrapper.find(AddressForm).length).toBe(1);
    expect(wrapper.find(AddressForm).props().street1).toBe('111 First Ave');
    expect(wrapper.find(AddressForm).props().street2).toBe('Apt 2');
    expect(wrapper.find(AddressForm).props().state).toBe('CA');
    expect(wrapper.find(AddressForm).props().city).toBe('San Francisco');
    expect(wrapper.find(AddressForm).props().zip).toBe('99999');
    expect(wrapper.find(AddressForm).props().description).toBe('edited address');
  });

  it('renders an error bar if there is an error', () => {
    expect(wrapper.find(Modal).props().error).toBeFalsy();

    wrapper.setState({ saveError: 'this is messed up' });
    expect(wrapper.find(Modal).props().error).toBe('this is messed up');
  });

  it('toggles primary state on form', () => {
    expect(wrapper.find(AddressForm).props().isPrimary).toBeFalsy();
    expect(wrapper.find(AddressForm).props().onPrimaryChange).toBeTruthy();

    wrapper.setProps({ isPrimary: true });
    expect(wrapper.find(AddressForm).props().isPrimary).toBeTruthy();
    expect(wrapper.find(AddressForm).props().onPrimaryChange).toBeFalsy();
  });
});
