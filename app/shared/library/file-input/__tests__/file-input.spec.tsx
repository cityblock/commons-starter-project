import { shallow } from 'enzyme';
import * as React from 'react';
import DefaultText from '../../default-text/default-text';
import FileInput from '../file-input';

describe('Library File Input Component', () => {
  const value = 'photo.jpg';
  const onChange = jest.fn();

  it('renders input with correct value and change handler', () => {
    const wrapper = shallow(<FileInput value={value} onChange={onChange} />);

    const input = wrapper.find('input');
    expect(input).toHaveLength(1);

    expect(input.props().type).toBe('file');
    expect(input.props().value).toBeFalsy();
    expect(input.props().onChange).toBe(onChange);
    expect(input.props().required).toBeFalsy();
    expect(input.props().name).toBeFalsy();
    expect(input.props().id).toBeFalsy();
  });

  it('renders text over input', () => {
    const placeholderMessageId = 'someId';
    const wrapper = shallow(
      <FileInput value="" onChange={onChange} placeholderMessageId={placeholderMessageId} />,
    );

    const text = wrapper.find(DefaultText);
    expect(text).toHaveLength(2);

    const placeholderProps = text.at(0).props();
    expect(placeholderProps.messageId).toBe(placeholderMessageId);
    expect(placeholderProps.label).toBeFalsy();
    expect(placeholderProps.color).toBe('lightGray');

    const uploadTextProps = text.at(1).props();
    expect(uploadTextProps.messageId).toBe('fileInput.chooseAFile');

    wrapper.setProps({ value });

    const filenameText = wrapper.find(DefaultText);
    expect(filenameText).toHaveLength(1);

    const filenameProps = filenameText.props();
    expect(filenameProps.label).toBe(value);
    expect(filenameProps.messageId).toBeFalsy();
    expect(filenameProps.color).toBe('black');
  });

  it('passes optional values if included', () => {
    const name = 'firstFile';
    const id = 'fileId';
    const acceptTypes = '.jpg, .pdf';
    const wrapper = shallow(
      <FileInput
        value={value}
        onChange={onChange}
        id={id}
        name={name}
        acceptTypes={acceptTypes}
        required={true}
      />,
    );

    const inputProps = wrapper.find('input').props();
    expect(inputProps.name).toBe(name);
    expect(inputProps.id).toBe(id);
    expect(inputProps.required).toBeTruthy();
    expect(inputProps.accept).toBe(acceptTypes);
  });
});
