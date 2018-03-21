import { shallow } from 'enzyme';
import * as React from 'react';
import Modal from '../../../../shared/library/modal/modal';
import { externalProviderEntity, externalProviderPerson } from '../../../../shared/util/test-data';
import PatientExternalProviderForm from '../patient-external-provider-form';
import PatientExternalProviderModal, {
  IPatientExternalProvider,
} from '../patient-external-provider-modal';

describe('Render External Provider Modal Component', () => {
  const closePopup = () => true;
  const wrapper = shallow(
    <PatientExternalProviderModal
      saveExternalProvider={async (patientExternalProvider: IPatientExternalProvider) =>
        Promise.resolve()
      }
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
    expect(modal.props().submitMessageId).toBe('patientExternalProvider.save');
    expect(modal.props().errorMessageId).toBe('patientExternalProvider.saveError');
    expect(modal.props().titleMessageId).toBe('title.id');
  });

  it('renders external provider modal form without a patient external provider', () => {
    const form = wrapper.find(PatientExternalProviderForm);
    expect(form).toHaveLength(1);

    expect(form.props().emailAddress).toBe(undefined);
    expect(form.props().phoneNumber).toBe(undefined);
    expect(form.props().firstName).toBe(undefined);
    expect(form.props().lastName).toBe(undefined);
    expect(form.props().role).toBe(undefined);
    expect(form.props().roleFreeText).toBe(undefined);
    expect(form.props().agencyName).toBe(undefined);
    expect(form.props().description).toBe(undefined);
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
    expect(form.props().agencyName).toBe(externalProviderPerson.agencyName);
    expect(form.props().description).toBe(externalProviderPerson.description);

    wrapper.setState(externalProviderEntity);

    form = wrapper.find(PatientExternalProviderForm);
    expect(form).toHaveLength(1);
    expect(form.props().firstName).toBeFalsy();
    expect(form.props().lastName).toBeFalsy();
    expect(form.props().role).toBe(externalProviderEntity.role);
    expect(form.props().roleFreeText).toBe(externalProviderEntity.roleFreeText);
    expect(form.props().agencyName).toBe(externalProviderEntity.agencyName);
    expect(form.props().description).toBe(externalProviderEntity.description);
  });

  it('renders an error bar if there is an error', () => {
    expect(wrapper.find(Modal).props().error).toBeFalsy();

    wrapper.setState({ saveError: 'this is messed up' });
    expect(wrapper.find(Modal).props().error).toBe('this is messed up');
  });
});
