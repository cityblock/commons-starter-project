import { shallow } from 'enzyme';
import * as React from 'react';
import { patient } from '../../../shared/util/test-data';
import LeftNavHeader, { IProps } from '../header';
import Contact from '../info-group/contact';
import Demographics from '../info-group/demographics';
import Medications from '../info-group/medications';
import Plan from '../info-group/plan';
import ProblemList from '../info-group/problem-list';
import LeftNav from '../left-nav';

describe('Patient Left Navigation', () => {
  const wrapper = shallow(<LeftNav patient={patient} />);

  it('renders left nav header', () => {
    expect(wrapper.find<IProps>(LeftNavHeader).props().patient).toEqual(patient);
  });

  it('renders demographics', () => {
    expect(wrapper.find(Demographics).props().patient).toEqual(patient);
    expect(wrapper.find(Demographics).props().isOpen).toBeFalsy();
  });

  it('renders contact', () => {
    expect(wrapper.find(Contact).props().patient).toEqual(patient);
    expect(wrapper.find(Contact).props().isOpen).toBeFalsy();
  });

  it('renders plan information', () => {
    expect(wrapper.find(Plan).props().patient).toEqual(patient);
    expect(wrapper.find(Plan).props().isOpen).toBeFalsy();
  });

  it('renders medications list', () => {
    expect(wrapper.find(Medications).length).toBe(1);
    expect(wrapper.find(Medications).props().isOpen).toBeFalsy();
  });

  it('renders problem list', () => {
    expect(wrapper.find(ProblemList).length).toBe(1);
    expect(wrapper.find(ProblemList).props().isOpen).toBeFalsy();
  });

  it('opens a list', () => {
    wrapper.setState({ selected: 'medications' });

    expect(wrapper.find(Medications).props().isOpen).toBeTruthy();
  });
});
