import { shallow } from 'enzyme';
import React from 'react';
import Modal from '../../../library/modal/modal';
import { CreateTaskModal } from '../create-task';
import CreateTaskFields from '../create-task-fields';
import CreateTaskInfo from '../info';

describe('Create Task Modal Component', () => {
  const concern = 'Eleven understandign her past';
  const goal = 'Find 008';
  const patientId = '011';
  const patientGoalId = 'terryIves';
  const placeholderFn = jest.fn();

  const wrapper = shallow(
    <CreateTaskModal
      visible={false}
      closePopup={placeholderFn}
      patientId={patientId}
      patientGoalId={patientGoalId}
      createTask={placeholderFn}
      concern={concern}
      goal={goal}
      createCBOReferral={placeholderFn}
    />,
  );

  it('renders task modal component', () => {
    expect(wrapper.find(Modal).length).toBe(1);

    const modalProps = wrapper.find(Modal).props();
    expect(modalProps.titleMessageId).toBe('taskCreate.addTask');
    expect(modalProps.subTitleMessageId).toBe('taskCreate.detail');
    expect(modalProps.headerColor).toBe('navy');
    expect(modalProps.isVisible).toBeFalsy();
    expect(modalProps.cancelMessageId).toBe('taskCreate.cancel');
    expect(modalProps.submitMessageId).toBe('taskCreate.submit');
  });

  it('renders task info component with correct props', () => {
    expect(wrapper.find(CreateTaskInfo).props().goal).toBe(goal);
    expect(wrapper.find(CreateTaskInfo).props().concern).toBe(concern);
  });

  it('makes popup visible after receiving new props', () => {
    wrapper.setProps({ visible: true });
    expect(wrapper.find(Modal).props().isVisible).toBeTruthy();
  });

  it('renders create task fields', () => {
    expect(wrapper.find(CreateTaskFields).length).toBe(1);
    expect(wrapper.find(CreateTaskFields).props().patientId).toBe(patientId);
  });

  it('passes state to task fields', () => {
    const state = {
      title: 'Train Rhaegal',
    };
    wrapper.setState({ ...state });

    expect(wrapper.find(CreateTaskFields).props().taskFields.title).toBe(state.title);
  });

  it('does not render modal buttons if no category selected', () => {
    expect(wrapper.find(Modal).props().isButtonHidden).toBeTruthy();
  });

  it('renders modal buttons if task type selected', () => {
    wrapper.setState({ taskType: 'general' });
    expect(wrapper.find(Modal).props().isButtonHidden).toBeFalsy();
  });
});
