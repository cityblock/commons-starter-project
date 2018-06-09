import { shallow } from 'enzyme';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import FormLabel from '../../../library/form-label/form-label';
import ModalButtons from '../../../library/modal-buttons/modal-buttons';
import ModalHeader from '../../../library/modal-header/modal-header';
import Search from '../../../library/search/search';
import DefineGoal from '../define-goal';

describe('Create Goal Modal', () => {
  const placeholderFn = jest.fn();
  const title = '';
  const goalSuggestionTemplateId = '011';

  const wrapper = shallow(
    <DefineGoal
      title={title}
      goalSuggestionTemplateId={goalSuggestionTemplateId}
      goalSuggestionTemplates={[]}
      closePopup={placeholderFn}
      onTitleChange={placeholderFn}
      onGoalSuggestionTemplateClick={placeholderFn}
      onSubmit={placeholderFn}
      toggleShowAllGoals={placeholderFn}
      hideSearchResults={false}
      showAllGoals={false}
    />,
  );

  it('renders modal header component', () => {
    expect(wrapper.find(ModalHeader).length).toBe(1);
    expect(wrapper.find(ModalHeader).props().titleMessageId).toBe('goalCreate.addGoal');
    expect(wrapper.find(ModalHeader).props().bodyMessageId).toBe('goalCreate.detail');
  });

  it('renders form label to add a goal', () => {
    expect(wrapper.find(FormLabel).length).toBe(1);
    expect(wrapper.find(FormLabel).props().messageId).toBe('goalCreate.selectLabel');
  });

  it('renders search field', () => {
    expect(wrapper.find(Search).length).toBe(1);
    expect(wrapper.find(Search).props().value).toBe(title);
    expect(wrapper.find(Search).props().searchOptions).toEqual([]);
    expect((wrapper.find(Search).props() as any).hideSearchResults).toBeFalsy();
    expect((wrapper.find(Search).props() as any).showAllGoals).toBeFalsy();
    expect(wrapper.find(Search).props().placeholderMessageId).toBe('goalCreate.search');
    expect(wrapper.find(Search).props().emptyPlaceholderMessageId).toBe('goalCreate.noResults');
  });

  it('passes prop to show all goals and hide search results', () => {
    wrapper.setProps({ showAllGoals: true, hideSearchResults: true });
    expect(wrapper.find(Search).props().hideResults).toBeTruthy();
    expect(wrapper.find(Search).props().showAll).toBeTruthy();
  });

  it('renders label to show and hide all goals', () => {
    expect(wrapper.find(FormattedMessage).length).toBe(1);
    expect(wrapper.find(FormattedMessage).props().id).toBe('goalCreate.hideAll');
    wrapper.setProps({ showAllGoals: false });
    expect(wrapper.find(FormattedMessage).props().id).toBe('goalCreate.showAll');
  });

  it('renders modal buttons', () => {
    expect(wrapper.find(ModalButtons).length).toBe(1);
    expect(wrapper.find(ModalButtons).props().cancelMessageId).toBe('goalCreate.cancel');
    expect(wrapper.find(ModalButtons).props().submitMessageId).toBe('goalCreate.submit');
    expect(wrapper.find(ModalButtons).props().className).toBe('buttons');
  });
});
