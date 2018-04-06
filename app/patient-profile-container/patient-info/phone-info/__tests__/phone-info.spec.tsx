import { shallow } from 'enzyme';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '../../../../shared/library/button/button';
import DefaultText from '../../../../shared/library/default-text/default-text';
import { patient, phone2 } from '../../../../shared/util/test-data';
import DisplayCard from '../../display-card';
import FlaggableDisplayField from '../../flaggable-display-field';
import { IEditableFieldState } from '../../patient-info';
import CreatePhoneModal from '../create-phone-modal';
import EditPhoneModal from '../edit-phone-modal';
import { PhoneInfo } from '../phone-info';

describe('Render Phone Info Component', () => {
  const onChange = (fields: IEditableFieldState) => true;
  const phoneDeleteMutation = jest.fn();
  const errorFn = (message: string) => true as any;

  const wrapper = shallow(
    <PhoneInfo
      onChange={onChange}
      patientId={patient.id}
      patientInfoId={patient.patientInfo.id}
      className="something"
      phoneDeleteMutation={phoneDeleteMutation}
      error={null}
      openErrorPopup={errorFn}
    />,
  );

  it('renders phone info without any phones', () => {
    expect(wrapper.find(FormattedMessage)).toHaveLength(1);
    expect(wrapper.find(FormattedMessage).props().id).toBe('phone.phoneNumbers');

    expect(wrapper.find(DisplayCard)).toHaveLength(0);
    expect(wrapper.find(FlaggableDisplayField)).toHaveLength(0);
    expect(wrapper.find(Button)).toHaveLength(0);
    expect(wrapper.find(DefaultText)).toHaveLength(1);
    expect(wrapper.find(DefaultText).props().messageId).toBe('phone.addPrimary');
  });

  it('renders section with primary phone', () => {
    wrapper.setProps({
      primaryPhone: patient.patientInfo.primaryPhone,
      phones: [patient.patientInfo.primaryPhone],
    });

    expect(wrapper.find(DisplayCard)).toHaveLength(1);
    expect(wrapper.find(FlaggableDisplayField)).toHaveLength(2);
    expect(wrapper.find(FormattedMessage)).toHaveLength(2);
    expect(wrapper.find(Button)).toHaveLength(1);

    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(0)
        .props().labelMessageId,
    ).toBe('phone.phoneNumber');
    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(0)
        .props().value,
    ).toBe(patient.patientInfo.primaryPhone.phoneNumber);

    expect(
      wrapper
        .find(FormattedMessage)
        .at(1)
        .props().id,
    ).toBe('phone.mobile');

    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(1)
        .props().labelMessageId,
    ).toBe('phone.description');
    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(1)
        .props().value,
    ).toBe(patient.patientInfo.primaryPhone.description);
  });

  it('renders section with additional phones', () => {
    wrapper.setProps({
      primaryPhone: patient.patientInfo.primaryPhone,
      phones: [patient.patientInfo.primaryPhone, phone2],
    });

    expect(wrapper.find(DisplayCard)).toHaveLength(2);
    expect(wrapper.find(FlaggableDisplayField)).toHaveLength(4);
    expect(wrapper.find(FormattedMessage)).toHaveLength(3);
    expect(wrapper.find(Button)).toHaveLength(1);

    // first additional phone
    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(2)
        .props().value,
    ).toBe(phone2.phoneNumber);
    expect(
      wrapper
        .find(FormattedMessage)
        .at(2)
        .props().id,
    ).toBe('phone.work');

    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(3)
        .props().labelMessageId,
    ).toBe('phone.description');
    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(3)
        .props().value,
    ).toBeFalsy();
  });

  it('creates the two modals', () => {
    expect(wrapper.find(CreatePhoneModal)).toHaveLength(1);
    expect(wrapper.find(EditPhoneModal)).toHaveLength(1);

    const createModal = wrapper.find(CreatePhoneModal).props();
    expect(createModal.isVisible).toBeFalsy();
    expect(createModal.patientId).toBe(patient.id);
  });

  it('shows the create modal', () => {
    wrapper.setState({ isCreateModalVisible: true });
    expect(wrapper.find(CreatePhoneModal)).toHaveLength(1);
    expect(wrapper.find(CreatePhoneModal).props().isVisible).toBeTruthy();
  });

  it('shows the create primary modal', () => {
    wrapper.setState({ isCreateModalVisible: true, isPrimary: true });
    expect(wrapper.find(CreatePhoneModal)).toHaveLength(1);
    expect(wrapper.find(CreatePhoneModal).props().isPrimary).toBeTruthy();
  });
});
