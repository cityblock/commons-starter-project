import { shallow } from 'enzyme';
import * as React from 'react';
import Button from '../../../shared/library/button/button';
import CBOCategorySelect from '../../../shared/library/cbo-category-select/cbo-category-select';
import EditableMultilineText from '../../../shared/library/editable-multiline-text/editable-multiline-text';
import StateSelect from '../../../shared/library/state-select/state-select';
import { CBO } from '../../../shared/util/test-data';
import { CBOEdit } from '../cbo-edit';

describe('Builder CBO Edit Component', () => {
  const placeholderFn = jest.fn();

  const wrapper = shallow(
    <CBOEdit close={placeholderFn} deleteCBO={placeholderFn} editCBO={placeholderFn} CBO={CBO} />,
  );

  it('renders button to close CBO', () => {
    expect(wrapper.find(Button).length).toBe(2);
    expect(
      wrapper
        .find(Button)
        .at(0)
        .props().messageId,
    ).toBe('CBOs.close');
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

  it('renders button to delete CBO', () => {
    expect(
      wrapper
        .find(Button)
        .at(1)
        .props().messageId,
    ).toBe('CBOs.delete');
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
    expect(wrapper.find('h4').length).toBe(7);
  });

  it('renders editable text field for name', () => {
    expect(wrapper.find(EditableMultilineText).length).toBe(7);
    expect(
      wrapper
        .find(EditableMultilineText)
        .at(0)
        .props().text,
    ).toBe(CBO.name);
  });

  it('renders select for CBO category', () => {
    expect(wrapper.find(CBOCategorySelect).length).toBe(1);
    expect(wrapper.find(CBOCategorySelect).props().categoryId).toBe(CBO.categoryId);
  });

  it('renders editable text field for address', () => {
    expect(
      wrapper
        .find(EditableMultilineText)
        .at(1)
        .props().text,
    ).toBe(CBO.address);
  });

  it('renders editable text field for city', () => {
    expect(
      wrapper
        .find(EditableMultilineText)
        .at(2)
        .props().text,
    ).toBe(CBO.city);
  });

  it('renders select for state', () => {
    expect(wrapper.find(StateSelect).length).toBe(1);
    expect(wrapper.find(StateSelect).props().value).toBe(CBO.state);
  });

  it('renders editable text field for zip', () => {
    expect(
      wrapper
        .find(EditableMultilineText)
        .at(3)
        .props().text,
    ).toBe(CBO.zip);
  });

  it('renders editable text field for phone', () => {
    expect(
      wrapper
        .find(EditableMultilineText)
        .at(4)
        .props().text,
    ).toBe(CBO.phone);
  });

  it('renders editable text field for fax', () => {
    expect(
      wrapper
        .find(EditableMultilineText)
        .at(5)
        .props().text,
    ).toBe(CBO.fax);
  });

  it('renders editable text field for url', () => {
    expect(
      wrapper
        .find(EditableMultilineText)
        .at(6)
        .props().text,
    ).toBe(CBO.url);
  });
});
