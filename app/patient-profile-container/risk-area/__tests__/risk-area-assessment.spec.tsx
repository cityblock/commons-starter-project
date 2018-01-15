import { shallow } from 'enzyme';
import * as React from 'react';
import BackLink from '../../../shared/library/back-link/back-link';
import Button from '../../../shared/library/button/button';
import {
  automatedRiskArea,
  riskArea,
  riskAreaAssessmentSubmission,
  riskAreaGroup,
} from '../../../shared/util/test-data';
import ComputedFieldFlagModal from '../computed-field-flag-modal';
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
      riskAreaGroup={riskAreaGroup}
      riskAreaId={riskArea.id}
      riskAreaGroupId={riskAreaGroup.id}
      riskAreaAssessmentSubmissionCreate={jest.fn() as any}
      riskAreaAssessmentSubmissionComplete={jest.fn() as any}
      riskAreaAssessmentSubmission={riskAreaAssessmentSubmission}
      riskAreaAssessmentSubmissionError={null}
    />,
  );

  it('renders buttons to edit answers and administer tools', () => {
    expect(wrapper.find(Button).length).toBe(2);
    expect(
      wrapper
        .find(Button)
        .at(0)
        .props().messageId,
    ).toBe('riskAreaAssessment.administer');
    expect(
      wrapper
        .find(Button)
        .at(0)
        .props().color,
    ).toBe('white');
    expect(
      wrapper
        .find(Button)
        .at(1)
        .props().messageId,
    ).toBe('riskAreaAssessment.start');
  });

  it('renders buttons to save edits', () => {
    wrapper.setState({ inProgress: true });

    expect(wrapper.find(Button).length).toBe(1);
    expect(
      wrapper
        .find(Button)
        .at(0)
        .props().messageId,
    ).toBe('riskAreaAssessment.save');
  });

  it('renders back link', () => {
    expect(wrapper.find(BackLink).length).toBe(1);
    expect(wrapper.find(BackLink).props().href).toBe(`${routeBase}/${riskArea.riskAreaGroup.id}`);
  });

  it('does not render computed field flag modal by for manual assessment', () => {
    expect(wrapper.find(ComputedFieldFlagModal).length).toBe(0);
  });

  it('renders computed field flag modal for automated assessments', () => {
    wrapper.setProps({ riskArea: automatedRiskArea });
    expect(wrapper.find(ComputedFieldFlagModal).length).toBe(1);
  });

  it('hides buttons for automated assessments', () => {
    expect(wrapper.find(Button).length).toBe(0);
  });

  it('renders back link for no automated assessments case', () => {
    const newRiskAreaGroup = {
      ...riskAreaGroup,
      riskAreas: [riskArea],
    };
    wrapper.setProps({ riskAreaGroup: newRiskAreaGroup });

    expect(wrapper.find(BackLink).length).toBe(1);
    expect(wrapper.find(BackLink).props().href).toBe(routeBase);
  });
});
