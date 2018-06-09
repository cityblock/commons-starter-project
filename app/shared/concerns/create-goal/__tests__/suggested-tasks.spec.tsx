import { shallow } from 'enzyme';
import * as React from 'react';
import FormLabel from '../../../library/form-label/form-label';
import ModalButtons from '../../../library/modal-buttons/modal-buttons';
import ModalHeader from '../../../library/modal-header/modal-header';
import SuggestedTask from '../suggested-task';
import SuggestedTasks from '../suggested-tasks';

describe('Suggested Tasks Component in Create Goal Modal', () => {
  const placeholderFn = jest.fn();
  const title = 'The Flea and the Acrobat';
  const id1 = 'janeIves';
  const id2 = 'nancyWheeler';
  const id3 = 'madMax';
  const title1 = 'Mage';
  const title2 = 'Cool high schooler';
  const title3 = 'Zoomer';

  const goalSuggestionTemplate = {
    title,
    taskTemplates: [
      {
        id: id1,
        title: title1,
      },
      {
        id: id2,
        title: title2,
      },
      {
        id: id3,
        title: title3,
      },
    ],
  } as any;

  const wrapper = shallow(
    <SuggestedTasks
      onGoBack={placeholderFn}
      onSubmit={placeholderFn}
      onTaskTemplateClick={placeholderFn}
      goalSuggestionTemplate={goalSuggestionTemplate}
      closePopup={placeholderFn}
      rejectedTaskTemplateIds={[]}
    />,
  );

  it('renders modal header', () => {
    expect(wrapper.find(ModalHeader).length).toBe(1);
    expect(wrapper.find(ModalHeader).props().titleMessageId).toBe('goalCreate.suggestionsTitle');
    expect(wrapper.find(ModalHeader).props().bodyMessageId).toBe('goalCreate.suggestionsDetail');
  });

  it('renders name of goal suggestion template', () => {
    expect(wrapper.find('p').length).toBe(1);
    expect(wrapper.find('p').text()).toBe(title);
    expect(wrapper.find('p').props().className).toBe('text');
  });

  it('renders label for goal added and suggested tasks', () => {
    expect(wrapper.find(FormLabel).length).toBe(2);
    expect(
      wrapper
        .find(FormLabel)
        .at(0)
        .props().gray,
    ).toBeTruthy();
    expect(
      wrapper
        .find(FormLabel)
        .at(0)
        .props().messageId,
    ).toBe('goalCreate.goalAdded');
    expect(
      wrapper
        .find(FormLabel)
        .at(1)
        .props().gray,
    ).toBeTruthy();
    expect(
      wrapper
        .find(FormLabel)
        .at(1)
        .props().messageId,
    ).toBe('goalCreate.suggestedTasks');
  });

  it('renders modal buttons', () => {
    expect(wrapper.find(ModalButtons).length).toBe(1);
    expect(wrapper.find(ModalButtons).props().cancelMessageId).toBe('goalCreate.back');
    expect(wrapper.find(ModalButtons).props().submitMessageId).toBe('goalCreate.submitWithTasks');
  });

  it('renders suggested task components', () => {
    expect(wrapper.find(SuggestedTask).length).toBe(3);
    expect(
      wrapper
        .find(SuggestedTask)
        .at(0)
        .props().title,
    ).toBe(title1);
    expect(
      wrapper
        .find(SuggestedTask)
        .at(1)
        .props().title,
    ).toBe(title2);
    expect(
      wrapper
        .find(SuggestedTask)
        .at(2)
        .props().title,
    ).toBe(title3);
    expect(
      wrapper
        .find(SuggestedTask)
        .at(0)
        .props().rejected,
    ).toBeFalsy();
    expect(
      wrapper
        .find(SuggestedTask)
        .at(1)
        .props().isRejected,
    ).toBeFalsy();
    expect(
      wrapper
        .find(SuggestedTask)
        .at(2)
        .props().isRejected,
    ).toBeFalsy();
  });

  it('removes extra margin from last suggested task', () => {
    expect(
      wrapper
        .find(SuggestedTask)
        .at(2)
        .props().className,
    ).toBe('lessMargin');
    expect(
      wrapper
        .find(SuggestedTask)
        .at(0)
        .props().className,
    ).toBeFalsy();
    expect(
      wrapper
        .find(SuggestedTask)
        .at(1)
        .props().className,
    ).toBeFalsy();
  });

  it('sets a suggested task to be rejected', () => {
    wrapper.setProps({ rejectedTaskTemplateIds: [id2] });
    expect(wrapper.find(SuggestedTask).length).toBe(3);
    expect(
      wrapper
        .find(SuggestedTask)
        .at(0)
        .props().isRejected,
    ).toBeFalsy();
    expect(
      wrapper
        .find(SuggestedTask)
        .at(1)
        .props().isRejected,
    ).toBeTruthy();
    expect(
      wrapper
        .find(SuggestedTask)
        .at(2)
        .props().isRejected,
    ).toBeFalsy();
  });
});
