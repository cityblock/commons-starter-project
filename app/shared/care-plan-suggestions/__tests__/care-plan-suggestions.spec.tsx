import { shallow } from 'enzyme';
import * as React from 'react';
import Modal from '../../library/modal/modal';
import SmallText from '../../library/small-text/small-text';
import { carePlanSuggestionWithConcern, carePlanSuggestionWithGoal } from '../../util/test-data';
import { CarePlanSuggestions } from '../care-plan-suggestions';

describe('Care Plan Suggestions Modal', () => {
  const wrapper = shallow(
    <CarePlanSuggestions
      isVisible={true}
      patientId="sansaStark"
      closePopup={() => true as any}
      carePlanSuggestions={[carePlanSuggestionWithConcern, carePlanSuggestionWithGoal]}
      match={{} as any}
      staticContext={{} as any}
      history={{} as any}
      location={{} as any}
    />,
  );

  it('renders modal', () => {
    expect(wrapper.find(Modal).props().isVisible).toBeTruthy();
    expect(wrapper.find(Modal).props().titleMessageId).toBe('suggestionsModal.title');
    expect(wrapper.find(Modal).props().subTitleMessageId).toBe('suggestionsModal.body');
    expect(wrapper.find(Modal).props().submitMessageId).toBe('suggestionsModal.done');
    expect(wrapper.find(Modal).props().cancelMessageId).toBe('suggestionsModal.seeSuggestions');
  });

  it('renders body container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders concerns count', () => {
    expect(wrapper.find('.count').length).toBe(3);
    expect(wrapper.find(SmallText).length).toBe(6);

    expect(
      wrapper
        .find(SmallText)
        .at(0)
        .props().messageId,
    ).toBe('suggestionsModal.concerns');
    expect(
      wrapper
        .find(SmallText)
        .at(0)
        .props().color,
    ).toBe('darkGray');

    expect(
      wrapper
        .find(SmallText)
        .at(1)
        .props().text,
    ).toBe('1');
    expect(
      wrapper
        .find(SmallText)
        .at(1)
        .props().isBold,
    ).toBeTruthy();
    expect(
      wrapper
        .find(SmallText)
        .at(1)
        .props().color,
    ).toBe('black');
  });

  it('renders goals count', () => {
    expect(
      wrapper
        .find(SmallText)
        .at(2)
        .props().messageId,
    ).toBe('suggestionsModal.goals');
    expect(
      wrapper
        .find(SmallText)
        .at(2)
        .props().color,
    ).toBe('darkGray');

    expect(
      wrapper
        .find(SmallText)
        .at(3)
        .props().text,
    ).toBe('1');
    expect(
      wrapper
        .find(SmallText)
        .at(3)
        .props().isBold,
    ).toBeTruthy();
    expect(
      wrapper
        .find(SmallText)
        .at(3)
        .props().color,
    ).toBe('black');
  });

  it('renders tasks count', () => {
    expect(
      wrapper
        .find(SmallText)
        .at(4)
        .props().messageId,
    ).toBe('suggestionsModal.tasks');
    expect(
      wrapper
        .find(SmallText)
        .at(4)
        .props().color,
    ).toBe('darkGray');

    expect(
      wrapper
        .find(SmallText)
        .at(5)
        .props().text,
    ).toBe('1');
    expect(
      wrapper
        .find(SmallText)
        .at(5)
        .props().isBold,
    ).toBeTruthy();
    expect(
      wrapper
        .find(SmallText)
        .at(5)
        .props().color,
    ).toBe('black');
  });

  it('closes modal', () => {
    wrapper.setProps({ isVisible: false });

    expect(wrapper.find(Modal).props().isVisible).toBeFalsy();
  });
});
