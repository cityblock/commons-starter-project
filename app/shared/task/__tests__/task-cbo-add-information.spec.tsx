import { shallow } from 'enzyme';
import * as React from 'react';
import Button from '../../library/button/button';
import { taskWithComment as task } from '../../util/test-data';
import { TaskCBOAddInformation } from '../task-cbo-add-information';
import TaskCBOAddInformationPopup, { IProps } from '../task-cbo-add-information-popup';

describe('CBO Referral Task Add Information Button', () => {
  const taskId = 'defeatCersei';

  const wrapper = shallow(
    <TaskCBOAddInformation taskId={taskId} task={task} loading={false} error={null} />,
  );

  it('renders button to add information', () => {
    expect(wrapper.find(Button).length).toBe(1);
    expect(wrapper.find(Button).props().messageId).toBe('task.CBOAddInfo');
    expect(wrapper.find(Button).props().color).toBe('white');
  });

  it('renders popup to add CBO referral information', () => {
    expect(wrapper.find(TaskCBOAddInformationPopup).length).toBe(1);
    expect(wrapper.find<IProps>(TaskCBOAddInformationPopup as any).props().isVisible).toBeFalsy();
    expect(wrapper.find<IProps>(TaskCBOAddInformationPopup as any).props().task).toEqual(task);
  });

  it('opens popup to add information to CBO referral', () => {
    wrapper.setState({ isPopupVisible: true });
    expect(wrapper.find<IProps>(TaskCBOAddInformationPopup as any).props().isVisible).toBeTruthy();
  });

  it('renders nothing if loading', () => {
    wrapper.setProps({ loading: true });

    expect(wrapper.find(Button).length).toBe(0);
    expect(wrapper.find(TaskCBOAddInformationPopup).length).toBe(0);
  });
});
