import { shallow } from 'enzyme';
import * as React from 'react';
import PatientQuestion from '../../../shared/question/patient-question';
import { question, riskArea, riskAreaAssessmentSubmission } from '../../../shared/util/test-data';
import { RiskAreaAssessmentQuestions } from '../risk-area-assessment-questions';

describe('risk area assessment questions component', () => {
  const patientId = 'sansaStark';
  const routeBase = '/patients/sansaStark/assessment';
  const patientRoute = '/patients/sansaStark';

  const wrapper = shallow(
    <RiskAreaAssessmentQuestions
      patientId={patientId}
      routeBase={routeBase}
      patientRoute={patientRoute}
      riskArea={riskArea}
      inProgress={true}
      riskAreaAssessmentSubmission={riskAreaAssessmentSubmission}
      riskAreaQuestions={[question]}
    />,
  );

  it('renders risk area', () => {
    expect(wrapper.find('.titleText').length).toBe(1);
  });

  it('renders question', () => {
    expect(wrapper.find(PatientQuestion).length).toBe(1);
  });
});
