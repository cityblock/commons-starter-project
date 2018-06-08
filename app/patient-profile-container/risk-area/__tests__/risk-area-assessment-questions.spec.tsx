import { shallow } from 'enzyme';
import * as React from 'react';
import { Mutation } from 'react-apollo';
import { question, riskArea, riskAreaAssessmentSubmission } from '../../../shared/util/test-data';
import RiskAreaAssessmentHeader from '../risk-area-assessment-header';
import { RiskAreaAssessmentQuestions } from '../risk-area-assessment-questions';

describe('risk area assessment questions component', () => {
  const patientId = 'sansaStark';
  const routeBase = '/patients/sansaStark/assessment';
  const patientRoute = '/patients/sansaStark';
  const glassBreakId = 'lady';

  const wrapper = shallow(
    <RiskAreaAssessmentQuestions
      patientId={patientId}
      routeBase={routeBase}
      patientRoute={patientRoute}
      riskArea={riskArea}
      inProgress={true}
      riskAreaAssessmentSubmission={riskAreaAssessmentSubmission}
      riskAreaQuestions={[question]}
      glassBreakId={glassBreakId}
    />,
  );

  it('renders mutation that wrapps question', () => {
    expect(wrapper.find(Mutation).length).toBe(1);
  });

  it('renders risk area assessment header', () => {
    expect(wrapper.find(RiskAreaAssessmentHeader).length).toBe(1);
    expect(wrapper.find(RiskAreaAssessmentHeader).props().riskAreaId).toBe(riskArea.id);
    expect(wrapper.find(RiskAreaAssessmentHeader).props().riskAreaGroupId).toBe(
      riskArea.riskAreaGroupId,
    );
    expect(wrapper.find(RiskAreaAssessmentHeader).props().patientId).toBe(patientId);
  });
});
