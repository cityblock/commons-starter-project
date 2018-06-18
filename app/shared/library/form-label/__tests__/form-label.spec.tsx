import { shallow } from 'enzyme';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import FormLabel from '../form-label';

describe('Task Create Modal Shared Components', () => {
  const htmlFor = 'eleven';
  const text = 'Demogorgon';
  const wrapper = shallow(<FormLabel text={text} htmlFor={htmlFor} />);

  it('returns form label with custom text', () => {
    expect(wrapper.find('label').length).toBe(1);
    expect(wrapper.find('label').text()).toBe(text);
    expect(wrapper.find('label').props().className).toBe('label');
  });

  it('applies custom styles', () => {
    const className = 'mindFlayer';
    wrapper.setProps({ className });

    expect(wrapper.find('label').props().className).toBe(`label ${className}`);
  });

  it('applies gray and top padding styles if specified', () => {
    wrapper.setProps({ className: '', gray: true, topPadding: true });
    expect(wrapper.find('label').props().className).toBe('label completed topPadding');
  });

  it('applies small styles if specified', () => {
    wrapper.setProps({ gray: false, topPadding: false, small: true });
    expect(wrapper.find('label').props().className).toBe('label small');
  });

  it('returns a formatted message with the correct id', () => {
    const messageId = 'Morse code stuffs';
    const wrapper2 = shallow(<FormLabel messageId={messageId} htmlFor={htmlFor} />);

    expect(wrapper2.find(FormattedMessage).length).toBe(1);
    expect(wrapper2.find(FormattedMessage).props().id).toBe(messageId);
  });
});
