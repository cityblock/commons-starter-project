import { shallow } from 'enzyme';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import SmallText from '../small-text';

describe('Library Date Info Component', () => {
  const messageId = 'kingOfTheNorth';
  const text = 'Jon Snow';

  const wrapper = shallow(<SmallText text={text} />);

  it('renders text with default styles', () => {
    expect(wrapper.find('p').length).toBe(1);
    expect(wrapper.find('p').text()).toBe(text);
    expect(wrapper.find('p').props().className).toBe('text');
  });

  it('renders text with custom styles', () => {
    const className = 'blueEyesWightDragon';
    wrapper.setProps({ className });

    expect(wrapper.find('p').props().className).toBe(`text ${className}`);
  });

  it('renders black text', () => {
    wrapper.setProps({ className: '', color: 'black' });
    expect(wrapper.find('p').props().className).toBe(`text black`);
  });

  it('renders formatted message with specified id if passed', () => {
    wrapper.setProps({ messageId });
    expect(wrapper.find(FormattedMessage).length).toBe(1);
    expect(wrapper.find(FormattedMessage).props().id).toBe(messageId);
    expect(wrapper.find(FormattedMessage).props().values).toEqual({});
  });

  it('passes values to translate message if specified', () => {
    const messageValues = { name: 'Aegon Targaryen' };
    wrapper.setProps({ messageValues });

    expect(wrapper.find(FormattedMessage).props().values).toEqual(messageValues);
  });
});
