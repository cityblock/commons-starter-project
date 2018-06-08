import { shallow } from 'enzyme';
import * as React from 'react';
import Icon from '../../../shared/library/icon/icon';
import Text from '../../../shared/library/text/text';
import { patient } from '../../../shared/util/test-data';
import LeftNavPreferredName from '../preferred-name';

describe('Patient Left Navigation Preferred Name', () => {
  const wrapper = shallow(<LeftNavPreferredName patient={patient} />);

  it('renders container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders label for preferred name', () => {
    expect(
      wrapper
        .find(Text)
        .at(0)
        .props().messageId,
    ).toBe('patientInfo.preferredName');
    expect(
      wrapper
        .find(Text)
        .at(0)
        .props().color,
    ).toBe('gray');
    expect(
      wrapper
        .find(Text)
        .at(0)
        .props().size,
    ).toBe('large');
  });

  it('renders red icon', () => {
    expect(wrapper.find(Icon).props().name).toBe('errorOutline');
    expect(wrapper.find(Icon).props().color).toBe('red');
  });

  it('renders preferred name text', () => {
    expect(
      wrapper
        .find(Text)
        .at(1)
        .props().text,
    ).toBe(patient.patientInfo.preferredName);
    expect(
      wrapper
        .find(Text)
        .at(1)
        .props().color,
    ).toBe('black');
    expect(
      wrapper
        .find(Text)
        .at(1)
        .props().size,
    ).toBe('large');
    expect(
      wrapper
        .find(Text)
        .at(1)
        .props().isBold,
    ).toBeTruthy();
  });

  it('renders nothing if preferred name matches patient name', () => {
    const newPatient = {
      ...patient,
      patientInfo: {
        ...patient.patientInfo,
        preferredName: patient.firstName,
      },
    };

    wrapper.setProps({ patient: newPatient });

    expect(wrapper.find('.container').length).toBe(0);
    expect(wrapper.find(Text).length).toBe(0);
  });
});
