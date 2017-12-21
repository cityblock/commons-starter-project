import { shallow } from 'enzyme';
import * as React from 'react';
/* tslint:disable:max-line-length */
import HamburgerMenuOption from '../../../shared/library/hamburger-menu-option/hamburger-menu-option';
/* tslint:enable:max-line-length */
import HamburgerMenu from '../../../shared/library/hamburger-menu/hamburger-menu';
import { PatientQuestionMenu } from '../question-menu';

describe('Patient Question Menu', () => {
  const placeholderFn = () => true as any;
  const questionId = 'warForTheDawn';

  const wrapper = shallow(
    <PatientQuestionMenu
      open={false}
      closeMenu={placeholderFn}
      openMenu={placeholderFn}
      flagComputedField={placeholderFn}
      patientAnswerIds={[]}
      questionId={questionId}
    />,
  );

  it('renders hamburger menu', () => {
    expect(wrapper.find(HamburgerMenu).length).toBe(1);
    expect(wrapper.find(HamburgerMenu).props().open).toBeFalsy();
  });

  it('renders option to flag computed field for review', () => {
    expect(wrapper.find(HamburgerMenuOption).length).toBe(1);
    expect(wrapper.find(HamburgerMenuOption).props().icon).toBe('warning');
    expect(wrapper.find(HamburgerMenuOption).props().messageId).toBe('computedField.flag');
  });

  it('opens hamburger menu', () => {
    wrapper.setProps({ open: true });
    expect(wrapper.find(HamburgerMenu).props().open).toBeTruthy();
  });
});
