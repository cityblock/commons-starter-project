import { Text, View } from '@react-pdf/core';
import { shallow } from 'enzyme';
import * as React from 'react';
import { task } from '../../../shared/util/test-data';
import Task from '../task';
import TaskHeader from '../task-header';

describe('Printable MAP Concern Component', () => {
  const wrapper = shallow(<Task task={task} isLastInConcern={false} />);

  it('renders view containers', () => {
    expect(wrapper.find(View).length).toBe(3);
  });

  it('renders task header', () => {
    expect(wrapper.find(TaskHeader).props().task).toEqual(task);
  });

  it('renders text with name of task', () => {
    expect(wrapper.find(Text).text()).toBe(task.title);
  });

  it('renders bottom border if last task in concern', () => {
    wrapper.setProps({ isLastInConcern: true });

    expect(wrapper.find(View).length).toBe(4);
  });
});
