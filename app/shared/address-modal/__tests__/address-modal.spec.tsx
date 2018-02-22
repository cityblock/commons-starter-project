import { shallow } from 'enzyme';
import * as React from 'react';
import ModalButtons from '../../library/modal-buttons/modal-buttons';
import ModalError from '../../library/modal-error/modal-error';
import ModalHeader from '../../library/modal-header/modal-header';
import { Popup } from '../../popup/popup';
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
    expect(wrapper.find(Popup).length).toBe(1);
    expect(wrapper.find(Popup).props().visible).toBeFalsy();
    expect(wrapper.find(Popup).props().closePopup).not.toBe(closePopup);
    expect(wrapper.find(Popup).props().style).toBe('no-padding');
  });

  it('renders address modal header', () => {
    expect(wrapper.find(ModalHeader).length).toBe(1);
    expect(wrapper.find(ModalHeader).props().titleMessageId).toBe('title.id');
    expect(wrapper.find(ModalHeader).props().closePopup).not.toBe(closePopup);
  });

  it('renders address modal form without an address', () => {
    expect(wrapper.find(AddressForm).length).toBe(1);
    expect(wrapper.find(AddressForm).props().street).toBe(undefined);
    expect(wrapper.find(AddressForm).props().state).toBe(undefined);
    expect(wrapper.find(AddressForm).props().city).toBe(undefined);
    expect(wrapper.find(AddressForm).props().zip).toBe(undefined);
    expect(wrapper.find(AddressForm).props().description).toBe(undefined);
  });

  it('renders address modal buttons', () => {
    expect(wrapper.find(ModalButtons).length).toBe(1);
    expect(wrapper.find(ModalButtons).props().cancelMessageId).toBe('address.cancel');
    expect(wrapper.find(ModalButtons).props().submitMessageId).toBe('address.save');
    expect(wrapper.find(ModalButtons).props().cancel).not.toBe(closePopup);
  });

  it('renders address modal form with an address', () => {
    wrapper.setProps({ address: address1 });

    expect(wrapper.find(AddressForm).length).toBe(1);
    expect(wrapper.find(AddressForm).props().street).toBe(address1.street);
    expect(wrapper.find(AddressForm).props().state).toBe(address1.state);
    expect(wrapper.find(AddressForm).props().city).toBe(address1.city);
    expect(wrapper.find(AddressForm).props().zip).toBe(address1.zip);
    expect(wrapper.find(AddressForm).props().description).toBe(address1.description);

    wrapper.setState({
      street: '111 First Ave',
      state: 'CA',
      city: 'San Francisco',
      zip: '99999',
      description: 'edited address',
    });

    expect(wrapper.find(AddressForm).length).toBe(1);
    expect(wrapper.find(AddressForm).props().street).toBe('111 First Ave');
    expect(wrapper.find(AddressForm).props().state).toBe('CA');
    expect(wrapper.find(AddressForm).props().city).toBe('San Francisco');
    expect(wrapper.find(AddressForm).props().zip).toBe('99999');
    expect(wrapper.find(AddressForm).props().description).toBe('edited address');
  });

  it('renders an error bar if there is an error', () => {
    expect(wrapper.find(ModalError).length).toBe(0);

    wrapper.setState({ saveError: 'this is messed up' });
    expect(wrapper.find(ModalError).length).toBe(1);
  });
});
