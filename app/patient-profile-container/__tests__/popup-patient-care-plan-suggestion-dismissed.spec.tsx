import { shallow } from 'enzyme';
import * as React from 'react';
import Modal from '../../shared/library/modal/modal';
import Option from '../../shared/library/option/option';
import Select from '../../shared/library/select/select';
import {
  fullCarePlanSuggestionWithConcern as concernSuggestion,
  fullCarePlanSuggestionWithGoal as goalSuggestion,
} from '../../shared/util/test-data';
import { PopupPatientCarePlanSuggestionDismissed } from '../popup-patient-care-plan-suggestion-dismissed';

describe('Dismiss Care Plan Suggestion Modal', () => {
  const placeholderFn = () => true as any;

  const wrapper = shallow(
    <PopupPatientCarePlanSuggestionDismissed
      suggestion={concernSuggestion}
      visible={true}
      onDismiss={placeholderFn}
      dismissCarePlanSuggestion={placeholderFn}
    />,
  );

  it('renders modal component', () => {
    expect(wrapper.find(Modal).props().isVisible).toBeTruthy();
    expect(wrapper.find(Modal).props().titleMessageId).toBe('carePlanSuggestion.dismissReason');
    expect(wrapper.find(Modal).props().submitMessageId).toBe('carePlanSuggestion.dismissconcern');
  });

  it('renders dropdown to select reason', () => {
    expect(wrapper.find(Select).props().value).toBeFalsy();
    expect(wrapper.find(Select).props().large).toBeTruthy();
  });

  it('renders options for reasons', () => {
    expect(wrapper.find(Option).length).toBe(4);

    expect(
      wrapper
        .find(Option)
        .at(0)
        .props().value,
    ).toBeFalsy();
    expect(
      wrapper
        .find(Option)
        .at(0)
        .props().disabled,
    ).toBeTruthy();
    expect(
      wrapper
        .find(Option)
        .at(0)
        .props().messageId,
    ).toBe('carePlanSuggestion.selectReason');
  });

  it('changes value of selected option', () => {
    wrapper.setState({ dismissedReason: 'not applicable' });

    expect(wrapper.find(Select).props().value).toBe('not applicable');
  });

  it('hides modal', () => {
    wrapper.setProps({ visible: false });

    expect(wrapper.find(Modal).props().isVisible).toBeFalsy();
  });

  it('changes submit button label from concern to goal', () => {
    wrapper.setProps({ suggestion: goalSuggestion });

    expect(wrapper.find(Modal).props().submitMessageId).toBe('carePlanSuggestion.dismissgoal');
  });
});
