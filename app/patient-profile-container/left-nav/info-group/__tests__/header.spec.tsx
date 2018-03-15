import { shallow } from 'enzyme';
import * as React from 'react';
import Icon from '../../../../shared/library/icon/icon';
import SmallText from '../../../../shared/library/small-text/small-text';
import InfoGroupHeader from '../header';

describe('Patient Left Navigation Info Group Header', () => {
  const wrapper = shallow(
    <InfoGroupHeader selected="demographics" onClick={() => true as any} isOpen={false} />,
  );

  it('renders button', () => {
    expect(wrapper.find('button').props().className).toBe('container');
  });

  it('renders info group label', () => {
    expect(wrapper.find(SmallText).props().messageId).toBe('patientInfo.demographics');
    expect(wrapper.find(SmallText).props().size).toBe('largest');
    expect(wrapper.find(SmallText).props().color).toBe('black');
    expect(wrapper.find(SmallText).props().font).toBe('basetica');
    expect(wrapper.find(SmallText).props().isBold).toBeTruthy();
  });

  it('renders icon to open accordion', () => {
    expect(wrapper.find(Icon).props().name).toBe('keyboardArrowDown');
    expect(wrapper.find(Icon).props().color).toBe('black');
  });

  it('renders icon to close accordion if info group open', () => {
    wrapper.setProps({ isOpen: true });

    expect(wrapper.find(Icon).props().name).toBe('keyboardArrowUp');
  });
});
