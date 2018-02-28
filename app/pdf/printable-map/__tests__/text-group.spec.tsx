import { Text, View } from '@react-pdf/core';
import { shallow } from 'enzyme';
import * as React from 'react';
import TextGroup from '../text-group';

describe('Printable MAP text group', () => {
  const label = 'King in the North';
  const value = 'Jon Snow';

  const wrapper = shallow(<TextGroup label={label} value={value} />);

  it('renders container', () => {
    expect(wrapper.find(View).length).toBe(1);
  });

  it('renders label text', () => {
    expect(wrapper.find(Text).length).toBe(2);

    expect(
      wrapper
        .find(Text)
        .at(0)
        .text(),
    ).toBe(label);
  });

  it('renders value text', () => {
    expect(
      wrapper
        .find(Text)
        .at(1)
        .text(),
    ).toBe(value);
  });
});
