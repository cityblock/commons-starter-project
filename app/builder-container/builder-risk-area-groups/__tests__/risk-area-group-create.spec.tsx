import { shallow } from 'enzyme';
import * as React from 'react';
import Button from '../../../shared/library/button/button';
import TextInput from '../../../shared/library/text-input/text-input';
import { RiskAreaGroupCreate } from '../risk-area-group-create';

describe('Builder Risk Area Group Create', () => {
  const placeholderFn = () => true as any;
  const wrapper = shallow(
    <RiskAreaGroupCreate
      cancelCreateRiskAreaGroup={placeholderFn}
      createRiskAreaGroup={placeholderFn}
    />,
  );

  it('renders a button to close', () => {
    expect(wrapper.find(Button).length).toBe(3);
    expect(
      wrapper
        .find(Button)
        .at(0)
        .props().icon,
    ).toBe('close');
    expect(
      wrapper
        .find(Button)
        .at(0)
        .props().color,
    ).toBe('white');
    expect(
      wrapper
        .find(Button)
        .at(0)
        .props().messageId,
    ).toBe('riskAreaGroup.close');
  });

  it('renders text input for title', () => {
    expect(wrapper.find(TextInput).length).toBe(5);
    expect(
      wrapper
        .find(TextInput)
        .at(0)
        .props().placeholderMessageId,
    ).toBe('riskAreaGroup.title');
  });

  it('renders text input for short title', () => {
    expect(
      wrapper
        .find(TextInput)
        .at(1)
        .props().placeholderMessageId,
    ).toBe('riskAreaGroup.shortTitle');
  });

  it('renders text input for order', () => {
    expect(
      wrapper
        .find(TextInput)
        .at(2)
        .props().placeholderMessageId,
    ).toBe('riskAreaGroup.order');
  });

  it('renders text input for medium risk threshold', () => {
    expect(
      wrapper
        .find(TextInput)
        .at(3)
        .props().placeholderMessageId,
    ).toBe('riskAreaGroup.mediumRiskThreshold');
  });

  it('renders text input for high risk threshold', () => {
    expect(
      wrapper
        .find(TextInput)
        .at(4)
        .props().placeholderMessageId,
    ).toBe('riskAreaGroup.highRiskThreshold');
  });

  it('renders a button to cancel', () => {
    expect(
      wrapper
        .find(Button)
        .at(1)
        .props().color,
    ).toBe('white');
    expect(
      wrapper
        .find(Button)
        .at(1)
        .props().messageId,
    ).toBe('modalButtons.cancel');
  });

  it('renders a button to submit', () => {
    expect(
      wrapper
        .find(Button)
        .at(2)
        .props().messageId,
    ).toBe('riskAreaGroup.create');
  });
});
