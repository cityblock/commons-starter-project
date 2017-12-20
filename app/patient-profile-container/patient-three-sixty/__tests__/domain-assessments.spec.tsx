import { shallow } from 'enzyme';
import * as React from 'react';
import BackLink from '../../../shared/library/back-link/back-link';
import Spinner from '../../../shared/library/spinner/spinner';
import UnderlineTabs from '../../../shared/library/underline-tabs/underline-tabs';
import { riskAreaGroup } from '../../../shared/util/test-data';
import { DomainAssessments } from '../domain-assessments';
import DomainAssessmentsList from '../domain-assessments-list';

describe('Patient 360 Domain Assessments Container', () => {
  const routeBase = '/dothraki/sea';
  const patientId = 'khalDrogo';
  const riskAreaGroupId = 'dothrakiScreamers';

  const wrapper = shallow(
    <DomainAssessments
      routeBase={routeBase}
      patientId={patientId}
      riskAreaGroupId={riskAreaGroupId}
      riskAreaGroup={riskAreaGroup}
    />,
  );

  it('renders navigation', () => {
    expect(wrapper.find(UnderlineTabs).length).toBe(1);
    expect(wrapper.find(BackLink).length).toBe(1);
    expect(wrapper.find(BackLink).props().href).toBe(routeBase);
    expect(wrapper.find(BackLink).props().messageId).toBe('threeSixty.back');
  });

  it('renders domain assessments list for automated assessments', () => {
    expect(wrapper.find(DomainAssessmentsList).length).toBe(2);
    expect(
      wrapper
        .find(DomainAssessmentsList)
        .at(0)
        .props().routeBase,
    ).toBe(`${routeBase}/${riskAreaGroupId}`);
    expect(
      wrapper
        .find(DomainAssessmentsList)
        .at(0)
        .props().assessmentType,
    ).toBe('automated');
  });

  it('renders domain assessments list for manual assessments', () => {
    expect(
      wrapper
        .find(DomainAssessmentsList)
        .at(1)
        .props().routeBase,
    ).toBe(`${routeBase}/${riskAreaGroupId}`);
    expect(
      wrapper
        .find(DomainAssessmentsList)
        .at(1)
        .props().assessmentType,
    ).toBe('manual');
  });

  it('renders loading spinner if loading', () => {
    wrapper.setProps({ loading: true });
    expect(wrapper.find(Spinner).length).toBe(1);
  });
});
