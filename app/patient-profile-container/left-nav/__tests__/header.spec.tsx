import { shallow } from 'enzyme';
import { capitalize } from 'lodash';
import * as React from 'react';
import { formatAge, formatPatientNameForProfile } from '../../../shared/helpers/format-helpers';
import Avatar from '../../../shared/library/avatar/avatar';
import SmallText from '../../../shared/library/small-text/small-text';
import { patient } from '../../../shared/util/test-data';
import LeftNavHeader from '../header';
import PatientNeedToKnow, { IProps } from '../patient-need-to-know';
import LeftNavPreferredName from '../preferred-name';

describe('Patient Left Navigation Header', () => {
  const wrapper = shallow(<LeftNavHeader patient={patient} />);

  it('renders container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders patient avatar', () => {
    expect(wrapper.find(Avatar).props().avatarType).toBe('patient');
    expect(wrapper.find(Avatar).props().size).toBe('xxLarge');
  });

  it('renders text for patient state', () => {
    expect(
      wrapper
        .find(SmallText)
        .at(0)
        .props().text,
    ).toBe(capitalize(patient.patientState.currentState));
    expect(
      wrapper
        .find(SmallText)
        .at(0)
        .props().color,
    ).toBe('green');
    expect(
      wrapper
        .find(SmallText)
        .at(0)
        .props().size,
    ).toBe('medium');
    expect(
      wrapper
        .find(SmallText)
        .at(0)
        .props().isBold,
    ).toBeTruthy();
  });

  it('renders patient name', () => {
    expect(wrapper.find('h1').text()).toBe(formatPatientNameForProfile(patient));
  });

  it('renders patient age', () => {
    expect(
      wrapper
        .find(SmallText)
        .at(1)
        .props().messageId,
    ).toBe('patientInfo.age');
    expect(
      wrapper
        .find(SmallText)
        .at(1)
        .props().messageValues,
    ).toEqual({ age: formatAge(patient.dateOfBirth) });
    expect(
      wrapper
        .find(SmallText)
        .at(1)
        .props().size,
    ).toBe('large');
    expect(
      wrapper
        .find(SmallText)
        .at(1)
        .props().color,
    ).toBe('black');
    expect(
      wrapper
        .find(SmallText)
        .at(1)
        .props().isBold,
    ).toBeTruthy();
  });

  it('renders need to know divider', () => {
    expect(wrapper.find('.divider').length).toBe(2);
    expect(
      wrapper
        .find(SmallText)
        .at(2)
        .props().messageId,
    ).toBe('patientInfo.needToKnow');
  });

  it('renders preferred name component', () => {
    expect(wrapper.find(LeftNavPreferredName).props().patient).toEqual(patient);
  });

  it('renders need to know field', () => {
    expect(wrapper.find<IProps>(PatientNeedToKnow).props().patientId).toBe(patient.id);
  });

  it('renders nothing if patient is null', () => {
    wrapper.setProps({ patient: null });

    expect(wrapper.find('.container').length).toBe(0);
    expect(wrapper.find(SmallText).length).toBe(0);
  });
});
