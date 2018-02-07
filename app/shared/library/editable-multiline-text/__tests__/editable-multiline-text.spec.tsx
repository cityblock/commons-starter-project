import { shallow } from 'enzyme';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { EditableMultilineText } from '../editable-multiline-text';

describe('Library Editable Text Component', () => {
  const text = 'Mike at the Snow Ball';
  const onEnterPress = () => true as any;
  const wrapper = shallow(<EditableMultilineText text={text} onEnterPress={onEnterPress} />);

  it('renders formatted message with default placeholder', () => {
    expect(wrapper.find(FormattedMessage).length).toBe(1);
    expect(wrapper.find(FormattedMessage).props().id).toBe('editableText.default');
  });

  it('renders formatted message with provided placeholder', () => {
    const placeholderMessageId = 'DEMOGORGON!';
    wrapper.setProps({ placeholderMessageId });

    expect(wrapper.find(FormattedMessage).props().id).toBe(placeholderMessageId);
  });
});
