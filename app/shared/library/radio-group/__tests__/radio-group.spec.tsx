import { shallow } from 'enzyme';
import * as React from 'react';
import RadioInput from '../../radio-input/radio-input';
import RadioGroup from '../radio-group';

describe('Library Radio Group Component', () => {
  const name = 'got';
  const value1 = 'greyWind';
  const label1 = "Robb Stark's Direwolf";
  const value2 = 'ghost';
  const label2 = "Jon Snow's Direwolf";
  const placeholderFn = () => true as any;

  const wrapper = shallow(
    <RadioGroup>
      <RadioInput
        name={name}
        value={value1}
        onChange={placeholderFn}
        label={label1}
        checked={false}
      />
      <RadioInput
        name={name}
        value={value2}
        onChange={placeholderFn}
        label={label2}
        checked={true}
      />
    </RadioGroup>,
  );

  it('renders a form element', () => {
    expect(wrapper.find('form').length).toBe(1);
    expect(wrapper.find('form').props().className).toBe('container');
  });

  it('renders all children', () => {
    expect(wrapper.find(RadioInput).length).toBe(2);
  });

  it('renders first radio input', () => {
    expect(
      wrapper
        .find(RadioInput)
        .at(0)
        .props().value,
    ).toBe(value1);
    expect(
      wrapper
        .find(RadioInput)
        .at(0)
        .props().label,
    ).toBe(label1);
    expect(
      wrapper
        .find(RadioInput)
        .at(0)
        .props().checked,
    ).toBeFalsy();
  });

  it('renders second radio input', () => {
    expect(
      wrapper
        .find(RadioInput)
        .at(1)
        .props().value,
    ).toBe(value2);
    expect(
      wrapper
        .find(RadioInput)
        .at(1)
        .props().label,
    ).toBe(label2);
    expect(
      wrapper
        .find(RadioInput)
        .at(1)
        .props().checked,
    ).toBeTruthy();
  });
});
