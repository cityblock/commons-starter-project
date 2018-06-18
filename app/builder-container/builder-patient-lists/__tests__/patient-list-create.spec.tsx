import { shallow } from 'enzyme';
import React from 'react';
import Button from '../../../shared/library/button/button';
import TextInput from '../../../shared/library/text-input/text-input';
import { PatientListCreate } from '../patient-list-create';

describe('Builder Patient List Group Create', () => {
  const placeholderFn = jest.fn();
  const errorFn = (message: string) => true as any;
  const wrapper = shallow(
    <PatientListCreate
      cancelCreatePatientList={placeholderFn}
      createPatientList={placeholderFn}
      openErrorPopup={errorFn}
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
    ).toBe('patientLists.close');
  });

  it('renders text input for title', () => {
    expect(wrapper.find(TextInput).length).toBe(3);
    expect(
      wrapper
        .find(TextInput)
        .at(0)
        .props().placeholderMessageId,
    ).toBe('patientLists.title');
  });

  it('renders text input for answer id', () => {
    expect(
      wrapper
        .find(TextInput)
        .at(1)
        .props().placeholderMessageId,
    ).toBe('patientLists.answerId');
  });

  it('renders text input for order', () => {
    expect(
      wrapper
        .find(TextInput)
        .at(2)
        .props().placeholderMessageId,
    ).toBe('patientLists.order');
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
    ).toBe('patientLists.create');
  });
});
