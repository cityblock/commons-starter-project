import { shallow } from 'enzyme';
import * as React from 'react';
import SmallText from '../../small-text/small-text';
import TextInfo from '../text-info';

describe('Library Text Info Component', () => {
  const messageId = 'greyWind';
  const text = 'Robb Stark';

  const wrapper = shallow(<TextInfo messageId={messageId} text={text} />);

  it('renders label small text', () => {
    expect(wrapper.find(SmallText).length).toBe(2);
    expect(
      wrapper
        .find(SmallText)
        .at(0)
        .props().messageId,
    ).toBe(messageId);
    expect(
      wrapper
        .find(SmallText)
        .at(0)
        .props().className,
    ).toBe('margin');
  });

  it('renders value small text', () => {
    expect(
      wrapper
        .find(SmallText)
        .at(1)
        .props().text,
    ).toBe(text);
    expect(
      wrapper
        .find(SmallText)
        .at(1)
        .props().color,
    ).toBe('black');
  });

  it('applies optional styles to container', () => {
    const className = 'kingOfTheNorth';
    wrapper.setProps({ className });

    expect(wrapper.find('div').props().className).toBe(className);
  });

  it('applies optional styles to value text', () => {
    const textStyles = 'leaderOfTheNorthernArmy';
    wrapper.setProps({ textStyles });

    expect(
      wrapper
        .find(SmallText)
        .at(1)
        .props().className,
    ).toBe(textStyles);
  });

  it('optionally sets color of value text', () => {
    const color = 'gray';
    wrapper.setProps({ color });

    expect(
      wrapper
        .find(SmallText)
        .at(1)
        .props().color,
    ).toBe(color);
  });

  it('passes message id to value text if specified', () => {
    const textMessageId = 'jonSnow';
    wrapper.setProps({ textMessageId });

    expect(
      wrapper
        .find(SmallText)
        .at(1)
        .props().messageId,
    ).toBe(textMessageId);
    expect(
      wrapper
        .find(SmallText)
        .at(1)
        .props().text,
    ).toBeFalsy();
  });
});
