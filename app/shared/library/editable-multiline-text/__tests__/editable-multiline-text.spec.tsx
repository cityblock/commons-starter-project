import { shallow } from 'enzyme';
import * as React from 'react';
import SmallText from '../../small-text/small-text';
import TextAreaWithButton from '../../textarea-with-button/textarea-with-button';
import { EditableMultilineText } from '../editable-multiline-text';

describe('Library Editable Text Component', () => {
  const text = 'Mike at the Snow Ball';
  const onSubmit = () => true as any;
  const wrapper = shallow(<EditableMultilineText text={text} onSubmit={onSubmit} />);

  it('renders text', () => {
    expect(wrapper.find('p').props().className).toBe('text');
    expect(wrapper.find('p').text()).toBe(text);

    expect(wrapper.find(TextAreaWithButton).length).toBe(0);
    expect(wrapper.find(SmallText).length).toBe(0);
  });

  it('renders text area with button if in edit mode', () => {
    wrapper.setState({ editMode: true });

    expect(wrapper.find(TextAreaWithButton).props().value).toBe(text);
    expect(wrapper.find(TextAreaWithButton).props().submitMessageId).toBe('editableText.save');
    expect(wrapper.find(TextAreaWithButton).props().loadingMessageId).toBe('editableText.saving');
    expect(wrapper.find(TextAreaWithButton).props().placeholderMessageId).toBeFalsy();
    expect(wrapper.find(TextAreaWithButton).props().titleStyles).toBeTruthy();

    expect(wrapper.find('p').length).toBe(0);
  });

  it('edits text in the text area', () => {
    const editedText = 'Mike and Eleven at the Snow Ball';
    wrapper.setState({ editedText });

    expect(wrapper.find(TextAreaWithButton).props().value).toBe(editedText);
  });

  it('applies description field styles', () => {
    wrapper.setProps({ descriptionField: true });

    expect(wrapper.find(TextAreaWithButton).props().titleStyles).toBeFalsy();

    wrapper.setState({ editMode: false });

    expect(wrapper.find('p').props().className).toBe('text description');
  });

  it('renders placeholder if no text', () => {
    wrapper.setProps({ text: '' });

    expect(wrapper.find(SmallText).props().messageId).toBe('editableText.clickToEdit');
    expect(wrapper.find(SmallText).props().font).toBe('basetica');
    expect(wrapper.find(SmallText).props().color).toBe('lightGray');
    expect(wrapper.find(SmallText).props().size).toBe('large');
  });

  it('uses custom placeholder message id', () => {
    const placeholderMessageId = 'Click here to destroy the demogorgon...';

    wrapper.setProps({ placeholderMessageId });

    expect(wrapper.find(SmallText).props().messageId).toBe(placeholderMessageId);

    wrapper.setState({ editMode: true });

    expect(wrapper.find(TextAreaWithButton).props().placeholderMessageId).toBe(
      placeholderMessageId,
    );
  });
});
