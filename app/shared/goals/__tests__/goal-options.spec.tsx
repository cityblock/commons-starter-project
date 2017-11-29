import { shallow } from 'enzyme';
import * as React from 'react';
import HamburgerMenuOption from '../../library/hamburger-menu-option/hamburger-menu-option';
import HamburgerMenu from '../../library/hamburger-menu/hamburger-menu';
import GoalOptions from '../goal-options';

describe('Patient Concern Options Menu Component', () => {
  const onMenuToggle = () => true as any;
  const addTask = () => true as any;

  const wrapper = shallow(
    <GoalOptions open={false} onMenuToggle={onMenuToggle} addTask={addTask} />,
  );

  it('renders hamburger menu component', () => {
    expect(wrapper.find(HamburgerMenu).length).toBe(1);
    expect(wrapper.find(HamburgerMenu).props().open).toBeFalsy();
    expect(wrapper.find(HamburgerMenu).props().onMenuToggle).toBe(onMenuToggle);
  });

  it('renders option to add a goal', () => {
    expect(wrapper.find(HamburgerMenuOption).length).toBe(1);
    expect(wrapper.find(HamburgerMenuOption).props().messageId).toBe('patientMap.addTask');
    expect(wrapper.find(HamburgerMenuOption).props().icon).toBe('addAlert');
    expect(wrapper.find(HamburgerMenuOption).props().onClick).toBe(addTask);
  });
});
