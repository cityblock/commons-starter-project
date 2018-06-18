import { shallow } from 'enzyme';
import React from 'react';
import Icon from '../../../../shared/library/icon/icon';
import Text from '../../../../shared/library/text/text';
import InfoGroupHeader from '../header';

describe('Patient Left Navigation Info Group Header', () => {
  const wrapper = shallow(
    <InfoGroupHeader selected="demographics" onClick={jest.fn()} isOpen={false} />,
  );

  it('renders button', () => {
    expect(wrapper.find('button').props().className).toBe('container');
  });

  it('renders info group label', () => {
    expect(wrapper.find(Text).props().messageId).toBe('patientInfo.demographics');
    expect(wrapper.find(Text).props().size).toBe('largest');
    expect(wrapper.find(Text).props().color).toBe('black');
    expect(wrapper.find(Text).props().font).toBe('basetica');
    expect(wrapper.find(Text).props().isBold).toBeTruthy();
  });

  it('renders icon to open accordion', () => {
    expect(wrapper.find(Icon).props().name).toBe('keyboardArrowDown');
    expect(wrapper.find(Icon).props().color).toBe('black');
  });

  it('renders icon to close accordion if info group open', () => {
    wrapper.setProps({ isOpen: true });

    expect(wrapper.find(Icon).props().name).toBe('keyboardArrowUp');
  });

  it('renders item count if one given', () => {
    wrapper.setProps({ itemCount: 11 });

    expect(wrapper.find(Text).length).toBe(2);

    expect(
      wrapper
        .find(Text)
        .at(1)
        .props().text,
    ).toBe('(11)');
    expect(
      wrapper
        .find(Text)
        .at(1)
        .props().size,
    ).toBe('largest');
    expect(
      wrapper
        .find(Text)
        .at(1)
        .props().color,
    ).toBe('lightBlue');
    expect(
      wrapper
        .find(Text)
        .at(1)
        .props().font,
    ).toBe('basetica');
    expect(
      wrapper
        .find(Text)
        .at(1)
        .props().isBold,
    ).toBeTruthy();
  });
});
