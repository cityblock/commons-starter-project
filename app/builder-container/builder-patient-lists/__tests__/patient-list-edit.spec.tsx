import { shallow } from 'enzyme';
import * as React from 'react';
import Button from '../../../shared/library/button/button';
import EditableMultilineText from '../../../shared/library/editable-multiline-text/editable-multiline-text';
import { patientList } from '../../../shared/util/test-data';
import { PatientListEdit } from '../patient-list-edit';

describe('Builder Patient List Edit Component', () => {
  const placeholderFn = () => true as any;

  const wrapper = shallow(
    <PatientListEdit
      close={placeholderFn}
      deletePatientList={placeholderFn}
      editPatientList={placeholderFn}
      patientList={patientList}
    />,
  );

  it('renders button to close patient list', () => {
    expect(wrapper.find(Button).length).toBe(2);
    expect(
      wrapper
        .find(Button)
        .at(0)
        .props().messageId,
    ).toBe('patientLists.close');
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
  });

  it('renders button to delete patient list', () => {
    expect(
      wrapper
        .find(Button)
        .at(1)
        .props().messageId,
    ).toBe('patientLists.delete');
    expect(
      wrapper
        .find(Button)
        .at(1)
        .props().icon,
    ).toBe('delete');
    expect(
      wrapper
        .find(Button)
        .at(1)
        .props().color,
    ).toBe('white');
  });

  it('renders labels for fields', () => {
    expect(wrapper.find('h4').length).toBe(3);
  });

  it('renders editable text field for title', () => {
    expect(wrapper.find(EditableMultilineText).length).toBe(3);
    expect(
      wrapper
        .find(EditableMultilineText)
        .at(0)
        .props().text,
    ).toBe(patientList.title);
  });

  it('renders editable text field for answer id', () => {
    expect(
      wrapper
        .find(EditableMultilineText)
        .at(1)
        .props().text,
    ).toBe(patientList.answerId);
  });

  it('renders editable text field for order', () => {
    expect(
      wrapper
        .find(EditableMultilineText)
        .at(2)
        .props().text,
    ).toBe(`${patientList.order}`);
  });
});
