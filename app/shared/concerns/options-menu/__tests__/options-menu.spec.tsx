import { shallow } from 'enzyme';
import React from 'react';
import HamburgerMenuOption from '../../../library/hamburger-menu-option/hamburger-menu-option';
import HamburgerMenu from '../../../library/hamburger-menu/hamburger-menu';
import { PatientConcernOptions } from '../options-menu';

describe('Patient Concern Options Component', () => {
  const placeholderFn = jest.fn();

  const wrapper = shallow(
    <PatientConcernOptions
      open={false}
      taskOpen={false}
      closeMenu={placeholderFn}
      openMenu={placeholderFn}
      patientId="janeIves"
      patientConcernId="011"
      goalSuggestionTemplateIds={[]}
      addGoal={placeholderFn}
      deleteConcern={placeholderFn}
      canDelete={false}
      patientConcernTitle="Demogorgon"
    />,
  );

  it('renders hamburger menu', () => {
    expect(wrapper.find(HamburgerMenu).length).toBe(1);
    expect(wrapper.find(HamburgerMenu).props().open).toBeFalsy();
  });

  it('renders option to add goal', () => {
    expect(wrapper.find(HamburgerMenuOption).props().messageId).toBe('patientMap.addGoal');
    expect(wrapper.find(HamburgerMenuOption).props().icon).toBe('addCircleOutline');
    expect(wrapper.find(HamburgerMenuOption).props().onClick).toBe(placeholderFn);
  });

  it('does not render option to delete concern initially', () => {
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
    ).toBe('concernDelete.menu');
    expect(
      wrapper
        .find(HamburgerMenuOption)
        .at(1)
        .props().icon,
    ).toBe('delete');
  });

  it('opens hamburger menu', () => {
    wrapper.setProps({ open: true });
    expect(wrapper.find(HamburgerMenu).props().open).toBeTruthy();
  });

  it('closes hamburger menu if task open', () => {
    wrapper.setProps({ taskOpen: true });
    expect(wrapper.find(HamburgerMenu).props().open).toBeFalsy();
  });
});
