import { shallow } from 'enzyme';
import React from 'react';
import CreateTaskInfo from '../../goals/create-task/info';
import ModalHeader from '../../library/modal-header/modal-header';
import { Popup } from '../../popup/popup';
import { task as taskNoReferral, taskWithComment as task } from '../../util/test-data';
import TaskCBOAddInformationFields from '../task-cbo-add-information-fields';
import { TaskCBOAddInformationPopup } from '../task-cbo-add-information-popup';

describe('Task CBO Referral Add Information Popup', () => {
  const placeholderFn = jest.fn();
  const wrapper = shallow(
    <TaskCBOAddInformationPopup
      isVisible={true}
      closePopup={placeholderFn}
      task={task}
      editCBOReferral={placeholderFn}
      editTask={placeholderFn}
    />,
  );

  it('renders popup', () => {
    expect(wrapper.find(Popup).length).toBe(1);
    expect(wrapper.find(Popup).props().className).toBe('popup');
    expect(wrapper.find(Popup).props().style).toBe('no-padding');
    expect(wrapper.find(Popup).props().visible).toBeTruthy();
  });

  it('renders modal header', () => {
    expect(wrapper.find(ModalHeader).length).toBe(1);
    expect(wrapper.find(ModalHeader).props().titleMessageId).toBe('task.CBOAddTitle');
    expect(wrapper.find(ModalHeader).props().bodyMessageId).toBe('task.CBOAddDescription');
    expect(wrapper.find(ModalHeader).props().color).toBe('navy');
  });

  it('renders scroll container', () => {
    expect(wrapper.find('.scroll').length).toBe(1);
  });

  it('renders information about the task', () => {
    expect(wrapper.find(CreateTaskInfo).length).toBe(1);
    expect(wrapper.find(CreateTaskInfo).props().goal).toBe(task.patientGoal.title);
    expect(wrapper.find(CreateTaskInfo).props().concern).toBe(
      task.patientGoal.patientConcern.concern.title,
    );
  });

  it('renders fields in the popup', async () => {
    const newState = {
      description: 'Survive Night King invasion!',
      categoryId: 'warForTheDawn',
      CBOId: 'nightsWatch',
      CBOName: '',
      CBOUrl: '',
      error: null,
      loading: false,
      isMounted: true,
    };
    await wrapper.setState(newState);

    expect(wrapper.find(TaskCBOAddInformationFields).length).toBe(1);
    expect(wrapper.find(TaskCBOAddInformationFields).props().taskCBOInformation).toEqual(newState);
  });

  it('closes the popup', () => {
    wrapper.setProps({ isVisible: false });

    expect(wrapper.find(Popup).props().visible).toBeFalsy();
  });

  it('does not render popup if no CBO referral', () => {
    wrapper.setProps({ task: taskNoReferral });

    expect(wrapper.find(Popup).length).toBe(0);
  });
});
