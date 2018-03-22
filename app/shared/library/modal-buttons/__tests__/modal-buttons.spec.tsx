import { shallow } from 'enzyme';
import * as React from 'react';
import Button from '../../button/button';
import ModalButtons from '../modal-buttons';

describe('Library Modal Buttons Component', () => {
  const cancelMessageId = 'Demogorgon!';
  const submitMessageId = 'Eleven';
  const placeholderFn = () => true as any;

  const wrapper = shallow(
    <ModalButtons
      cancelMessageId={cancelMessageId}
      submitMessageId={submitMessageId}
      cancel={placeholderFn}
      submit={placeholderFn}
    />,
  );

  it('renders button container', () => {
    expect(wrapper.find('.flex').length).toBe(1);
  });

  it('renders two buttons', () => {
    expect(wrapper.find(Button).length).toBe(2);
    expect(wrapper.find('.button').length).toBe(2);
  });

  it('renders button to cancel', () => {
    expect(
      wrapper
        .find(Button)
        .at(0)
        .props().messageId,
    ).toBe(cancelMessageId);
    expect(
      wrapper
        .find(Button)
        .at(0)
        .props().color,
    ).toBe('white');
    expect(
      wrapper
        .find(Button)
        .at(0)
        .props().onClick,
    ).toBe(placeholderFn);
  });

  it('renders a button to submit', () => {
    expect(
      wrapper
        .find(Button)
        .at(1)
        .props().messageId,
    ).toBe(submitMessageId);
    expect(
      wrapper
        .find(Button)
        .at(1)
        .props().color,
    ).toBe('blue');
    expect(
      wrapper
        .find(Button)
        .at(1)
        .props().disabled,
    ).toBeFalsy();
    expect(
      wrapper
        .find(Button)
        .at(1)
        .props().onClick,
    ).toBe(placeholderFn);
  });

  it('passes default messages for cancel and submit if none provided', () => {
    wrapper.setProps({ cancelMessageId: '', submitMessageId: '' });
    expect(
      wrapper
        .find(Button)
        .at(0)
        .props().messageId,
    ).toBe('modalButtons.cancel');
    expect(
      wrapper
        .find(Button)
        .at(1)
        .props().messageId,
    ).toBe('modalButtons.submit');
  });

  it('sets the submit button to red if specified', () => {
    wrapper.setProps({ redSubmit: true });
    expect(
      wrapper
        .find(Button)
        .at(1)
        .props().color,
    ).toBe('red');
  });

  it('disables submit button if loading', () => {
    wrapper.setProps({ isLoading: true });
    expect(
      wrapper
        .find(Button)
        .at(1)
        .props().disabled,
    ).toBeTruthy();
  });
});
