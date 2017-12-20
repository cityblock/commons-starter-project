import { shallow } from 'enzyme';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import BackLink from '../back-link';

describe('Library Back Link Component', () => {
  const messageId = 'cerseiLannister';
  const href = '/kings/landing';

  const wrapper = shallow(<BackLink messageId={messageId} href={href} />);

  it('renders formatted message with correct id', () => {
    expect(wrapper.find(FormattedMessage).length).toBe(1);
    expect(wrapper.find(FormattedMessage).props().id).toBe(messageId);
  });
});
