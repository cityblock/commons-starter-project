import { shallow } from 'enzyme';
import * as React from 'react';
import EditableMultilineText from '../../library/editable-multiline-text/editable-multiline-text';
import TaskInfo from '../task-info';

describe('Task Info Component', () => {
  const title = 'Perfect acting for celebrity';
  const description = 'There are no words';
  const taskId = 'brennanMoore';

  const editTask = () => true as any;
  const wrapper = shallow(
    <TaskInfo
      title={title}
      description={description}
      taskId={taskId}
      editTask={editTask}
      CBOReferralStatus="notCBOReferral"
    />,
  );

  it('renders two editable text fields for title and description', () => {
    expect(wrapper.find(EditableMultilineText).length).toBe(2);
  });

  it('renders editable text for title', () => {
    expect(
      wrapper
        .find(EditableMultilineText)
        .at(0)
        .props().text,
    ).toBe(title);
    expect(
      wrapper
        .find(EditableMultilineText)
        .at(0)
        .props().descriptionField,
    ).toBeFalsy();
    expect(
      wrapper
        .find(EditableMultilineText)
        .at(0)
        .props().placeholderMessageId,
    ).toBeFalsy();
    expect(
      wrapper
        .find(EditableMultilineText)
        .at(0)
        .props().disabled,
    ).toBeFalsy();
  });

  it('renders editable text for description', () => {
    expect(
      wrapper
        .find(EditableMultilineText)
        .at(1)
        .props().text,
    ).toBe(description);
    expect(
      wrapper
        .find(EditableMultilineText)
        .at(1)
        .props().descriptionField,
    ).toBeTruthy();
    expect(
      wrapper
        .find(EditableMultilineText)
        .at(1)
        .props().placeholderMessageId,
    ).toBe('taskDescription.empty');
    expect(
      wrapper
        .find(EditableMultilineText)
        .at(1)
        .props().disabled,
    ).toBeFalsy();
  });

  it('changes description placeholder if viewing CBO Referral', () => {
    wrapper.setProps({ CBOReferralStatus: 'CBOReferral' });

    expect(
      wrapper
        .find(EditableMultilineText)
        .at(1)
        .props().placeholderMessageId,
    ).toBe('taskDescription.emptyCBO');
    expect(
      wrapper
        .find(EditableMultilineText)
        .at(0)
        .props().disabled,
    ).toBeFalsy();
    expect(
      wrapper
        .find(EditableMultilineText)
        .at(1)
        .props().disabled,
    ).toBeFalsy();
  });

  it('diasables editing and changes placeholder for CBO Referral requiring action', () => {
    wrapper.setProps({ CBOReferralStatus: 'CBOReferralRequiringAction' });

    expect(
      wrapper
        .find(EditableMultilineText)
        .at(1)
        .props().placeholderMessageId,
    ).toBe('taskDescription.emptyCBOAction');
    expect(
      wrapper
        .find(EditableMultilineText)
        .at(0)
        .props().disabled,
    ).toBeTruthy();
    expect(
      wrapper
        .find(EditableMultilineText)
        .at(1)
        .props().disabled,
    ).toBeTruthy();
  });
});
