import { shallow } from 'enzyme';
import React from 'react';
import FormLabel from '../../../shared/library/form-label/form-label';
import TextInput from '../../../shared/library/text-input/text-input';
import AddressForm from '../address-form';

describe('Render Address Form', () => {
  const onChange = () => true;
  const wrapper = shallow(<AddressForm onChange={onChange} />);

  it('renders empty address form', () => {
    expect(wrapper.find(FormLabel).length).toBe(6);
    expect(wrapper.find(TextInput).length).toBe(6);

    expect(
      wrapper
        .find(FormLabel)
        .at(0)
        .props().messageId,
    ).toBe('address.street1');
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
    ).toBe('address.street2');
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
        .find(FormLabel)
        .at(2)
        .props().messageId,
    ).toBe('address.city');
    expect(
      wrapper
        .find(TextInput)
        .at(2)
        .props().value,
    ).toBeFalsy();
    expect(
      wrapper
        .find(TextInput)
        .at(2)
        .props().onChange,
    ).toBe(onChange);

    expect(
      wrapper
        .find(FormLabel)
        .at(3)
        .props().messageId,
    ).toBe('address.state');
    expect(
      wrapper
        .find(TextInput)
        .at(3)
        .props().value,
    ).toBeFalsy();
    expect(
      wrapper
        .find(TextInput)
        .at(3)
        .props().onChange,
    ).toBe(onChange);
    expect(
      wrapper
        .find(TextInput)
        .at(3)
        .props().pattern,
    ).toBe('[A-Za-z]{2}');

    expect(
      wrapper
        .find(FormLabel)
        .at(4)
        .props().messageId,
    ).toBe('address.zip');
    expect(
      wrapper
        .find(TextInput)
        .at(4)
        .props().value,
    ).toBeFalsy();
    expect(
      wrapper
        .find(TextInput)
        .at(4)
        .props().onChange,
    ).toBe(onChange);
    expect(
      wrapper
        .find(TextInput)
        .at(4)
        .props().pattern,
    ).toBe('[0-9]{5}');

    expect(
      wrapper
        .find(FormLabel)
        .at(5)
        .props().messageId,
    ).toBe('address.description');
    expect(
      wrapper
        .find(TextInput)
        .at(5)
        .props().value,
    ).toBeFalsy();
    expect(
      wrapper
        .find(TextInput)
        .at(5)
        .props().onChange,
    ).toBe(onChange);
  });

  it('renders filled out address form', () => {
    wrapper.setProps({
      street1: 'A',
      street2: 'E',
      city: 'B',
      state: 'C',
      zip: '1',
      description: 'D',
    });

    expect(wrapper.find(FormLabel).length).toBe(6);
    expect(wrapper.find(TextInput).length).toBe(6);

    expect(
      wrapper
        .find(TextInput)
        .at(0)
        .props().value,
    ).toBe('A');
    expect(
      wrapper
        .find(TextInput)
        .at(1)
        .props().value,
    ).toBe('E');
    expect(
      wrapper
        .find(TextInput)
        .at(2)
        .props().value,
    ).toBe('B');
    expect(
      wrapper
        .find(TextInput)
        .at(3)
        .props().value,
    ).toBe('C');
    expect(
      wrapper
        .find(TextInput)
        .at(4)
        .props().value,
    ).toBe('1');
    expect(
      wrapper
        .find(TextInput)
        .at(5)
        .props().value,
    ).toBe('D');
  });
});
