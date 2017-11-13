import { shallow } from 'enzyme';
import * as React from 'react';
import { Link } from 'react-router-dom';
import TaskHeader from '../header';
import TaskHamburgerMenu from '../task-hamburger-menu';

describe('Task Header Component', () => {
  const patientId = 'judyHopps';
  const patientName = 'Lt. Judy Hopps';
  const confirmDelete = () => true;
  const routeBase = '/tasks';

  it('renders nothing if task id or base route undefined', () => {
    const taskId = '';

    const wrapper = shallow(
      <TaskHeader
        taskId={taskId}
        patientId={patientId}
        patientName={patientName}
        confirmDelete={confirmDelete}
        routeBase={routeBase}
      />,
    );

    expect(wrapper.find('div').length).toBe(0);
  });

  it('renders task kabob menu and close button', () => {
    const taskId = 'findMrOtterton';

    const wrapper = shallow(
      <TaskHeader
        taskId={taskId}
        patientId={patientId}
        patientName={patientName}
        confirmDelete={confirmDelete}
        routeBase={routeBase}
      />,
    );

    expect(wrapper.find(TaskHamburgerMenu).length).toBe(1);
    expect(wrapper.find(TaskHamburgerMenu).props().taskId).toBe(taskId);
    expect(wrapper.find(TaskHamburgerMenu).props().patientId).toBe(patientId);

    expect(wrapper.find(Link).length).toBe(1);
  });
});
