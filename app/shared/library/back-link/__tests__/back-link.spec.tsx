import { shallow } from 'enzyme';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import BackLink from '../back-link';

describe('Library Back Link Component', () => {
  const messageId = 'cerseiLannister';
  const href = '/kings/landing';

  const wrapper = shallow(<BackLink href={href} />);

  it('renders default formatted message if none given', () => {
    expect(wrapper.find(FormattedMessage).length).toBe(1);
    expect(wrapper.find(FormattedMessage).props().id).toBe('backLink.back');
  });

  it('renders formatted message with correct id if one given', () => {
    wrapper.setProps({ messageId });
    expect(wrapper.find(FormattedMessage).props().id).toBe(messageId);
  });
});
