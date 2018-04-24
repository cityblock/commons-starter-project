import { shallow } from 'enzyme';
import { capitalize } from 'lodash';
import * as React from 'react';
import {
  formatAge,
  formatPatientNameForProfile,
  getPatientStatusColor,
} from '../../../shared/helpers/format-helpers';
import PatientPhoto from '../../../shared/library/patient-photo/patient-photo';
import SmallText from '../../../shared/library/small-text/small-text';
import { patient } from '../../../shared/util/test-data';
import { LeftNavHeader } from '../header';
import PatientNeedToKnow, { IProps } from '../patient-need-to-know';
import LeftNavPreferredName from '../preferred-name';

describe('Patient Left Navigation Header', () => {
  const wrapper = shallow(<LeftNavHeader patient={patient} latestProgressNote={null} />);

  it('renders container with no border if no latest progress note', () => {
    expect(wrapper.find('.container').props().className).toBe('container');
  });

  it('renders patient photo', () => {
    expect(wrapper.find(PatientPhoto).props().patientId).toBe(patient.id);
    expect(wrapper.find(PatientPhoto).props().hasUploadedPhoto).toBe(
      patient.patientInfo.hasUploadedPhoto,
    );
    expect(wrapper.find(PatientPhoto).props().gender).toBe(patient.patientInfo.gender);
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
    ).toBe(getPatientStatusColor(patient.patientState.currentState));
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
    expect(wrapper.find<IProps>(PatientNeedToKnow as any).props().patientInfoId).toBe(
      patient.patientInfo.id,
    );
  });

  it('renders colored border if worry score present', () => {
    const latestProgressNote = {
      id: 'winterIsComing',
      worryScore: 3,
    };
    wrapper.setProps({ latestProgressNote });

    expect(wrapper.find('.container').props().className).toBe('container redBorder');
  });

  it('renders nothing if patient is null', () => {
    wrapper.setProps({ patient: null });

    expect(wrapper.find('.container').length).toBe(0);
    expect(wrapper.find(SmallText).length).toBe(0);
  });
});
