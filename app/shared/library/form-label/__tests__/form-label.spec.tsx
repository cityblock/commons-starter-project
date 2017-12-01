import { shallow } from 'enzyme';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import FormLabel from '../form-label';

describe('Task Create Modal Shared Components', () => {
  it('returns a formatted message with the correct id', () => {
    const messageId = 'Morse code stuffs';
    const htmlFor = 'eleven';

    const wrapper = shallow(<FormLabel messageId={messageId} htmlFor={htmlFor} />);

    expect(wrapper.find(FormattedMessage).length).toBe(1);
    expect(wrapper.find(FormattedMessage).props().id).toBe(messageId);
  });
});
