import { shallow } from 'enzyme';
import * as React from 'react';
import CheckboxInput from '../../checkbox-input/checkbox-input';
import CheckboxGroup from '../checkbox-group';

describe('Library Checkbox Group Component', () => {
  const value1 = 'nymeria';
  const label1 = "Arya Stark's Direwolf";
  const value2 = 'lady';
  const label2 = "Sansa Stark's Direwolf";
  const placeholderFn = jest.fn();

  const wrapper = shallow(
    <CheckboxGroup>
      <CheckboxInput value={value1} onChange={placeholderFn} label={label1} checked={false} />
      <CheckboxInput value={value2} onChange={placeholderFn} label={label2} checked={true} />
    </CheckboxGroup>,
  );

  it('renders a form element', () => {
    expect(wrapper.find('form').length).toBe(1);
    expect(wrapper.find('form').props().className).toBe('container');
  });

  it('renders all children', () => {
    expect(wrapper.find(CheckboxInput).length).toBe(2);
  });

  it('renders first xheckbox input', () => {
    expect(
      wrapper
        .find(CheckboxInput)
        .at(0)
        .props().value,
    ).toBe(value1);
    expect(
      wrapper
        .find(CheckboxInput)
        .at(0)
        .props().label,
    ).toBe(label1);
    expect(
      wrapper
        .find(CheckboxInput)
        .at(0)
        .props().checked,
    ).toBeFalsy();
  });

  it('renders second radio input', () => {
    expect(
      wrapper
        .find(CheckboxInput)
        .at(1)
        .props().value,
    ).toBe(value2);
    expect(
      wrapper
        .find(CheckboxInput)
        .at(1)
        .props().label,
    ).toBe(label2);
    expect(
      wrapper
        .find(CheckboxInput)
        .at(1)
        .props().checked,
    ).toBeTruthy();
  });
});
