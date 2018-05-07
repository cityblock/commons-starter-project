import { shallow } from 'enzyme';
import * as React from 'react';
import SmallText from '../../../shared/library/small-text/small-text';
import { patient } from '../../../shared/util/test-data';
import { LeftNavHeader } from '../header';
import LeftNavHeaderPatient from '../header-patient';
import PatientNeedToKnow, { IProps } from '../patient-need-to-know';
import LeftNavPreferredName from '../preferred-name';

describe('Patient Left Navigation Header', () => {
  const wrapper = shallow(
    <LeftNavHeader patient={patient} latestProgressNote={null} isWidgetOpen={false} />,
  );

  it('renders white border if no worry score', () => {
    expect(wrapper.find('.border').props().className).toBe('border');
  });

  it('renders container', () => {
    expect(wrapper.find('.container').props().className).toBe('container');
  });

  it('renders patient header', () => {
    expect(wrapper.find(LeftNavHeaderPatient).props().patient).toEqual(patient);
    expect(wrapper.find(LeftNavHeaderPatient).props().isWidgetOpen).toBeFalsy();
  });

  it('renders need to know divider', () => {
    expect(wrapper.find('.divider').length).toBe(2);
    expect(wrapper.find(SmallText).props().messageId).toBe('patientInfo.needToKnow');
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

    expect(wrapper.find('.border').props().className).toBe('border redBorder');
  });

  it('renders smaller border if widget open', () => {
    wrapper.setProps({ isWidgetOpen: true });

    expect(wrapper.find('.border').props().className).toBe('border redBorder smallBorder');
  });

  it('indicates to patient info header that widget is open', () => {
    expect(wrapper.find(LeftNavHeaderPatient).props().isWidgetOpen).toBeTruthy();
  });

  it('renders nothing if patient is null', () => {
    wrapper.setProps({ patient: null });

    expect(wrapper.find('.container').length).toBe(0);
    expect(wrapper.find(SmallText).length).toBe(0);
  });
});
