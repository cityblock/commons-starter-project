import { shallow } from 'enzyme';
import * as React from 'react';
import TextDivider from '../../../shared/library/text-divider/text-divider';
import {
  fullCarePlanSuggestionWithConcern,
  fullCarePlanSuggestionWithGoal,
  riskArea,
} from '../../../shared/util/test-data';
import SuggestionsGroup from '../suggestions-group';
import SuggestionsSection from '../suggestions-section';

describe('renders care plan suggestion section', () => {
  const onAccept = jest.fn();
  const onDismiss = jest.fn();
  const onGroupClick = jest.fn();
  const titleMessageId = 'test.id';
  const name = 'riskAreaAssessment';
  const suggestionGroups = {
    [riskArea.id]: [
      fullCarePlanSuggestionWithConcern,
      fullCarePlanSuggestionWithGoal,
    ],
    id2: [
      {
        ...fullCarePlanSuggestionWithConcern,
        riskArea: {
          id: 'id2',
          title: 'second risk area',
        }
      }
    ]
  };
  const labels = { [riskArea.id]: riskArea.title, id2: 'second risk area' };

  const wrapper = shallow(
    <SuggestionsSection
      name={name}
      titleMessageId={titleMessageId}
      suggestionGroups={suggestionGroups}
      labels={labels}
      groupIdFilter={null}
      isHidden={false}
      onAccept={onAccept}
      onDismiss={onDismiss}
      onGroupClick={onGroupClick}
    />,
  );

  it('renders unselected unhidden suggestions section', () => {
    const titleDivider = wrapper.find(TextDivider);
    expect(titleDivider).toHaveLength(1);
    expect(titleDivider.props().messageId).toBe(titleMessageId);

    const groups = wrapper.find(SuggestionsGroup);
    expect(groups).toHaveLength(2);

    const firstGroupProps = groups.at(0).props();
    expect(firstGroupProps.title).toBe(labels[riskArea.id]);
    expect(firstGroupProps.suggestions).toBe(suggestionGroups[riskArea.id]);
    expect(firstGroupProps.isSelected).toBeFalsy();
    expect(firstGroupProps.isHidden).toBeFalsy();
    expect(firstGroupProps.onAccept).toBe(onAccept);
    expect(firstGroupProps.onDismiss).toBe(onDismiss);
    expect(firstGroupProps.onClick).not.toBe(onGroupClick);


    const secondGroupProps = groups.at(1).props();
    expect(secondGroupProps.title).toBe(labels.id2);
    expect(secondGroupProps.suggestions).toBe(suggestionGroups.id2);
    expect(secondGroupProps.isSelected).toBeFalsy();
    expect(secondGroupProps.isHidden).toBeFalsy();
    expect(secondGroupProps.onAccept).toBe(onAccept);
    expect(secondGroupProps.onDismiss).toBe(onDismiss);
    expect(secondGroupProps.onClick).not.toBe(onGroupClick);
  });

  it('renders selected group unhidden suggestions section', () => {
    wrapper.setProps({ selectedGroupId: 'id2' });

    const groups = wrapper.find(SuggestionsGroup);
    expect(groups).toHaveLength(2);

    const firstGroupProps = groups.at(0).props();
    expect(firstGroupProps.title).toBe(labels[riskArea.id]);
    expect(firstGroupProps.suggestions).toBe(suggestionGroups[riskArea.id]);
    expect(firstGroupProps.isSelected).toBeFalsy();
    expect(firstGroupProps.isHidden).toBeFalsy();

    const secondGroupProps = groups.at(1).props();
    expect(secondGroupProps.title).toBe(labels.id2);
    expect(secondGroupProps.suggestions).toBe(suggestionGroups.id2);
    expect(secondGroupProps.isSelected).toBeTruthy();
    expect(secondGroupProps.isHidden).toBeFalsy();
  });

  it('renders filtered section', () => {
    wrapper.setProps({ groupIdFilter: riskArea.id });

    const groups = wrapper.find(SuggestionsGroup);
    expect(groups).toHaveLength(2);

    const firstGroupProps = groups.at(0).props();
    expect(firstGroupProps.title).toBe(labels[riskArea.id]);
    expect(firstGroupProps.suggestions).toBe(suggestionGroups[riskArea.id]);
    expect(firstGroupProps.isSelected).toBeTruthy();
    expect(firstGroupProps.isHidden).toBeFalsy();

    const secondGroupProps = groups.at(1).props();
    expect(secondGroupProps.title).toBe(labels.id2);
    expect(secondGroupProps.suggestions).toBe(suggestionGroups.id2);
    expect(secondGroupProps.isSelected).toBeTruthy();
    expect(secondGroupProps.isHidden).toBeTruthy();
  });

  it('renders hidden section', () => {
    expect(wrapper.find('div.hidden')).toHaveLength(0);
    wrapper.setProps({ isHidden: true });
    expect(wrapper.find('div.hidden')).toHaveLength(1);

    const groups = wrapper.find(SuggestionsGroup);
    expect(groups).toHaveLength(2);
  });

});
