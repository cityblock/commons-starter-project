import { Document, Page, View } from '@react-pdf/core';
import { shallow } from 'enzyme';
import * as React from 'react';
import {
  patient,
  patientConcern,
  patientConcernActive,
  userForCareTeam,
} from '../../../shared/util/test-data';
import Divider from '../../shared/divider';
import Footer from '../../shared/footer';
import Header from '../../shared/header';
import Concern from '../concern';
import Goal from '../goal';
import Info from '../info';
import PrintableMap from '../printable-map';
import Task from '../task';

describe('Printable MAP Component', () => {
  const profilePhotoUrl = '/lady/of/winterfell.com';

  const wrapper = shallow(
    <PrintableMap
      patient={patient}
      carePlan={[patientConcern, patientConcernActive]}
      careTeam={[userForCareTeam]}
      profilePhotoUrl={profilePhotoUrl}
    />,
  );

  it('renders document', () => {
    expect(wrapper.find(Document).length).toBe(1);
  });

  it('renders page', () => {
    expect(wrapper.find(Page).length).toBe(1);
  });

  it('renders container', () => {
    expect(wrapper.find(View).length).toBe(1);
  });

  it('renders header', () => {
    expect(wrapper.find(Header).length).toBe(1);
  });

  it('renders divider', () => {
    expect(wrapper.find(Divider).props().color).toBe('darkGray');
  });

  it('renders information about MAP', () => {
    expect(wrapper.find(Info).props().patient).toEqual(patient);
    expect(wrapper.find(Info).props().profilePhotoUrl).toBe(profilePhotoUrl);
    expect(wrapper.find(Info).props().careTeam).toEqual([userForCareTeam]);
    expect(wrapper.find(Info).props().carePlan).toEqual([patientConcernActive]);
  });

  it('renders concern', () => {
    expect(wrapper.find(Concern).props().patientConcern).toBe(patientConcernActive);
    expect(wrapper.find(Concern).props().index).toBe(0);
  });

  it('renders goal', () => {
    expect(wrapper.find(Goal).props().patientGoal).toBe(patientConcernActive.patientGoals[0]);
  });

  it('renders task', () => {
    const task = patientConcernActive.patientGoals[0].tasks[0];

    expect(wrapper.find(Task).props().task).toBe(task);
    expect(wrapper.find(Task).props().isLastInConcern).toBeTruthy();
  });

  it('renders footer', () => {
    expect(wrapper.find(Footer).props().patient).toEqual(patient);
  });
});
