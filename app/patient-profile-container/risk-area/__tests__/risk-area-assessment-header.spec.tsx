import { shallow } from 'enzyme';
import * as React from 'react';
import {
  riskArea as rawRiskArea,
  riskAreaGroup as rawRiskAreaGroup,
} from '../../../shared/util/test-data';
import DomainAssessment from '../../patient-three-sixty/domain-assessment';
import { RiskAreaAssessmentHeader } from '../risk-area-assessment-header';

describe('Risk Area Assessment Header', () => {
  const patientId = 'jonSnow';
  const riskArea = {
    ...rawRiskArea,
    riskAreaAssessmentSubmissions: [],
  };
  const riskAreaGroup = {
    ...rawRiskAreaGroup,
    riskAreas: [
      {
        ...riskArea,
      },
    ],
  };

  const wrapper = shallow(
    <RiskAreaAssessmentHeader
      patientId={patientId}
      riskAreaGroupId={riskArea.riskAreaGroup.id}
      riskAreaId={riskArea.id}
      riskAreaGroup={riskAreaGroup}
    />,
  );

  it('renders domain assessment with correct risk area', () => {
    expect(wrapper.find(DomainAssessment).length).toBe(1);
    expect(wrapper.find(DomainAssessment).props().routeBase).toBeNull();
    expect(wrapper.find(DomainAssessment).props().riskArea).toEqual(riskArea);
    expect(wrapper.find(DomainAssessment).props().suppressed).toBeFalsy();
    expect(wrapper.find(DomainAssessment).props().assessmentDetailView).toBeTruthy();
  });
});
