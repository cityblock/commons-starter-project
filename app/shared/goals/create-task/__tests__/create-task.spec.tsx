import { shallow } from 'enzyme';
import * as React from 'react';
import ModalButtons from '../../../library/modal-buttons/modal-buttons';
import ModalHeader from '../../../library/modal-header/modal-header';
import { Popup } from '../../../popup/popup';
import { CreateTaskModal } from '../create-task';
import CreateTaskFields from '../create-task-fields';
import CreateTaskInfo from '../info';

describe('Create Task Modal Component', () => {
  const concern = 'Eleven understandign her past';
  const goal = 'Find 008';
  const patientId = '011';
  const patientGoalId = 'terryIves';
  const placeholderFn = () => true as any;

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

  it('renders task header component', () => {
    expect(wrapper.find(ModalHeader).length).toBe(1);
    expect(wrapper.find(ModalHeader).props().titleMessageId).toBe('taskCreate.addTask');
    expect(wrapper.find(ModalHeader).props().bodyMessageId).toBe('taskCreate.detail');
    expect(wrapper.find(ModalHeader).props().color).toBe('navy');
  });

  it('renders task info component with correct props', () => {
    expect(wrapper.find(CreateTaskInfo).props().goal).toBe(goal);
    expect(wrapper.find(CreateTaskInfo).props().concern).toBe(concern);
  });

  it('renders popup component', () => {
    expect(wrapper.find(Popup).length).toBe(1);
    expect(wrapper.find(Popup).props().visible).toBeFalsy();
    expect(wrapper.find(Popup).props().style).toBe('no-padding');
    expect(wrapper.find(Popup).props().className).toBe('popup');
  });

  it('makes popup visible after receiving new props', () => {
    wrapper.setProps({ visible: true });
    expect(wrapper.find(Popup).props().visible).toBeTruthy();
  });

  it('renders fields with correct styles', () => {
    expect(wrapper.find('.fields').length).toBe(1);
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
    expect(wrapper.find(ModalButtons).length).toBe(0);
  });

  it('renders modal buttons if task type selected', () => {
    wrapper.setState({ taskType: 'general' });

    expect(wrapper.find(ModalButtons).length).toBe(1);
    expect(wrapper.find(ModalButtons).props().cancelMessageId).toBe('taskCreate.cancel');
    expect(wrapper.find(ModalButtons).props().submitMessageId).toBe('taskCreate.submit');
  });
});
