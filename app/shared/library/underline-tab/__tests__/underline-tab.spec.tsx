import { shallow } from 'enzyme';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import UnderlineTab from '../underline-tab';

describe('Library Underline Tab Component', () => {
  const messageId = 'valarMorghulis';
  const wrapper = shallow(<UnderlineTab messageId={messageId} selected={true} href="/braavos" />);

  it('renders a formatted message with correct id', () => {
    expect(wrapper.find(FormattedMessage).length).toBe(1);
    expect(wrapper.find(FormattedMessage).props().id).toBe(messageId);
  });
});
