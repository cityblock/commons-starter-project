import { shallow } from 'enzyme';
import React from 'react';
import FormLabel from '../../../shared/library/form-label/form-label';
import RadioGroup from '../../../shared/library/radio-group/radio-group';
import RadioInput from '../../../shared/library/radio-input/radio-input';
import TextInput from '../../../shared/library/text-input/text-input';
import EmailForm from '../email-form';

describe('Render Email Form', () => {
  const onChange = () => true;
  const wrapper = shallow(<EmailForm onChange={onChange} />);

  it('renders empty email form', () => {
    expect(wrapper.find(FormLabel)).toHaveLength(2);
    expect(wrapper.find(TextInput)).toHaveLength(2);

    expect(
      wrapper
        .find(FormLabel)
        .at(0)
        .props().messageId,
    ).toBe('email.emailAddress');
    expect(
      wrapper
        .find(TextInput)
        .at(0)
        .props().value,
    ).toBeFalsy();
    expect(
      wrapper
        .find(TextInput)
        .at(0)
        .props().onChange,
    ).toBe(onChange);

    expect(
      wrapper
        .find(FormLabel)
        .at(1)
        .props().messageId,
    ).toBe('email.description');
    expect(
      wrapper
        .find(TextInput)
        .at(1)
        .props().value,
    ).toBeFalsy();
    expect(
      wrapper
        .find(TextInput)
        .at(1)
        .props().onChange,
    ).toBe(onChange);
  });

  it('renders is primary email address toggle', () => {
    const onPrimaryChange = () => true;
    wrapper.setProps({
      onPrimaryChange,
      isPrimary: false,
    });

    expect(wrapper.find(FormLabel)).toHaveLength(3);
    expect(wrapper.find(TextInput)).toHaveLength(2);

    expect(
      wrapper
        .find(FormLabel)
        .at(2)
        .props().messageId,
    ).toBe('email.isPrimary');
    expect(wrapper.find(RadioGroup)).toHaveLength(1);

    const radioInputs = wrapper.find(RadioInput);
    expect(radioInputs).toHaveLength(2);

    expect(radioInputs.at(0).props().name).toBe('isPrimary');
    expect(radioInputs.at(0).props().value).toBe('false');
    expect(radioInputs.at(0).props().checked).toBeTruthy();
    expect(radioInputs.at(0).props().label).toBe('No');
    expect(radioInputs.at(0).props().onChange).toBe(onPrimaryChange);

    expect(radioInputs.at(1).props().name).toBe('isPrimary');
    expect(radioInputs.at(1).props().value).toBe('true');
    expect(radioInputs.at(1).props().checked).toBeFalsy();
    expect(radioInputs.at(1).props().label).toBe('Yes');
    expect(radioInputs.at(1).props().onChange).toBe(onPrimaryChange);
  });

  it('renders filled out email form', () => {
    const onPrimaryChange = () => true;
    wrapper.setProps({
      emailAddress: 'E',
      description: 'D',
      isPrimary: true,
      onPrimaryChange,
    });

    expect(wrapper.find(FormLabel)).toHaveLength(3);
    expect(wrapper.find(TextInput)).toHaveLength(2);

    expect(
      wrapper
        .find(TextInput)
        .at(0)
        .props().value,
    ).toBe('E');
    expect(
      wrapper
        .find(TextInput)
        .at(1)
        .props().value,
    ).toBe('D');
    expect(
      wrapper
        .find(RadioInput)
        .at(1)
        .props().checked,
    ).toBeTruthy();
  });
});
