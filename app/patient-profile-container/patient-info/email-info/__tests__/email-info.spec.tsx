import { shallow } from 'enzyme';
import * as React from 'react';
import Button from '../../../../shared/library/button/button';
import DefaultText from '../../../../shared/library/default-text/default-text';
import { email2, patient } from '../../../../shared/util/test-data';
import DisplayCard from '../../display-card';
import FlaggableDisplayField from '../../flaggable-display-field';
import { IEditableFieldState } from '../../patient-info';
import CreateEmailModal from '../create-email-modal';
import EditEmailModal from '../edit-email-modal';
import { EmailInfo } from '../email-info';

describe('Render Email Info Component', () => {
  const onChange = (fields: IEditableFieldState) => true;
  const emailDeleteMutation = jest.fn();
  const errorFn = (message: string) => true as any;

  const wrapper = shallow(
    <EmailInfo
      onChange={onChange}
      patientId={patient.id}
      patientInfoId={patient.patientInfo.id}
      className="something"
      emailDeleteMutation={emailDeleteMutation}
      error={null}
      openErrorPopup={errorFn}
    />,
  );

  it('renders email info without any emails', () => {
    expect(wrapper.find(DisplayCard)).toHaveLength(0);
    expect(wrapper.find(FlaggableDisplayField)).toHaveLength(0);
    expect(wrapper.find(Button)).toHaveLength(0);
    expect(wrapper.find(DefaultText)).toHaveLength(1);
    expect(wrapper.find(DefaultText).props().messageId).toBe('email.addPrimary');
  });

  it('renders section with primary email', () => {
    wrapper.setProps({
      primaryEmail: patient.patientInfo.primaryEmail,
      emails: [patient.patientInfo.primaryEmail],
    });

    expect(wrapper.find(DisplayCard)).toHaveLength(1);
    expect(wrapper.find(FlaggableDisplayField)).toHaveLength(1);
    expect(wrapper.find(Button)).toHaveLength(1);

    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(0)
        .props().labelMessageId,
    ).toBe('email.emailAddress');
    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(0)
        .props().value,
    ).toBe(patient.patientInfo.primaryEmail.emailAddress);
  });

  it('renders section with additional emails', () => {
    wrapper.setProps({
      primaryEmail: patient.patientInfo.primaryEmail,
      emails: [patient.patientInfo.primaryEmail, email2],
    });

    expect(wrapper.find(DisplayCard)).toHaveLength(2);
    expect(wrapper.find(FlaggableDisplayField)).toHaveLength(3);
    expect(wrapper.find(Button)).toHaveLength(1);

    // first additional email
    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(1)
        .props().value,
    ).toBe(email2.emailAddress);
    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(2)
        .props().value,
    ).toBe(email2.description);
  });

  it('creates the two modals', () => {
    expect(wrapper.find(CreateEmailModal)).toHaveLength(1);
    expect(wrapper.find(EditEmailModal)).toHaveLength(1);

    const createModal = wrapper.find(CreateEmailModal).props();
    expect(createModal.isVisible).toBeFalsy();
    expect(createModal.patientId).toBe(patient.id);
  });

  it('shows the create modal', () => {
    wrapper.setState({ isCreateModalVisible: true });
    expect(wrapper.find(CreateEmailModal)).toHaveLength(1);
    expect(wrapper.find(CreateEmailModal).props().isVisible).toBeTruthy();
  });

  it('shows the create primary modal', () => {
    wrapper.setState({ isCreateModalVisible: true, isPrimary: true });
    expect(wrapper.find(CreateEmailModal)).toHaveLength(1);
    expect(wrapper.find(CreateEmailModal).props().isPrimary).toBeTruthy();
  });
});
