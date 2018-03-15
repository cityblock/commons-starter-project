import { shallow } from 'enzyme';
import * as React from 'react';
import SmallText from '../../../../shared/library/small-text/small-text';
import InfoGroupItem from '../item';

describe('Patient Left Navigation Info Group Item', () => {
  const labelMessageId = 'kingInTheNorth';
  const value = 'Jon Snow';

  const wrapper = shallow(<InfoGroupItem labelMessageId={labelMessageId} value={value} />);

  it('renders container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders label of item', () => {
    expect(wrapper.find(SmallText).length).toBe(2);

    expect(
      wrapper
        .find(SmallText)
        .at(0)
        .props().messageId,
    ).toBe(labelMessageId);
    expect(
      wrapper
        .find(SmallText)
        .at(0)
        .props().size,
    ).toBe('large');
    expect(
      wrapper
        .find(SmallText)
        .at(0)
        .props().color,
    ).toBe('darkGray');
  });

  it('renders value', () => {
    expect(
      wrapper
        .find(SmallText)
        .at(1)
        .props().text,
    ).toBe(value);
    expect(
      wrapper
        .find(SmallText)
        .at(1)
        .props().size,
    ).toBe('large');
    expect(
      wrapper
        .find(SmallText)
        .at(1)
        .props().color,
    ).toBe('black');
    expect(
      wrapper
        .find(SmallText)
        .at(1)
        .props().isBold,
    ).toBeTruthy();
  });

  it('renders empty value message if no value given', () => {
    wrapper.setProps({ value: '' });

    expect(
      wrapper
        .find(SmallText)
        .at(1)
        .props().messageId,
    ).toBe('patientInfo.missing');
    expect(
      wrapper
        .find(SmallText)
        .at(1)
        .props().size,
    ).toBe('large');
    expect(
      wrapper
        .find(SmallText)
        .at(1)
        .props().color,
    ).toBe('lightGray');
  });

  it('renders custom empty value message', () => {
    const emptyValueMessageId = 'ladyOfWinterfell';

    wrapper.setProps({ emptyValueMessageId });

    expect(
      wrapper
        .find(SmallText)
        .at(1)
        .props().messageId,
    ).toBe(emptyValueMessageId);
  });

  it('aligns right if no label message id', () => {
    wrapper.setProps({ labelMessageId: null });

    expect(wrapper.find(SmallText).length).toBe(1);
    expect(wrapper.find('.container').props().className).toBe('container rightAlign');
  });
});
