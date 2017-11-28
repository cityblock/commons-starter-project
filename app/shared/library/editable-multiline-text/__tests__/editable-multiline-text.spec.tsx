import { shallow } from 'enzyme';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import EditableMultilineText from '../editable-multiline-text';

describe('Library Editable Text Component', () => {
  const text = 'Mike at the Snow Ball';
  const editedText = 'Mike and Eleven at the Snow Ball';
  const onEnterPress = () => true as any;
  const wrapper = shallow(<EditableMultilineText text={text} onEnterPress={onEnterPress} />);

  it('renders text', () => {
    expect(wrapper.find('p').length).toBe(1);
    expect(wrapper.find('p').text()).toBe(text);
    expect(wrapper.find('p').props().className).toBe('text');
  });

  it('renders a text area', () => {
    expect(wrapper.find('textarea').length).toBe(1);
    expect(wrapper.find('textarea').props().value).toBe(text);
    expect(wrapper.find('textarea').props().className).toBe('edit hide');
  });

  it('changes display styling in edit mode', () => {
    wrapper.setState({ editMode: true });
    expect(wrapper.find('p').props().className).toBe('text hide');
    expect(wrapper.find('textarea').props().className).toBe('edit');
  });

  it('changes text in field on change', () => {
    wrapper.setState({ editedText });
    expect(wrapper.find('textarea').props().value).toBe(editedText);
  });

  it('applies error styles on error', () => {
    wrapper.setState({ error: 'Demogorgon!' });
    expect(wrapper.find('textarea').props().className).toBe('edit error');
  });

  it('applies description styles if that flag is true', () => {
    const wrapper2 = shallow(
      <EditableMultilineText text={text} onEnterPress={onEnterPress} descriptionField={true} />,
    );

    expect(wrapper2.find('p').props().className).toBe('text description');
    expect(wrapper2.find('textarea').props().className).toBe('edit hide descriptionEdit');
  });

  it('applies custom styles if passed as props', () => {
    const wrapper2 = shallow(
      <EditableMultilineText
        text={text}
        onEnterPress={onEnterPress}
        textStyles="custom"
        editStyles="customEdit"
      />,
    );

    expect(wrapper2.find('p').props().className).toBe('text custom');
    expect(wrapper2.find('textarea').props().className).toBe('edit hide customEdit');
  });

  it('returns translated placeholder message if empty field', () => {
    const messageId = 'el';

    const wrapper2 = shallow(
      <EditableMultilineText
        text=""
        onEnterPress={onEnterPress}
        placeholderMessageId={messageId}
      />,
    );

    expect(wrapper2.find('p').length).toBe(0);
    expect(wrapper2.find(FormattedMessage).length).toBe(1);
    expect(wrapper2.find(FormattedMessage).props().id).toBe(messageId);
  });
});
