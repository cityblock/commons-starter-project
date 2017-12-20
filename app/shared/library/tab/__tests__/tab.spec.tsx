import { shallow } from 'enzyme';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Tab from '../tab';

describe('Library Tab Component', () => {
  const messageId = 'valarMorghulis';
  const wrapper = shallow(<Tab messageId={messageId} selected={true} href="/braavos" />);

  it('renders a formatted message with correct id', () => {
    expect(wrapper.find(FormattedMessage).length).toBe(1);
    expect(wrapper.find(FormattedMessage).props().id).toBe(messageId);
  });
});
