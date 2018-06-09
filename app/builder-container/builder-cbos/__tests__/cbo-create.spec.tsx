import { shallow } from 'enzyme';
import * as React from 'react';
import Button from '../../../shared/library/button/button';
import CBOCategorySelect from '../../../shared/library/cbo-category-select/cbo-category-select';
import StateSelect from '../../../shared/library/state-select/state-select';
import TextInput from '../../../shared/library/text-input/text-input';
import { CBOCreate } from '../cbo-create';

describe('Builder Patient List Group Create', () => {
  const placeholderFn = jest.fn();
  const errorFn = (message: string) => true as any;
  const wrapper = shallow(
    <CBOCreate
      cancelCreateCBO={placeholderFn}
      createCBO={placeholderFn}
      openErrorPopup={errorFn}
    />,
  );

  it('renders a button to close', () => {
    expect(wrapper.find(Button).length).toBe(3);
    expect(
      wrapper
        .find(Button)
        .at(0)
        .props().icon,
    ).toBe('close');
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
        .props().messageId,
    ).toBe('CBOs.close');
  });

  it('renders text input for name', () => {
    expect(wrapper.find(TextInput).length).toBe(7);
    expect(
      wrapper
        .find(TextInput)
        .at(0)
        .props().placeholderMessageId,
    ).toBe('CBOs.name');
  });

  it('renders select for CBO category', () => {
    expect(wrapper.find(CBOCategorySelect).length).toBe(1);
  });

  it('renders text input for address', () => {
    expect(
      wrapper
        .find(TextInput)
        .at(1)
        .props().placeholderMessageId,
    ).toBe('CBOs.address');
  });

  it('renders text input for city', () => {
    expect(
      wrapper
        .find(TextInput)
        .at(2)
        .props().placeholderMessageId,
    ).toBe('CBOs.city');
  });

  it('renders select for state', () => {
    expect(wrapper.find(StateSelect).length).toBe(1);
  });

  it('renders text input for zip code', () => {
    expect(
      wrapper
        .find(TextInput)
        .at(3)
        .props().placeholderMessageId,
    ).toBe('CBOs.zip');
  });

  it('renders text input for phone', () => {
    expect(
      wrapper
        .find(TextInput)
        .at(4)
        .props().placeholderMessageId,
    ).toBe('CBOs.phone');
  });

  it('renders text input for fax', () => {
    expect(
      wrapper
        .find(TextInput)
        .at(5)
        .props().placeholderMessageId,
    ).toBe('CBOs.fax');
  });

  it('renders text input for URL', () => {
    expect(
      wrapper
        .find(TextInput)
        .at(6)
        .props().placeholderMessageId,
    ).toBe('CBOs.url');
  });

  it('renders a button to cancel', () => {
    expect(
      wrapper
        .find(Button)
        .at(1)
        .props().color,
    ).toBe('white');
    expect(
      wrapper
        .find(Button)
        .at(1)
        .props().messageId,
    ).toBe('modalButtons.cancel');
  });

  it('renders a button to submit', () => {
    expect(
      wrapper
        .find(Button)
        .at(2)
        .props().messageId,
    ).toBe('CBOs.create');
  });
});
