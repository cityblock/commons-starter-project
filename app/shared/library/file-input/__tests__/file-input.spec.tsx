import { shallow } from 'enzyme';
import * as React from 'react';
import DefaultText from '../../default-text/default-text';
import FileInput from '../file-input';

describe('Library File Input Component', () => {
  const value = 'photo.jpg';
  const onChange = () => true as any;

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
    expect(text).toHaveLength(1);
    expect(text.props().messageId).toBe(placeholderMessageId);
    expect(text.props().label).toBeFalsy();
    expect(text.props().color).toBe('lightGray');

    wrapper.setProps({ value });

    const updatedText = wrapper.find(DefaultText);
    expect(updatedText).toHaveLength(1);
    expect(updatedText.props().label).toBe(value);
    expect(updatedText.props().messageId).toBeFalsy();
    expect(updatedText.props().color).toBe('black');
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
