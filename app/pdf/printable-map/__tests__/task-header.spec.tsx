import { Text, View } from '@react-pdf/core';
import { shallow } from 'enzyme';
import * as React from 'react';
import { task as rawTask, user } from '../../../shared/util/test-data';
import copy from '../copy/copy';
import TaskHeader from '../task-header';

describe('Printable MAP Concern Component', () => {
  const task = {
    ...rawTask,
    assignedTo: user,
  };

  const wrapper = shallow(<TaskHeader task={task} />);

  it('renders view container', () => {
    expect(wrapper.find(View).length).toBe(1);
  });

  it('renders text with priority of task', () => {
    expect(wrapper.find(Text).length).toBe(2);

    expect(
      wrapper
        .find(Text)
        .at(0)
        .text(),
    ).toBe(`High-priority ${copy.task}`);
  });

  it('renders text with assignee and due date of task', () => {
    const expected = `${copy.assignedTo} first last    ${copy.due} Tue, May 16, 2017`;
    expect(
      wrapper
        .find(Text)
        .at(1)
        .text(),
    ).toBe(expected);
  });
});
