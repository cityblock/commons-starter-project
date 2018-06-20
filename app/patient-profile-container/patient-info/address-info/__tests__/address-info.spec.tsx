import { shallow } from 'enzyme';
import React from 'react';
import Button from '../../../../shared/library/button/button';
import Checkbox from '../../../../shared/library/checkbox/checkbox';
import DefaultText from '../../../../shared/library/default-text/default-text';
import { address2, address3, patient } from '../../../../shared/util/test-data';
import DisplayCard from '../../display-card';
import FlaggableDisplayField from '../../flaggable-display-field';
import { IEditableFieldState } from '../../patient-info';
import { AddressInfo } from '../address-info';
import CreateAddressModal from '../create-address-modal';
import EditAddressModal from '../edit-address-modal';

describe('Render Address Info Component', () => {
  const onChange = (fields: IEditableFieldState) => true;
  const addressDelete = jest.fn();
  const errorFn = (message: string) => true as any;

  const wrapper = shallow(
    <AddressInfo
      onChange={onChange}
      patientId={patient.id}
      patientInfoId={patient.id}
      className="something"
      addressDelete={addressDelete}
      error={null}
      openErrorPopup={errorFn}
    />,
  );

  it('renders address info without any addresses', () => {
    expect(wrapper.find(DisplayCard)).toHaveLength(0);
    expect(wrapper.find(FlaggableDisplayField)).toHaveLength(0);
    expect(wrapper.find(Button)).toHaveLength(0);
    expect(wrapper.find(DefaultText)).toHaveLength(1);
    expect(wrapper.find(DefaultText).props().messageId).toBe('address.addPrimary');
    expect(wrapper.find(Checkbox)).toHaveLength(1);

    expect(wrapper.find(Checkbox).props().isChecked).toBeFalsy();
  });

  it('renders section with primary address', () => {
    wrapper.setProps({
      primaryAddress: patient.patientInfo.primaryAddress,
      addresses: [patient.patientInfo.primaryAddress],
    });

    expect(wrapper.find(DisplayCard)).toHaveLength(1);
    expect(wrapper.find(FlaggableDisplayField)).toHaveLength(6);
    expect(wrapper.find(Button)).toHaveLength(1);

    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(0)
        .props().labelMessageId,
    ).toBe('address.street1');
    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(0)
        .props().value,
    ).toBe(patient.patientInfo.primaryAddress.street1);

    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(1)
        .props().labelMessageId,
    ).toBe('address.street2');
    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(1)
        .props().value,
    ).toBe(patient.patientInfo.primaryAddress.street2);

    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(2)
        .props().labelMessageId,
    ).toBe('address.city');
    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(2)
        .props().value,
    ).toBe(patient.patientInfo.primaryAddress.city);

    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(3)
        .props().labelMessageId,
    ).toBe('address.state');
    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(3)
        .props().value,
    ).toBe(patient.patientInfo.primaryAddress.state);

    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(4)
        .props().labelMessageId,
    ).toBe('address.zip');
    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(4)
        .props().value,
    ).toBe(patient.patientInfo.primaryAddress.zip);

    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(5)
        .props().labelMessageId,
    ).toBe('address.description');
    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(5)
        .props().value,
    ).toBe(patient.patientInfo.primaryAddress.description);
  });

  it('renders section with additional addresses', () => {
    wrapper.setProps({
      primaryAddress: patient.patientInfo.primaryAddress,
      addresses: [patient.patientInfo.primaryAddress, address2, address3],
    });

    expect(wrapper.find(DisplayCard)).toHaveLength(3);
    expect(wrapper.find(FlaggableDisplayField)).toHaveLength(17);
    expect(wrapper.find(Button)).toHaveLength(1);

    // first additional address
    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(6)
        .props().value,
    ).toBe(address2.street1);
    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(7)
        .props().value,
    ).toBe(address2.street2);
    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(8)
        .props().value,
    ).toBe(address2.city);
    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(9)
        .props().value,
    ).toBe(address2.state);
    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(10)
        .props().value,
    ).toBe(address2.zip);

    // second additional address
    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(11)
        .props().value,
    ).toBe(address3.street1);
    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(12)
        .props().value,
    ).toBe(address3.street2);
    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(13)
        .props().value,
    ).toBe(null);
    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(14)
        .props().value,
    ).toBe(null);
    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(15)
        .props().value,
    ).toBe(address3.zip);
    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(16)
        .props().value,
    ).toBe(address3.description);
  });

  it('creates the two modals', () => {
    expect(wrapper.find(CreateAddressModal)).toHaveLength(1);
    expect(wrapper.find(EditAddressModal)).toHaveLength(1);

    const createModal = wrapper.find(CreateAddressModal).props();
    expect(createModal.isVisible).toBeFalsy();
    expect(createModal.patientId).toBe(patient.id);
  });

  it('shows the create modal', () => {
    wrapper.setState({ isCreateModalVisible: true });
    expect(wrapper.find(CreateAddressModal)).toHaveLength(1);
    expect(wrapper.find(CreateAddressModal).props().isVisible).toBeTruthy();
  });

  it('shows the create primary modal', () => {
    wrapper.setState({ isCreateModalVisible: true, isPrimary: true });
    expect(wrapper.find(CreateAddressModal)).toHaveLength(1);
    expect(wrapper.find(CreateAddressModal).props().isPrimary).toBeTruthy();
  });

  it('toggles the marginally housed checkbox', () => {
    wrapper.setProps({ isMarginallyHoused: true });
    expect(wrapper.find(Checkbox).props().isChecked).toBeTruthy();

    wrapper.setProps({ isMarginallyHoused: false });
    expect(wrapper.find(Checkbox).props().isChecked).toBeFalsy();
  });
});
