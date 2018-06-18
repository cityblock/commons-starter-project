import { shallow } from 'enzyme';
import React from 'react';
import Icon from '../../../shared/library/icon/icon';
import { taskTemplate } from '../../../shared/util/test-data';
import TaskTemplate from '../task-template';

describe('Care Plan Suggestion Task Template', () => {
  const placeholderFn = jest.fn();

  const wrapper = shallow(
    <TaskTemplate taskTemplate={taskTemplate} selected={false} onToggle={placeholderFn} />,
  );

  it('renders container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders title of task template', () => {
    expect(wrapper.find('h2').text()).toBe(taskTemplate.title);
    expect(wrapper.find('h2').props().className).toBe('opaque');
  });

  it('renders icon to accept task', () => {
    expect(wrapper.find(Icon).props().name).toBe('addCircle');
    expect(wrapper.find(Icon).props().color).toBe('darkGray');
  });

  it('renders icon to reject task', () => {
    wrapper.setProps({ selected: true });

    expect(wrapper.find(Icon).props().name).toBe('highlightOff');
  });

  it('removes opacity if task selected', () => {
    expect(wrapper.find('h2').props().className).toBeFalsy();
  });
});
