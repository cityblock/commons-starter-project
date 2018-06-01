import { shallow } from 'enzyme';
import * as React from 'react';
import Modal from '../../../shared/library/modal/modal';
import { healthcareProxy } from '../../../shared/util/test-data';
import PatientContactModal from '../patient-contact-modal';
import PatientProxyForm from '../patient-proxy-form';

describe('Render Proxy Modal Component', () => {
  const closePopup = () => true;
  const wrapper = shallow(
    <PatientContactModal
      saveContact={jest.fn()}
      closePopup={closePopup}
      onSaved={(response: any) => true}
      isVisible={false}
      titleMessageId="title.id"
      contactType="healthcareProxy"
    />,
  );

  it('renders proxy modal popup', () => {
    expect(wrapper.find(Modal)).toHaveLength(1);
    expect(wrapper.find(Modal).props().visible).toBeFalsy();
    expect(wrapper.find(Modal).props().closePopup).not.toBe(closePopup);
    expect(wrapper.find(Modal).props().cancelMessageId).toBe('patientContact.cancel');
    expect(wrapper.find(Modal).props().submitMessageId).toBe('patientContact.save');
    expect(wrapper.find(Modal).props().errorMessageId).toBe('patientContact.saveError');
    expect(wrapper.find(Modal).props().titleMessageId).toBe('title.id');
  });

  it('renders proxy modal form without a patient contact', () => {
    expect(wrapper.find(PatientProxyForm)).toHaveLength(1);
    expect(wrapper.find(PatientProxyForm).props().emailAddress).toBe(undefined);
    expect(wrapper.find(PatientProxyForm).props().phoneNumber).toBe(undefined);
    expect(wrapper.find(PatientProxyForm).props().firstName).toBe(undefined);
    expect(wrapper.find(PatientProxyForm).props().lastName).toBe(undefined);
    expect(wrapper.find(PatientProxyForm).props().relationToPatient).toBe(undefined);
    expect(wrapper.find(PatientProxyForm).props().description).toBe(undefined);
  });

  it.only('renders proxy modal form with a healthcare proxy patient contact', () => {
    wrapper.setProps({ patientContact: healthcareProxy });

    expect(wrapper.find(PatientProxyForm)).toHaveLength(1);
    expect(wrapper.find(PatientProxyForm).props().emailAddress).toBe(
      healthcareProxy.email.emailAddress,
    );
    expect(wrapper.find(PatientProxyForm).props().phoneNumber).toBe(
      healthcareProxy.phone.phoneNumber,
    );
    expect(wrapper.find(PatientProxyForm).props().firstName).toBe(healthcareProxy.firstName);
    expect(wrapper.find(PatientProxyForm).props().lastName).toBe(healthcareProxy.lastName);
    expect(wrapper.find(PatientProxyForm).props().relationToPatient).toBe(
      healthcareProxy.relationToPatient,
    );
    expect(wrapper.find(PatientProxyForm).props().description).toBe(healthcareProxy.description);

    wrapper.setState({
      firstName: 'Liza',
      lastName: 'Jane',
      relationToPatient: 'sister',
      emailAddress: 'liza@jane.com',
      phoneNumber: '111-111-1111',
      description: 'edited contact',
    });

    expect(wrapper.find(PatientProxyForm)).toHaveLength(1);
    expect(wrapper.find(PatientProxyForm).props().firstName).toBe('Liza');
    expect(wrapper.find(PatientProxyForm).props().lastName).toBe('Jane');
    expect(wrapper.find(PatientProxyForm).props().relationToPatient).toBe('sister');
    expect(wrapper.find(PatientProxyForm).props().phoneNumber).toBe('111-111-1111');
    expect(wrapper.find(PatientProxyForm).props().emailAddress).toBe('liza@jane.com');
    expect(wrapper.find(PatientProxyForm).props().description).toBe('edited contact');
  });

  it('renders an error bar if there is an error', () => {
    expect(wrapper.find(Modal).props().error).toBeFalsy();

    wrapper.setState({ saveError: 'this is messed up' });
    expect(wrapper.find(Modal).props().error).toBe('this is messed up');
  });
});
