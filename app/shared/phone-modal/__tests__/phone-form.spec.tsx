import { shallow } from 'enzyme';
import { values } from 'lodash';
import React from 'react';
import { PhoneTypeOptions } from '../../../graphql/types';
import FormLabel from '../../../shared/library/form-label/form-label';
import RadioGroup from '../../../shared/library/radio-group/radio-group';
import RadioInput from '../../../shared/library/radio-input/radio-input';
import Select from '../../../shared/library/select/select';
import TextInput from '../../../shared/library/text-input/text-input';
import PhoneForm from '../phone-form';

describe('Render Phone Form', () => {
  const onChange = () => true;
  const wrapper = shallow(<PhoneForm onChange={onChange} />);

  it('renders empty phone form', () => {
    expect(wrapper.find(FormLabel)).toHaveLength(3);
    expect(wrapper.find(TextInput)).toHaveLength(2);
    expect(wrapper.find(Select)).toHaveLength(1);

    expect(
      wrapper
        .find(FormLabel)
        .at(0)
        .props().messageId,
    ).toBe('phone.phoneNumber');
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
        .find(TextInput)
        .at(0)
        .props().name,
    ).toBe('phoneNumber');

    expect(
      wrapper
        .find(FormLabel)
        .at(1)
        .props().messageId,
    ).toBe('phone.type');
    expect(wrapper.find(Select).props().value).toBeFalsy();
    expect(wrapper.find(Select).props().onChange).toBe(onChange);
    expect(wrapper.find(Select).props().large).toBe(true);
    expect(wrapper.find(Select).props().prefix).toBe('phone');
    expect(wrapper.find(Select).props().name).toBe('type');
    expect(wrapper.find(Select).props().options).toMatchObject(values(PhoneTypeOptions));
    expect(wrapper.find(Select).props().hasPlaceholder).toBeTruthy();

    expect(
      wrapper
        .find(FormLabel)
        .at(2)
        .props().messageId,
    ).toBe('phone.description');
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
    expect(
      wrapper
        .find(TextInput)
        .at(1)
        .props().name,
    ).toBe('description');
  });

  it('renders is primary phone number toggle', () => {
    const onPrimaryChange = () => true;
    wrapper.setProps({
      onPrimaryChange,
      isPrimary: false,
    });

    expect(wrapper.find(FormLabel)).toHaveLength(4);
    expect(wrapper.find(TextInput)).toHaveLength(2);
    expect(wrapper.find(Select)).toHaveLength(1);

    expect(
      wrapper
        .find(FormLabel)
        .at(3)
        .props().messageId,
    ).toBe('phone.isPrimary');
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

  it('renders filled out phone form', () => {
    const onPrimaryChange = () => true;
    wrapper.setProps({
      phoneNumber: '1',
      description: 'D',
      type: 'mobile',
      isPrimary: true,
      onPrimaryChange,
    });

    expect(wrapper.find(FormLabel)).toHaveLength(4);
    expect(wrapper.find(TextInput)).toHaveLength(2);
    expect(wrapper.find(Select)).toHaveLength(1);

    expect(
      wrapper
        .find(TextInput)
        .at(0)
        .props().value,
    ).toBe('1');
    expect(wrapper.find(Select).props().value).toBe('mobile');
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
