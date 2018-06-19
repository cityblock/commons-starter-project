import { shallow } from 'enzyme';
import React from 'react';
import Modal from '../../../../shared/library/modal/modal';
import { externalOrganization, externalOrganization2 } from '../../../../shared/util/test-data';
import PatientExternalOrganizationForm from '../patient-external-organization-form';
import PatientExternalOrganizationModal from '../patient-external-organization-modal';

describe('Render External Organization Modal Component', () => {
  const closePopup = () => true;
  const wrapper = shallow(
    <PatientExternalOrganizationModal
      patientId={externalOrganization2.patientId}
      saveExternalOrganization={jest.fn()}
      closePopup={closePopup}
      isVisible={false}
      titleMessageId="title.id"
    />,
  );

  it('renders external organization modal popup', () => {
    const modal = wrapper.find(Modal);
    expect(modal).toHaveLength(1);
    expect(modal.props().visible).toBeFalsy();
    expect(modal.props().closePopup).not.toBe(closePopup);
    expect(modal.props().cancelMessageId).toBe('patientExternalOrganization.cancel');
    expect(modal.props().errorMessageId).toBe('patientExternalOrganization.saveError');
    expect(modal.props().titleMessageId).toBe('title.id');
  });

  it('renders external organization modal form with a patient external organization', () => {
    wrapper.setProps({ patientExternalOrganization: externalOrganization2 });

    let form = wrapper.find(PatientExternalOrganizationForm);
    expect(form).toHaveLength(1);

    expect(form.props().name).toBe(externalOrganization2.name);
    expect(form.props().phoneNumber).toBe(externalOrganization2.phoneNumber);
    expect(form.props().faxNumber).toBe(externalOrganization2.faxNumber);
    expect(form.props().street1).toBe(externalOrganization2.address.street1);
    expect(form.props().street2).toBe(externalOrganization2.address.street2);
    expect(form.props().city).toBe(externalOrganization2.address.city);
    expect(form.props().state).toBe(externalOrganization2.address.state);
    expect(form.props().zip).toBe(externalOrganization2.address.zip);
    expect(form.props().description).toBe(externalOrganization2.description);

    wrapper.setState({
      ...externalOrganization,
      street1: null,
      street2: null,
      state: null,
      city: null,
      zip: null,
    });

    form = wrapper.find(PatientExternalOrganizationForm);
    expect(form).toHaveLength(1);
    expect(form.props().name).toBe(externalOrganization.name);
    expect(form.props().phoneNumber).toBeFalsy();
    expect(form.props().faxNumber).toBeFalsy();
    expect(form.props().street1).toBeFalsy();
    expect(form.props().street2).toBeFalsy();
    expect(form.props().city).toBeFalsy();
    expect(form.props().state).toBeFalsy();
    expect(form.props().zip).toBeFalsy();
    expect(form.props().description).toBeFalsy();
  });

  it('renders an error bar if there is an error', () => {
    expect(wrapper.find(Modal).props().error).toBeFalsy();

    wrapper.setState({ saveError: 'this is messed up' });
    expect(wrapper.find(Modal).props().error).toBe('this is messed up');
  });
});
