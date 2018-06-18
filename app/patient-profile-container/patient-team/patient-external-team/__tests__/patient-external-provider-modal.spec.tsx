import { shallow } from 'enzyme';
import React from 'react';
import Icon from '../../../../shared/library/icon/icon';
import Modal from '../../../../shared/library/modal/modal';
import { externalProviderEntity, externalProviderPerson } from '../../../../shared/util/test-data';
import PatientExternalProviderForm from '../patient-external-provider-form';
import { PatientExternalProviderModal } from '../patient-external-provider-modal';

describe('Render External Provider Modal Component', () => {
  const closePopup = () => true;
  const wrapper = shallow(
    <PatientExternalProviderModal
      patientId={externalProviderPerson.patientId}
      saveExternalProvider={jest.fn()}
      closePopup={closePopup}
      isVisible={false}
      titleMessageId="title.id"
    />,
  );

  it('renders external provider modal popup', () => {
    const modal = wrapper.find(Modal);
    expect(modal).toHaveLength(1);
    expect(modal.props().visible).toBeFalsy();
    expect(modal.props().closePopup).not.toBe(closePopup);
    expect(modal.props().cancelMessageId).toBe('patientExternalProvider.cancel');
    expect(modal.props().errorMessageId).toBe('patientExternalProvider.saveError');
    expect(modal.props().titleMessageId).toBe('title.id');
  });

  it('renders no organizations error', () => {
    const modal = wrapper.find(Modal);
    expect(modal.props().submitMessageId).toBe('patientExternalProvider.goToOrganizations');

    const icon = wrapper.find(Icon);
    expect(icon).toHaveLength(1);
    expect(icon.props().name).toBe('errorOutline');
    expect(icon.props().color).toBe('red');

    const form = wrapper.find(PatientExternalProviderForm);
    expect(form).toHaveLength(0);
  });

  it('renders external provider modal form without a patient external provider', () => {
    wrapper.setProps({
      patientExternalOrganizations: [externalProviderEntity.patientExternalOrganization],
    });
    const modal = wrapper.find(Modal);
    expect(modal.props().submitMessageId).toBe('patientExternalProvider.save');

    const form = wrapper.find(PatientExternalProviderForm);
    expect(form).toHaveLength(1);

    expect(form.props().emailAddress).toBe(null);
    expect(form.props().phoneNumber).toBe(null);
    expect(form.props().firstName).toBe(null);
    expect(form.props().lastName).toBe(null);
    expect(form.props().role).toBe(null);
    expect(form.props().roleFreeText).toBe(null);
    expect(form.props().patientExternalOrganizationId).toBe(null);
    expect(form.props().description).toBe(null);
  });

  it('renders external provider modal form with a patient external provider', () => {
    wrapper.setProps({ patientExternalProvider: externalProviderPerson });

    let form = wrapper.find(PatientExternalProviderForm);
    expect(form).toHaveLength(1);

    expect(form.props().emailAddress).toBe(externalProviderPerson.email.emailAddress);
    expect(form.props().phoneNumber).toBe(externalProviderPerson.phone.phoneNumber);
    expect(form.props().firstName).toBe(externalProviderPerson.firstName);
    expect(form.props().lastName).toBe(externalProviderPerson.lastName);
    expect(form.props().role).toBe(externalProviderPerson.role);
    expect(form.props().roleFreeText).toBe(externalProviderPerson.roleFreeText);
    expect(form.props().patientExternalOrganizationId).toBe(
      externalProviderPerson.patientExternalOrganizationId,
    );
    expect(form.props().description).toBe(externalProviderPerson.description);

    wrapper.setState(externalProviderEntity);

    form = wrapper.find(PatientExternalProviderForm);
    expect(form).toHaveLength(1);
    expect(form.props().firstName).toBeFalsy();
    expect(form.props().lastName).toBeFalsy();
    expect(form.props().role).toBe(externalProviderEntity.role);
    expect(form.props().roleFreeText).toBe(externalProviderEntity.roleFreeText);
    expect(form.props().patientExternalOrganizationId).toBe(
      externalProviderEntity.patientExternalOrganizationId,
    );
    expect(form.props().description).toBe(externalProviderEntity.description);
  });

  it('renders an error bar if there is an error', () => {
    expect(wrapper.find(Modal).props().error).toBeFalsy();

    wrapper.setState({ saveError: 'this is messed up' });
    expect(wrapper.find(Modal).props().error).toBe('this is messed up');
  });
});
