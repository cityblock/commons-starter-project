import { shallow } from 'enzyme';
import * as React from 'react';
import EmptyPlaceholder from '../../../shared/library/empty-placeholder/empty-placeholder';
import TextDivider from '../../../shared/library/text-divider/text-divider';
import { riskArea } from '../../../shared/util/test-data';
import DomainAssessment from '../domain-assessment';
import DomainAssessmentsList from '../domain-assessments-list';

describe('Patient 360 Domain Assessments List', () => {
  const routeBase = '/the/wall';
  const assessmentType = 'manual';
  const wrapper = shallow(
    <DomainAssessmentsList routeBase={routeBase} assessmentType={assessmentType} riskAreas={[]} />,
  );

  it('renders text divider for assessments', () => {
    expect(wrapper.find(TextDivider).length).toBe(1);
    expect(wrapper.find(TextDivider).props().color).toBe('gray');
    expect(wrapper.find(TextDivider).props().messageId).toBe(`threeSixty.${assessmentType}Detail`);
  });

  it('renders empty placeholder if list is empty', () => {
    expect(wrapper.find(EmptyPlaceholder).length).toBe(1);
    expect(wrapper.find(EmptyPlaceholder).props().headerMessageId).toBe(
      `threeSixty.${assessmentType}Empty`,
    );
  });

  it('renders domain assessment if risk area(s) given', () => {
    wrapper.setProps({ riskAreas: [riskArea] });
    expect(wrapper.find(EmptyPlaceholder).length).toBe(0);
    expect(wrapper.find(DomainAssessment).length).toBe(1);
    expect(wrapper.find(DomainAssessment).props().routeBase).toBe(routeBase);
    expect(wrapper.find(DomainAssessment).props().riskArea).toEqual(riskArea);
  });
});
