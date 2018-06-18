import { shallow } from 'enzyme';
import React from 'react';
import Button from '../../shared/library/button/button';
import Text from '../../shared/library/text/text';
import TextAreaWithButton from '../../shared/library/textarea-with-button/textarea-with-button';
import AutomatedResponse from '../automated-response';

describe('Settings Automated Response', () => {
  const awayMessage = "Let's Go Eevee!";

  const wrapper = shallow(
    <AutomatedResponse awayMessage={awayMessage} editCurrentUser={() => true as any} />,
  );

  it('renders header text for auto response', () => {
    expect(wrapper.find(Text).props().messageId).toBe('settings.autoResponse');
    expect(wrapper.find(Text).props().size).toBe('largest');
    expect(wrapper.find(Text).props().color).toBe('black');
    expect(wrapper.find(Text).props().font).toBe('basetica');
    expect(wrapper.find(Text).props().isBold).toBeTruthy();
  });

  it('renders button to edit by default', () => {
    expect(wrapper.find(Button).props().messageId).toBe('settings.autoResponseEdit');
    expect(wrapper.find(Button).props().color).toBe('white');
    expect(wrapper.find(Button).props().className).toBe('button');
  });

  it('renders text area with button (disabled by default)', () => {
    expect(wrapper.find(TextAreaWithButton).props().value).toBe(awayMessage);
    expect(wrapper.find(TextAreaWithButton).props().placeholderMessageId).toBe(
      'settings.autoResponsePlaceholder',
    );
    expect(wrapper.find(TextAreaWithButton).props().submitMessageId).toBe('editableText.save');
    expect(wrapper.find(TextAreaWithButton).props().loadingMessageId).toBe('editableText.saving');
    expect(wrapper.find(TextAreaWithButton).props().disabled).toBeTruthy();
  });

  it('enters edit mode', () => {
    const awayMessage2 = "Let's Go Pikachu!";

    wrapper.setState({ editMode: true, editedAwayMessage: awayMessage2 });

    expect(wrapper.find(Button).length).toBe(0);
    expect(wrapper.find(TextAreaWithButton).props().disabled).toBeFalsy();
    expect(wrapper.find(TextAreaWithButton).props().value).toBe(awayMessage2);
  });
});
