import { shallow } from 'enzyme';
import React from 'react';
import MainContainer from '../main-container';
import PokemonCreate from '../pokemon-create';
import PokemonDetail from '../pokemon-detail';
import PokemonItemDetail from '../pokemon-item-detail';
import PokemonRow from '../pokemon-row';

describe('risk area assessment questions component', () => {
  const patientId = 'sansaStark';
  const routeBase = '/patients/sansaStark/assessment';
  const patientRoute = '/patients/sansaStark';
  const glassBreakId = 'lady';

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
      glassBreakId={glassBreakId}
      openSuggestionsPopup={jest.fn() as any}
      riskAreaGroupRefetch={jest.fn()}
      screeningToolsForRiskArea={[screeningTool]}
    />,
  );

  it('renders buttons to edit answers and administer tools', () => {
    expect(
      wrapper
        .find(Button)
        .at(0)
        .props().messageId,
    ).toBe('riskAreaAssessment.start');
  });

  it('renders buttons to save edits', () => {
    wrapper.setState({ inProgress: true });

    expect(wrapper.find(Button)).toHaveLength(1);
    expect(
      wrapper
        .find(Button)
        .at(0)
        .props().messageId,
    ).toBe('riskAreaAssessment.save');
  });

  it('renders back link', () => {
    expect(wrapper.find(BackLink)).toHaveLength(1);
    expect(wrapper.find(BackLink).props().href).toBe(`${routeBase}/${riskArea.riskAreaGroupId}`);
  });

  it('does not render computed field flag modal by for manual assessment', () => {
    expect(wrapper.find(ComputedFieldFlagModal)).toHaveLength(0);
  });

  it('renders computed field flag modal for automated assessments', () => {
    wrapper.setProps({ riskArea: automatedRiskArea });
    expect(wrapper.find(ComputedFieldFlagModal)).toHaveLength(1);
  });

  it('hides buttons for automated assessments', () => {
    expect(wrapper.find(Button)).toHaveLength(0);
  });

  it('renders back link for no automated assessments case', () => {
    const newRiskAreaGroup = {
      ...riskAreaGroup,
      riskAreas: [riskArea],
    };
    wrapper.setProps({ riskAreaGroup: newRiskAreaGroup });

    expect(wrapper.find(BackLink)).toHaveLength(1);
    expect(wrapper.find(BackLink).props().href).toBe(routeBase);
  });

  it('renders only required screening tools for the risk area', () => {
    const requiredTool1 = { ...screeningTool, id: 'required tool 1 id', isRequired: true };
    const requiredTool2 = { ...screeningTool, id: 'required tool 2 id', isRequired: true };
    const multiToolAssessment = shallow(
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
        glassBreakId={glassBreakId}
        openSuggestionsPopup={jest.fn() as any}
        riskAreaGroupRefetch={jest.fn()}
        screeningToolsForRiskArea={[screeningTool, requiredTool1, requiredTool2]}
      />,
    );

    expect(multiToolAssessment.find(ScreeningToolRow).length).toBe(2);
    expect(
      multiToolAssessment
        .find(ScreeningToolRow)
        .at(0)
        .props().screeningTool.id,
    ).toBe('required tool 1 id');
    expect(
      multiToolAssessment
        .find(ScreeningToolRow)
        .at(1)
        .props().screeningTool.id,
    ).toBe('required tool 2 id');
  });
});
