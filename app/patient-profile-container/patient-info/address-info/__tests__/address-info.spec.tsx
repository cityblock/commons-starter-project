import { shallow } from 'enzyme';
import * as React from 'react';
import Button from '../../../../shared/library/button/button';
import DefaultText from '../../../../shared/library/default-text/default-text';
import { address2, address3, patient } from '../../../../shared/util/test-data';
import DisplayCard from '../../display-card';
import FlaggableDisplayField from '../../flaggable-display-field';
import { IEditableFieldState } from '../../patient-info';
import AddressInfo from '../address-info';
import CreateAddressModal from '../create-address-modal';
import EditAddressModal from '../edit-address-modal';

describe('Render Address Info Component', () => {
  const onChange = (fields: IEditableFieldState) => true;

  const wrapper = shallow(
    <AddressInfo onChange={onChange} patientId={patient.id} className="something" />,
  );

  it('renders address info without any addresses', () => {
    expect(wrapper.find(DisplayCard).length).toBe(0);
    expect(wrapper.find(FlaggableDisplayField).length).toBe(0);
    expect(wrapper.find(Button).length).toBe(0);
    expect(wrapper.find(DefaultText).length).toBe(1);
    expect(wrapper.find(DefaultText).props().messageId).toBe('address.addPrimary');
  });

  it('renders section with primary address', () => {
    wrapper.setProps({
      primaryAddress: patient.patientInfo.primaryAddress,
    });

    expect(wrapper.find(DisplayCard).length).toBe(1);
    expect(wrapper.find(FlaggableDisplayField).length).toBe(5);
    expect(wrapper.find(Button).length).toBe(1);

    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(0)
        .props().labelMessageId,
    ).toBe('address.street');
    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(0)
        .props().value,
    ).toBe(patient.patientInfo.primaryAddress.street);

    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(1)
        .props().labelMessageId,
    ).toBe('address.city');
    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(1)
        .props().value,
    ).toBe(patient.patientInfo.primaryAddress.city);

    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(2)
        .props().labelMessageId,
    ).toBe('address.state');
    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(2)
        .props().value,
    ).toBe(patient.patientInfo.primaryAddress.state);

    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(3)
        .props().labelMessageId,
    ).toBe('address.zip');
    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(3)
        .props().value,
    ).toBe(patient.patientInfo.primaryAddress.zip);

    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(4)
        .props().labelMessageId,
    ).toBe('address.description');
    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(4)
        .props().value,
    ).toBe(patient.patientInfo.primaryAddress.description);
  });

  it('renders section with additional addresses', () => {
    wrapper.setProps({
      primaryAddress: patient.patientInfo.primaryAddress,
      addresses: [address2, address3],
    });

    expect(wrapper.find(DisplayCard).length).toBe(3);
    expect(wrapper.find(FlaggableDisplayField).length).toBe(14);
    expect(wrapper.find(Button).length).toBe(1);

    // first additional address
    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(5)
        .props().value,
    ).toBe(address2.street);
    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(6)
        .props().value,
    ).toBe(address2.city);
    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(7)
        .props().value,
    ).toBe(address2.state);
    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(8)
        .props().value,
    ).toBe(address2.zip);

    // second additional address
    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(9)
        .props().value,
    ).toBe(address3.street);
    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(10)
        .props().value,
    ).toBe(null);
    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(11)
        .props().value,
    ).toBe(null);
    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(12)
        .props().value,
    ).toBe(address3.zip);
    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(13)
        .props().value,
    ).toBe(address3.description);
  });

  it('creates the two modals', () => {
    expect(wrapper.find(CreateAddressModal).length).toBe(1);
    expect(wrapper.find(EditAddressModal).length).toBe(1);

    const createModal = wrapper.find(CreateAddressModal).props();
    expect(createModal.isVisible).toBeFalsy();
    expect(createModal.patientId).toBe(patient.id);

    const editModal = wrapper.find(EditAddressModal).props();
    expect(editModal.isVisible).toBeFalsy();
    expect(editModal.patientId).toBe(patient.id);
    expect(editModal.address).toBe(undefined);
  });

  it('shows the create modal', () => {
    wrapper.setState({ isCreateModalVisible: true });
    expect(wrapper.find(CreateAddressModal).length).toBe(1);
    expect(wrapper.find(CreateAddressModal).props().isVisible).toBeTruthy();
  });

  it('shows the create primary modal', () => {
    wrapper.setState({ isCreateModalVisible: true, isPrimary: true });
    expect(wrapper.find(CreateAddressModal).length).toBe(1);
    expect(wrapper.find(CreateAddressModal).props().isPrimary).toBeTruthy();
  });

  it('shows the edit modal', () => {
    wrapper.setState({ isEditModalVisible: true, currentAddress: address2 });
    expect(wrapper.find(EditAddressModal).length).toBe(1);
    expect(wrapper.find(EditAddressModal).props().isVisible).toBeTruthy();
    expect(wrapper.find(EditAddressModal).props().address).toMatchObject(address2);
  });
});
