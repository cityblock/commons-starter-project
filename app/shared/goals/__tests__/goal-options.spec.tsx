import { shallow } from 'enzyme';
import * as React from 'react';
import HamburgerMenuOption from '../../library/hamburger-menu-option/hamburger-menu-option';
import HamburgerMenu from '../../library/hamburger-menu/hamburger-menu';
import { GoalOptions } from '../goal-options';

describe('Patient Goal Options Menu Component', () => {
  const placeholderFn = jest.fn();
  const patientGoalId = 'nymeria';
  const patientGoalTitle = "Arya's Direwolf";
  const addTask = jest.fn();

  const wrapper = shallow(
    <GoalOptions
      open={false}
      openMenu={placeholderFn}
      closeMenu={placeholderFn}
      patientGoalId={patientGoalId}
      patientGoalTitle={patientGoalTitle}
      taskOpen={false}
      addTask={addTask}
      deleteGoal={placeholderFn}
      canDelete={false}
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

  it('does not render option to delete goal if cannot be deleted', () => {
    expect(wrapper.find(HamburgerMenuOption).length).toBe(1);
  });

  it('renders option to delete goal if it can be deleted', () => {
    wrapper.setProps({ canDelete: true });
    expect(wrapper.find(HamburgerMenuOption).length).toBe(2);

    expect(
      wrapper
        .find(HamburgerMenuOption)
        .at(1)
        .props().messageId,
    ).toBe('goalDelete.menu');
    expect(
      wrapper
        .find(HamburgerMenuOption)
        .at(1)
        .props().icon,
    ).toBe('delete');
  });
});
