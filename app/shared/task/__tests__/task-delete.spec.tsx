import { shallow } from 'enzyme';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '../../library/button/button';
import { TaskDelete } from '../task-delete';

describe('Task Delete Component', () => {
  const placeholderFn = () => true as any;
  const taskId = 'eevee';

  const wrapper = shallow(
    <TaskDelete
      taskId={taskId}
      cancelDelete={placeholderFn}
      deleteTask={placeholderFn}
      clearTask={placeholderFn} />,
  );

  it('renders translated title and body', () => {
    const messages = wrapper.find(FormattedMessage);

    expect(messages.length).toBe(2);
    expect(messages.at(0).props().id).toBe('taskDelete.title');
    expect(messages.at(1).props().id).toBe('taskDelete.body');
  });

  it('renders buttons to cancel and confirm', () => {
    const buttons = wrapper.find(Button);

    expect(buttons.length).toBe(2);
    expect(buttons.at(0).props().messageId).toBe('taskDelete.cancel');
    expect(buttons.at(0).props().color).toBe('white');
    expect(buttons.at(0).props().small).toBeTruthy();

    expect(buttons.at(1).props().messageId).toBe('taskDelete.confirm');
    expect(buttons.at(1).props().color).toBe('red');
    expect(buttons.at(1).props().small).toBeTruthy();
  });

  it('shows errors if error occurs during deletion', () => {
    wrapper.setState({ deleteError: 'error!' });

    const messages = wrapper.find(FormattedMessage);

    expect(messages.at(0).props().id).toBe('taskDelete.titleError');
    expect(messages.at(1).props().id).toBe('taskDelete.bodyError');
  });
});
