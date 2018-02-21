import { shallow } from 'enzyme';
import * as React from 'react';
import DefaultText from '../../../shared/library/default-text/default-text';
import FlaggableDisplayField from '../flaggable-display-field';

describe('Render Flaggable Display Field Component', () => {
  const wrapper = shallow(
    <FlaggableDisplayField labelMessageId="field.message" value="blah" className="something" />,
  );

  it('renders display field', () => {
    expect(wrapper.find('div').length).toBe(2);
    expect(
      wrapper
        .find('div')
        .at(0)
        .props().className,
    ).toBe('container something');
    expect(
      wrapper
        .find('div')
        .at(1)
        .props().className,
    ).toBe('value');
    expect(
      wrapper
        .find('div')
        .at(1)
        .text(),
    ).toBe('blah');

    expect(wrapper.find(DefaultText).length).toBe(1);
    expect(wrapper.find(DefaultText).props().messageId).toBe('field.message');
    expect(wrapper.find(DefaultText).props().className).toBe('');
    expect(wrapper.find(DefaultText).props().color).toBe('gray');
  });

  it('renders display field with flag', () => {
    wrapper.setProps({ correctedValue: 'blahblah' });

    expect(wrapper.find(DefaultText).length).toBe(1);
    expect(wrapper.find(DefaultText).props().messageId).toBe('field.message');
    expect(wrapper.find(DefaultText).props().className).toBe('isFlagged');
    expect(wrapper.find(DefaultText).props().color).toBe('gray');

    expect(wrapper.find('div').length).toBe(3);
    expect(
      wrapper
        .find('div')
        .at(2)
        .props().className,
    ).toBe('correctedValue');
    expect(
      wrapper
        .find('div')
        .at(2)
        .text(),
    ).toBe('blahblah');
  });
});
