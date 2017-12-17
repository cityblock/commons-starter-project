import { shallow } from 'enzyme';
import * as React from 'react';
import Button from '../../../shared/library/button/button';
import { riskArea, riskAreaAssessmentSubmission } from '../../../shared/util/test-data';
import { RiskAreaAssessment } from '../risk-area-assessment';

describe('risk area assessment questions component', () => {
  const patientId = 'sansaStark';
  const routeBase = '/patients/sansaStark/assessment';
  const patientRoute = '/patients/sansaStark';

  const wrapper = shallow(
    <RiskAreaAssessment
      patientId={patientId}
      routeBase={routeBase}
      patientRoute={patientRoute}
      riskArea={riskArea}
      riskAreaId={riskArea.id}
      riskAreaAssessmentSubmissionCreate={jest.fn() as any}
      riskAreaAssessmentSubmissionComplete={jest.fn() as any}
      riskAreaAssessmentSubmission={riskAreaAssessmentSubmission}
      riskAreaAssessmentSubmissionError={null}
    />,
  );

  it('renders top buttons', () => {
    expect(wrapper.find('.saveButton').length).toBe(1);
    expect(
      wrapper
        .find(Button)
        .at(3)
        .props().messageId,
    ).toBe('riskAreaAssessment.start');
  });

  it('renders questions container', () => {
    expect(
      wrapper
        .find('.riskAreasPanel')
        .find('Connect(Apollo(Apollo(Apollo(RiskAreaAssessmentQuestions))))').length,
    ).toBe(1);
  });
});
