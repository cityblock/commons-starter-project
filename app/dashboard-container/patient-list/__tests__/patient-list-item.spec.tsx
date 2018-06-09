import { shallow } from 'enzyme';
import * as React from 'react';
import { formatFullName } from '../../../shared/helpers/format-helpers';
import PatientPhoto from '../../../shared/library/patient-photo/patient-photo';
import { patient } from '../../../shared/util/test-data';
import { PatientListItem } from '../patient-list-item';
import PatientListItemBody from '../patient-list-item-body';

describe('Dashboard Patient List Item', () => {
  const history = { push: jest.fn() } as any;
  const location = {} as any;
  const match = {} as any;
  const wrapper = shallow(
    <PatientListItem
      openMessages={jest.fn()}
      match={match}
      location={location}
      history={history}
      patient={patient}
    />,
  );

  it('wraps item in link to patient profile', () => {
    expect(
      wrapper
        .find('div')
        .at(0)
        .props().className,
    ).toBe('container');
  });

  it('renders patient profile photo', () => {
    expect(wrapper.find(PatientPhoto).length).toBe(1);
    expect(wrapper.find(PatientPhoto).props().patientId).toBe(patient.id);
    expect(wrapper.find(PatientPhoto).props().type).toBe('circle');
    expect(wrapper.find(PatientPhoto).props().gender).toBe(patient.patientInfo.gender);
    expect(wrapper.find(PatientPhoto).props().hasUploadedPhoto).toBe(
      patient.patientInfo.hasUploadedPhoto,
    );
  });

  it('renders patient full name', () => {
    expect(wrapper.find('h4').length).toBe(1);
    expect(wrapper.find('h4').text()).toBe(formatFullName(patient.firstName, patient.lastName));
  });

  it('renders patient list item body', () => {
    expect(wrapper.find(PatientListItemBody).props().patient).toEqual(patient);
    expect(wrapper.find(PatientListItemBody).props().displayType).toBeFalsy();
    expect(wrapper.find(PatientListItemBody).props().tasksDueCount).toBeFalsy();
    expect(wrapper.find(PatientListItemBody).props().notificationsCount).toBeFalsy();
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

  it('passes props for display type, tasks due, and notifications to body', () => {
    const tasksDueCount = 11;
    const notificationsCount = 12;
    wrapper.setProps({ displayType: 'task', tasksDueCount, notificationsCount });

    expect(wrapper.find(PatientListItemBody).props().displayType).toBe('task');
    expect(wrapper.find(PatientListItemBody).props().tasksDueCount).toBe(tasksDueCount);
    expect(wrapper.find(PatientListItemBody).props().notificationsCount).toBe(notificationsCount);
  });
});
