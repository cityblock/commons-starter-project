import { shallow } from 'enzyme';
import * as React from 'react';
import FormLabel from '../../library/form-label/form-label';
import { CBOReferral, CBOReferralRequiringAction } from '../../util/test-data';
import TaskBody from '../task-body';
import TaskCBOReferral from '../task-cbo-referral';
import TaskInfo from '../task-info';

describe('Task Body Component', () => {
  const taskId = 'magikarp';
  const title = 'Evolve into Gyrados';
  const description = 'Splash sucks :(';
  const goal = 'Become stronger';
  const concern = 'Pokemon master';
  const editTask = () => true as any;

  const wrapper = shallow(
    <TaskBody
      taskId={taskId}
      title={title}
      description={description}
      goal={goal}
      concern={concern}
      editTask={editTask}
      CBOReferral={null}
    />,
  );

  it('renders task information component', () => {
    expect(wrapper.find(TaskInfo).length).toBe(1);

    expect(wrapper.find(TaskInfo).props().taskId).toBe(taskId);
    expect(wrapper.find(TaskInfo).props().title).toBe(title);
    expect(wrapper.find(TaskInfo).props().description).toBe(description);
  });

  it('renders information about the concern', () => {
    expect(wrapper.find('h3').length).toBe(2);
    expect(wrapper.find(FormLabel).length).toBe(2);

    expect(
      wrapper
        .find(FormLabel)
        .at(0)
        .props().messageId,
    ).toBe('task.concern');
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
        .props().small,
    ).toBeTruthy();
    expect(
      wrapper
        .find('h3')
        .at(0)
        .text(),
    ).toBe(concern);
  });

  it('renders information about the goal', () => {
    expect(
      wrapper
        .find(FormLabel)
        .at(1)
        .props().messageId,
    ).toBe('task.goal');
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
        .props().small,
    ).toBeTruthy();
    expect(
      wrapper
        .find('h3')
        .at(1)
        .text(),
    ).toBe(goal);
  });

  it('does not render CBO referral component if general task', () => {
    expect(wrapper.find(TaskCBOReferral).length).toBe(0);
    expect(wrapper.find(TaskInfo).props().CBOReferralStatus).toBe('notCBOReferral');
  });

  it('renders CBO referral component if relevant', () => {
    wrapper.setProps({ CBOReferral });

    expect(wrapper.find(TaskCBOReferral).length).toBe(1);
    expect(wrapper.find(TaskCBOReferral).props().CBOReferral).toEqual(CBOReferral);
    expect(wrapper.find(TaskCBOReferral).props().taskId).toBe(taskId);
    expect(wrapper.find(TaskInfo).props().CBOReferralStatus).toBe('CBOReferral');
  });

  it('indicates if task information is for CBO referral requiring action', () => {
    wrapper.setProps({ CBOReferral: CBOReferralRequiringAction });

    expect(wrapper.find(TaskInfo).props().CBOReferralStatus).toBe('CBOReferralRequiringAction');
  });
});
