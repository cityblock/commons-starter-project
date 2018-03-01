import { Image, Text, View } from '@react-pdf/core';
import { shallow } from 'enzyme';
import * as React from 'react';
import TextGroup, { STAR_PATH } from '../text-group';

describe('Printable MAP text group', () => {
  const label = 'King in the North';
  const value = 'Jon Snow';

  const wrapper = shallow(<TextGroup label={label} value={value} />);

  it('renders view containers', () => {
    expect(wrapper.find(View).length).toBe(2);
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

  it('does not render star image for lead by default', () => {
    expect(wrapper.find(Image).length).toBe(0);
  });

  it('renders star image for lead if specified', () => {
    wrapper.setProps({ starImage: true });

    expect(wrapper.find<{ src: string }>(Image).props().src).toBe(STAR_PATH);
  });
});
