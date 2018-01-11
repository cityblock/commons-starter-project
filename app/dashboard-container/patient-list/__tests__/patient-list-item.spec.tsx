import { shallow } from 'enzyme';
import * as React from 'react';
import { formatFullName } from '../../../shared/helpers/format-helpers';
import Avatar from '../../../shared/library/avatar/avatar';
import Icon from '../../../shared/library/icon/icon';
import { patient } from '../../../shared/util/test-data';
import PatientTaskCount from '../../tasks/patient-task-count';
import { PatientListItem } from '../patient-list-item';

describe('Dashboard Patient List Item', () => {
  const placeholderFn = () => true as any;
  const wrapper = shallow(<PatientListItem patient={patient} redirectToPatient={placeholderFn} />);

  it('wraps item in link to patient profile', () => {
    expect(
      wrapper
        .find('div')
        .at(0)
        .props().className,
    ).toBe('container');
  });

  it('renders image of patient avatar', () => {
    expect(wrapper.find(Avatar).length).toBe(1);
    expect(wrapper.find(Avatar).props().borderColor).toBe('lightGray');
  });

  it('renders patient full name', () => {
    expect(wrapper.find('h4').length).toBe(1);
    expect(wrapper.find('h4').text()).toBe(formatFullName(patient.firstName, patient.lastName));
  });

  it('renders arrow link to patient profile', () => {
    expect(
      wrapper
        .find('div')
        .at(3)
        .props().className,
    ).toBe('profileLink');
  });

  it('renders arrow icon inside arrow link', () => {
    expect(wrapper.find(Icon).length).toBe(1);
    expect(wrapper.find(Icon).props().name).toBe('keyboardArrowRight');
    expect(wrapper.find(Icon).props().className).toBe('arrow');
  });

  it('does not render task count if not on patient task view', () => {
    expect(wrapper.find(PatientTaskCount).length).toBe(0);
  });

  it('renders patient task count if on patient task view', () => {
    const tasksDueCount = 11;
    const notificationsCount = 12;
    wrapper.setProps({ taskView: true, tasksDueCount, notificationsCount });

    expect(wrapper.find(PatientTaskCount).length).toBe(1);
    expect(wrapper.find(PatientTaskCount).props().tasksDueCount).toBe(tasksDueCount);
    expect(wrapper.find(PatientTaskCount).props().notificationsCount).toBe(notificationsCount);
  });

  it('applies sticky scroll styles if patient selected', () => {
    wrapper.setProps({ selected: true });

    expect(
      wrapper
        .find('div')
        .at(0)
        .props().className,
    ).toBe('container sticky');
  });
});
