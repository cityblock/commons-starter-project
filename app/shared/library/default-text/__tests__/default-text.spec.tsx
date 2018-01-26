import { shallow } from 'enzyme';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import DefaultText from '../default-text';

describe('Library Default Text', () => {
  const label = 'Winter is here';
  const wrapper = shallow(<DefaultText label={label} />);

  it('returns text with correct value', () => {
    expect(wrapper.find('p').text()).toBe(label);
    expect(wrapper.find('p').props().className).toBe('text');
  });

  it('applies inline styles if specified', () => {
    wrapper.setProps({ inline: true });

    expect(wrapper.find('p').props().className).toBe('text inline');
  });

  it('applies a different color if specified', () => {
    wrapper.setProps({ inline: false, color: 'lightBlue' });

    expect(wrapper.find('p').props().className).toBe('text lightBlue');
  });

  it('applies custom styles', () => {
    const className = 'custom';
    wrapper.setProps({ color: 'black', className });

    expect(wrapper.find('p').props().className).toBe(`text ${className}`);
  });

  it('translates a message if specified', () => {
    const messageId = 'winterIsComing';
    wrapper.setProps({ messageId });

    expect(wrapper.find(FormattedMessage).length).toBe(1);
    expect(wrapper.find(FormattedMessage).props().id).toBe(messageId);
    expect(wrapper.find('p').length).toBe(0);
  });
});
