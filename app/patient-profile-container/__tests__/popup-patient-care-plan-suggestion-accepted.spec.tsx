import { shallow } from 'enzyme';
import * as React from 'react';
import Modal from '../../shared/library/modal/modal';
import {
  fullCarePlanSuggestionWithConcern as concernSuggestion,
  fullCarePlanSuggestionWithGoal as goalSuggestion,
} from '../../shared/util/test-data';
import { PopupPatientCarePlanSuggestionAccepted } from '../popup-patient-care-plan-suggestion-accepted';
import PopupPatientCarePlanSuggestionAcceptedModalBody from '../popup-patient-care-plan-suggestion-accepted-modal-body';

describe('Care Plan Suggestion Accept Modal', () => {
  const placeholderFn = () => true as any;

  const wrapper = shallow(
    <PopupPatientCarePlanSuggestionAccepted
      visible={true}
      suggestion={concernSuggestion}
      taskTemplateIds={[]}
      patientId="sansaStark"
      onDismiss={placeholderFn}
      carePlanError={null}
      acceptCarePlanSuggestion={placeholderFn}
    />,
  );

  it('renders modal to accept concern', () => {
    expect(wrapper.find(Modal).props().isVisible).toBeTruthy();
    expect(wrapper.find(Modal).props().titleMessageId).toBe('carePlanSuggestion.addconcern');
    expect(wrapper.find(Modal).props().subTitleMessageId).toBeFalsy();
    expect(wrapper.find(Modal).props().submitMessageId).toBe('patient.addToCarePlan');
  });

  it('renders accept modal body', () => {
    expect(
      wrapper.find(PopupPatientCarePlanSuggestionAcceptedModalBody).props().suggestion,
    ).toEqual(concernSuggestion);
  });

  it('renders modal to accept goal', () => {
    wrapper.setProps({ suggestion: goalSuggestion });

    expect(wrapper.find(Modal).props().titleMessageId).toBe('carePlanSuggestion.addgoal');
    expect(wrapper.find(Modal).props().subTitleMessageId).toBe('carePlanSuggestion.addgoalSub');
  });

  it('closes modal', () => {
    wrapper.setProps({ visible: false });

    expect(wrapper.find(Modal).props().isVisible).toBeFalsy();
  });
});
