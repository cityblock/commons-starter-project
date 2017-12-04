import { shallow } from 'enzyme';
import * as React from 'react';
import HamburgerMenuOption from '../../library/hamburger-menu-option/hamburger-menu-option';
import HamburgerMenu from '../../library/hamburger-menu/hamburger-menu';
import { GoalOptions } from '../goal-options';

describe('Patient Goal Options Menu Component', () => {
  const placeholderFn = () => true as any;
  const patientGoalId = 'nymeria';
  const addTask = () => true as any;

  const wrapper = shallow(
    <GoalOptions
      open={false}
      openMenu={placeholderFn}
      closeMenu={placeholderFn}
      patientGoalId={patientGoalId}
      taskOpen={false}
      addTask={addTask}
    />,
  );

  it('renders hamburger menu component', () => {
    expect(wrapper.find(HamburgerMenu).length).toBe(1);
    expect(wrapper.find(HamburgerMenu).props().open).toBeFalsy();
  });

  it('opens hamburger menu', () => {
    wrapper.setProps({ open: true });
    expect(wrapper.find(HamburgerMenu).props().open).toBeTruthy();
  });

  it('closes hamburger menu if task open', () => {
    wrapper.setProps({ taskOpen: true });
    expect(wrapper.find(HamburgerMenu).props().open).toBeFalsy();
  });

  it('renders option to add a goal', () => {
    expect(wrapper.find(HamburgerMenuOption).length).toBe(1);
    expect(wrapper.find(HamburgerMenuOption).props().messageId).toBe('patientMap.addTask');
    expect(wrapper.find(HamburgerMenuOption).props().icon).toBe('addAlert');
  });
});
