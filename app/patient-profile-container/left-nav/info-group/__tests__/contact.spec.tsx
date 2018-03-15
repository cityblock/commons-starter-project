import { shallow } from 'enzyme';
import { capitalize } from 'lodash';
import * as React from 'react';
import {
  formatAddressFirstLine,
  formatAddressSecondLine,
} from '../../../../shared/helpers/format-helpers';
import { patient } from '../../../../shared/util/test-data';
import Contact from '../contact';
import InfoGroupContainer from '../container';
import InfoGroupHeader from '../header';
import InfoGroupItem from '../item';

describe('Patient Left Navigation Contact Accordion', () => {
  const wrapper = shallow(<Contact patient={patient} onClick={() => true as any} isOpen={false} />);

  it('renders container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders header with contact label', () => {
    expect(wrapper.find(InfoGroupHeader).props().selected).toBe('contact');
    expect(wrapper.find(InfoGroupHeader).props().isOpen).toBeFalsy();
  });

  it('renders info group container', () => {
    expect(wrapper.find(InfoGroupContainer).props().isOpen).toBeFalsy();
  });

  it('renders info group item for phone', () => {
    expect(wrapper.find(InfoGroupItem).length).toBe(5);

    expect(
      wrapper
        .find(InfoGroupItem)
        .at(0)
        .props().labelMessageId,
    ).toBe('contact.phone');
    expect(
      wrapper
        .find(InfoGroupItem)
        .at(0)
        .props().value,
    ).toBe(patient.patientInfo.primaryPhone.phoneNumber);
    expect(
      wrapper
        .find(InfoGroupItem)
        .at(0)
        .props().emptyValueMessageId,
    ).toBe('patientInfo.notOnFile');
  });

  it('renders info group item for email', () => {
    expect(
      wrapper
        .find(InfoGroupItem)
        .at(1)
        .props().labelMessageId,
    ).toBe('contact.email');
    expect(
      wrapper
        .find(InfoGroupItem)
        .at(1)
        .props().value,
    ).toBe(patient.patientInfo.primaryEmail.emailAddress);
    expect(
      wrapper
        .find(InfoGroupItem)
        .at(1)
        .props().emptyValueMessageId,
    ).toBe('patientInfo.notOnFile');
  });

  it('renders info group item for preferred contact method', () => {
    expect(
      wrapper
        .find(InfoGroupItem)
        .at(2)
        .props().labelMessageId,
    ).toBe('contact.preferredMethod');
    expect(
      wrapper
        .find(InfoGroupItem)
        .at(2)
        .props().value,
    ).toBe(capitalize(patient.patientInfo.preferredContactMethod));
    expect(
      wrapper
        .find(InfoGroupItem)
        .at(2)
        .props().emptyValueMessageId,
    ).toBeFalsy();
  });

  it('renders info group item for address line 1', () => {
    expect(
      wrapper
        .find(InfoGroupItem)
        .at(3)
        .props().labelMessageId,
    ).toBe('contact.address');
    expect(
      wrapper
        .find(InfoGroupItem)
        .at(3)
        .props().value,
    ).toBe(formatAddressFirstLine(patient.patientInfo.primaryAddress));
    expect(
      wrapper
        .find(InfoGroupItem)
        .at(3)
        .props().emptyValueMessageId,
    ).toBe('patientInfo.notOnFile');
  });

  it('renders info group for address line 2', () => {
    expect(
      wrapper
        .find(InfoGroupItem)
        .at(4)
        .props().labelMessageId,
    ).toBeNull();
    expect(
      wrapper
        .find(InfoGroupItem)
        .at(4)
        .props().value,
    ).toBe(formatAddressSecondLine(patient.patientInfo.primaryAddress));
    expect(
      wrapper
        .find(InfoGroupItem)
        .at(4)
        .props().emptyValueMessageId,
    ).toBe('patientInfo.notOnFile');
  });

  it('does not render info group for address line 2 if no address', () => {
    const newPatient = {
      ...patient,
      patientInfo: {
        ...patient.patientInfo,
        primaryAddress: null,
      },
    };

    wrapper.setProps({ patient: newPatient });

    expect(wrapper.find(InfoGroupItem).length).toBe(4);
    expect(
      wrapper
        .find(InfoGroupItem)
        .at(3)
        .props().value,
    ).toBeNull();
  });

  it('opens accordion', () => {
    wrapper.setProps({ isOpen: true });

    expect(wrapper.find(InfoGroupHeader).props().isOpen).toBeTruthy();
    expect(wrapper.find(InfoGroupContainer).props().isOpen).toBeTruthy();
  });
});
