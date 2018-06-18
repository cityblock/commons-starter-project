import { shallow } from 'enzyme';
import React from 'react';
import Option from '../../option/option';
import Select from '../../select/select';
import StateSelect from '../state-select';

describe('Library State Select Component', () => {
  const value = 'NY';
  const placeholderFn = jest.fn();

  const wrapper = shallow(<StateSelect value={value} onChange={placeholderFn} />);

  it('renders a large select component', () => {
    expect(wrapper.find(Select).length).toBe(1);
    expect(wrapper.find(Select).props().value).toBe(value);
    expect(wrapper.find(Select).props().large).toBeTruthy();
  });

  it('renders a placeholder option with default message', () => {
    expect(wrapper.find(Option).length).toBe(52);
    expect(
      wrapper
        .find(Option)
        .at(0)
        .props().value,
    ).toBeFalsy();
    expect(
      wrapper
        .find(Option)
        .at(0)
        .props().messageId,
    ).toBe('stateSelect.default');
    expect(
      wrapper
        .find(Option)
        .at(0)
        .props().disabled,
    ).toBeTruthy();
  });

  it('renders option for each state', () => {
    expect(
      wrapper
        .find(Option)
        .at(1)
        .props().value,
    ).toBe('AL');
    expect(
      wrapper
        .find(Option)
        .at(1)
        .props().disabled,
    ).toBeFalsy();
  });

  it('applies custom message id to placeholder', () => {
    const messageId = 'kingInTheNorth';
    wrapper.setProps({ messageId });

    expect(
      wrapper
        .find(Option)
        .at(0)
        .props().messageId,
    ).toBe(messageId);
  });

  it('renders full state name if specified', () => {
    wrapper.setProps({ fullName: true });

    expect(
      wrapper
        .find(Option)
        .at(1)
        .props().value,
    ).toBe('Alabama');
  });
});
