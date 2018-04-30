import { shallow } from 'enzyme';
import * as React from 'react';
import { Link } from 'react-router-dom';
import DateInfo from '../../../shared/library/date-info/date-info';
import {
  answer,
  patientAnswer,
  question,
  riskArea as rawRiskArea,
  riskAreaAssessmentSubmission,
} from '../../../shared/util/test-data';
import { DomainAssessment } from '../domain-assessment';

describe('Patient 360 Domain Assessment List Item', () => {
  const routeBase = '/winterfell';
  const riskArea = {
    ...rawRiskArea,
    questions: [
      {
        ...question,
        answers: [
          {
            ...answer,
            patientAnswers: [patientAnswer],
          },
        ],
      },
    ],
    riskAreaAssessmentSubmissions: [riskAreaAssessmentSubmission],
    lastUpdated: patientAnswer.updatedAt,
    forceHighRisk: false,
    totalScore: 10,
    riskScore: 'low' as any,
    summaryText: [answer.summaryText],
  };

  const wrapper = shallow(
    <DomainAssessment
      routeBase={routeBase}
      riskArea={riskArea}
      suppressed={false}
      markAsSuppressed={() => true as any}
    />,
  );

  it('renders container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders link to individual assessment', () => {
    expect(wrapper.find(Link).length).toBe(1);
    expect(wrapper.find(Link).props().to).toBe(`${routeBase}/assessment/${riskArea.id}`);
    expect(wrapper.find(Link).props().className).toBe('link');
  });

  it('renders title of risk area', () => {
    expect(wrapper.find('h2').length).toBe(1);
    expect(wrapper.find('h2').text()).toBe(riskArea.title);
  });

  it('applies border styles if answered', () => {
    expect(
      wrapper
        .find('div')
        .at(0)
        .props().className,
    ).toBe('container greenBorder');
  });

  it('renders dates for creation and update', () => {
    expect(wrapper.find(DateInfo).length).toBe(2);
    expect(
      wrapper
        .find(DateInfo)
        .at(0)
        .props().messageId,
    ).toBe('threeSixty.initialAssessment');
    expect(
      wrapper
        .find(DateInfo)
        .at(0)
        .props().date,
    ).toBe(riskAreaAssessmentSubmission.createdAt);
    expect(
      wrapper
        .find(DateInfo)
        .at(1)
        .props().label,
    ).toBe('updated');
    expect(
      wrapper
        .find(DateInfo)
        .at(1)
        .props().date,
    ).toBe(patientAnswer.updatedAt);
  });

  it('renders summary text', () => {
    expect(wrapper.find('.detail').length).toBe(1);
    expect(wrapper.find('.detail').text()).toBe(answer.summaryText);
  });

  it('handles assessment detail view properly', () => {
    wrapper.setProps({ assessmentDetailView: true });
    expect(wrapper.find('.detail').length).toBe(0);
    expect(
      wrapper
        .find('div')
        .at(0)
        .props().className,
    ).toBe('container noLink');
  });

  it('renders nothing if suppressed', () => {
    wrapper.setProps({ suppressed: true });
    expect(wrapper.find('div').length).toBe(0);
  });
});
