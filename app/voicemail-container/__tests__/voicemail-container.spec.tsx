import { shallow } from 'enzyme';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from '../../shared/library/icon/icon';
import MobileHeader from '../../shared/library/mobile-header/mobile-header';
import { VoicemailContainer } from '../voicemail-container';

describe('Voicemail Container', () => {
  const wrapper = shallow(<VoicemailContainer getSignedVoicemailUrl={jest.fn()} />);

  it('renders container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders mobile header', () => {
    expect(wrapper.find(MobileHeader).props().messageId).toBe('header.voicemail');
  });

  it('renders icon', () => {
    expect(wrapper.find(Icon).props().name).toBe('contactPhone');
    expect(wrapper.find(Icon).props().color).toBe('blue');
  });

  it('renders formatted message', () => {
    expect(wrapper.find(FormattedMessage).props().id).toBe('voicemail.loading');
  });
});
