import { shallow } from 'enzyme';
import * as React from 'react';
import BackLink from '../../../shared/library/back-link/back-link';
import Button from '../../../shared/library/button/button';
import {
  automatedRiskArea,
  riskArea,
  riskAreaAssessmentSubmission,
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
      riskAreaId={riskArea.id}
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

  it('renders buttons to save and cancel edits', () => {
    wrapper.setState({ inProgress: true });

    expect(wrapper.find(Button).length).toBe(2);
    expect(
      wrapper
        .find(Button)
        .at(0)
        .props().messageId,
    ).toBe('riskAreaAssessment.cancel');
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
    ).toBe('riskAreaAssessment.save');
  });

  it('renders questions container', () => {
    expect(
      wrapper
        .find('.riskAreasPanel')
        .find('Connect(Apollo(Apollo(Apollo(RiskAreaAssessmentQuestions))))').length,
    ).toBe(1);
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

  it('renders back link for automated assessments', () => {
    expect(wrapper.find(BackLink).length).toBe(1);
  });

  it('hides buttons for automated assessments', () => {
    expect(wrapper.find(Button).length).toBe(0);
  });
});
