import { shallow } from 'enzyme';
import * as React from 'react';
import HamburgerMenuOption from '../../../library/hamburger-menu-option/hamburger-menu-option';
import HamburgerMenu from '../../../library/hamburger-menu/hamburger-menu';
import { PatientConcernOptions } from '../options-menu';

describe('Patient Concern Options Component', () => {
  const placeholderFn = () => true as any;

  const wrapper = shallow(
    <PatientConcernOptions
      open={false}
      onMenuToggle={placeholderFn}
      patientId="janeIvs"
      patientConcernId="011"
      goalSuggestionTemplateIds={[]}
      addGoal={placeholderFn}
    />,
  );

  it('renders hamburger menu', () => {
    expect(wrapper.find(HamburgerMenu).length).toBe(1);
    expect(wrapper.find(HamburgerMenu).props().open).toBeFalsy();
    expect(wrapper.find(HamburgerMenu).props().onMenuToggle).toBe(placeholderFn);
  });

  it('renders option to add goal', () => {
    expect(wrapper.find(HamburgerMenuOption).length).toBe(1);
    expect(wrapper.find(HamburgerMenuOption).props().messageId).toBe('patientMap.addGoal');
    expect(wrapper.find(HamburgerMenuOption).props().icon).toBe('addCircleOutline');
    expect(wrapper.find(HamburgerMenuOption).props().onClick).toBe(placeholderFn);
  });

  it('opens hamburger menu', () => {
    wrapper.setProps({ open: true });
    expect(wrapper.find(HamburgerMenu).props().open).toBeTruthy();
  });
});
