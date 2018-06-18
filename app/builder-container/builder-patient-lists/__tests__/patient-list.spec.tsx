import { shallow } from 'enzyme';
import React from 'react';
import { FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import { patientList } from '../../../shared/util/test-data';
import PatientList from '../patient-list';

describe('Builder Patient List Row Component', () => {
  const routeBase = '/destroy/wall';

  const wrapper = shallow(
    <PatientList patientList={patientList} routeBase={routeBase} selected={false} />,
  );

  it('renders link to patient list', () => {
    expect(wrapper.find(Link).length).toBe(1);
    expect(wrapper.find(Link).props().className).toBe('container');
    expect(wrapper.find(Link).props().to).toBe(`${routeBase}/${patientList.id}`);
  });

  it('renders title of patient list', () => {
    expect(wrapper.find('.title').length).toBe(1);
    expect(wrapper.find('.title').text()).toBe(patientList.title);
  });

  it('renders answer id of patient list', () => {
    expect(wrapper.find('.dateValue').length).toBe(2);
    expect(
      wrapper
        .find('.dateValue')
        .at(0)
        .text(),
    ).toBe(patientList.answerId);
  });

  it('renders order', () => {
    expect(
      wrapper
        .find('.dateValue')
        .at(1)
        .text(),
    ).toBe(`${patientList.order}`);
  });

  it('renders relative created at', () => {
    expect(wrapper.find(FormattedRelative).length).toBe(1);
    expect(wrapper.find(FormattedRelative).props().value).toBe(patientList.createdAt);
  });

  it('applies selected styles if specified', () => {
    wrapper.setProps({ selected: true });
    expect(wrapper.find(Link).props().className).toBe('container selected');
  });
});
