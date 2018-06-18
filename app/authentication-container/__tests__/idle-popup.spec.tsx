import { shallow } from 'enzyme';
import React from 'react';
import { Popup } from '../../shared/popup/popup';
import { IdlePopup } from '../idle-popup';

describe('Idle popup', () => {
  const placeholderFn = jest.fn();

  it('renders visible popup', () => {
    const wrapper = shallow(
      <IdlePopup isIdle={true} idleEnd={placeholderFn} logout={placeholderFn} />,
    );
    expect(
      wrapper
        .find(Popup)
        .at(0)
        .props().visible,
    ).toBeTruthy();
  });

  it('renders hidden popup', () => {
    const wrapper = shallow(
      <IdlePopup isIdle={false} idleEnd={placeholderFn} logout={placeholderFn} />,
    );
    expect(
      wrapper
        .find(Popup)
        .at(0)
        .props().visible,
    ).toBeFalsy();
  });
});
