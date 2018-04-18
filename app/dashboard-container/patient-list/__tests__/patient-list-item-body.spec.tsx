import { shallow } from 'enzyme';
import { capitalize } from 'lodash';
import * as React from 'react';
import { formatCityblockId, getPatientStatusColor } from '../../../shared/helpers/format-helpers';
import Icon from '../../../shared/library/icon/icon';
import PatientAge from '../../../shared/library/patient-age/patient-age';
import SmallText from '../../../shared/library/small-text/small-text';
import { patient } from '../../../shared/util/test-data';
import PatientTaskCount from '../../tasks/patient-task-count';
import PatientListItemBody from '../patient-list-item-body';

describe('Dashboard Patient List Item Body', () => {
  const wrapper = shallow(<PatientListItemBody patient={patient} onClick={() => true as any} />);

  it('renders formatted cityblock ID', () => {
    expect(wrapper.find(SmallText).length).toBe(2);

    expect(
      wrapper
        .find(SmallText)
        .at(0)
        .props().text,
    ).toBe(formatCityblockId(patient.cityblockId));
    expect(
      wrapper
        .find(SmallText)
        .at(0)
        .props().color,
    ).toBe('black');
  });

  it('renders patient status', () => {
    expect(
      wrapper
        .find(SmallText)
        .at(1)
        .props().text,
    ).toBe(capitalize(patient.patientState.currentState));
    expect(
      wrapper
        .find(SmallText)
        .at(1)
        .props().color,
    ).toBe(getPatientStatusColor(patient.patientState.currentState));
  });

  it('renders arrow link to patient profile', () => {
    expect(
      wrapper
        .find('div')
        .at(1)
        .props().className,
    ).toBe('profileLink');
  });

  it('renders arrow icon inside arrow link', () => {
    expect(wrapper.find(Icon).length).toBe(1);
    expect(wrapper.find(Icon).props().name).toBe('keyboardArrowRight');
    expect(wrapper.find(Icon).props().className).toBe('arrow');
  });

  it('renders patient age information', () => {
    expect(wrapper.find(PatientAge).length).toBe(1);
    expect(wrapper.find(PatientAge).props().dateOfBirth).toBe(patient.dateOfBirth);
    expect(wrapper.find(PatientAge).props().gender).toBe(patient.patientInfo.gender);
  });

  it('does not render task count if not on patient task view', () => {
    expect(wrapper.find(PatientTaskCount).length).toBe(0);
  });

  it('does not render cityblock id or status if conversations view', () => {
    wrapper.setProps({ displayType: 'conversations' });

    expect(wrapper.find(SmallText).length).toBe(0);
  });

  it('renders patient task count if on patient task view', () => {
    const tasksDueCount = 11;
    const notificationsCount = 12;
    wrapper.setProps({ displayType: 'task', tasksDueCount, notificationsCount });

    expect(wrapper.find(PatientTaskCount).length).toBe(1);
    expect(wrapper.find(PatientTaskCount).props().tasksDueCount).toBe(tasksDueCount);
    expect(wrapper.find(PatientTaskCount).props().notificationsCount).toBe(notificationsCount);

    expect(wrapper.find(PatientAge).length).toBe(0);
  });
});
