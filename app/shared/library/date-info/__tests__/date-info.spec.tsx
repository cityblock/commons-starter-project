import { shallow } from 'enzyme';
import * as React from 'react';
import { FormattedRelative } from 'react-intl';
import TextInfo from '../../text-info/text-info';
import DateInfo from '../date-info';

describe('Library Date Info Component', () => {
  const date = 'Snow Ball';
  const messageId = '011';

  const wrapper = shallow(<DateInfo date={date} messageId={messageId} />);

  it('renders container', () => {
    expect(wrapper.find('div').length).toBe(1);
  });

  it('applies custom styles if specified', () => {
    const className = 'demogorgon';
    wrapper.setProps({ className });
    expect(wrapper.find('div').props().className).toBe(className);
  });

  it('renders formatted date', () => {
    expect(wrapper.find(FormattedRelative).length).toBe(1);
    expect(wrapper.find(FormattedRelative).props().value).toBe(date);
  });

  it('passes custom units if specified to formatted relative', () => {
    const units = 'day';
    wrapper.setProps({ units });

    expect(wrapper.find(FormattedRelative).props().units).toBe(units);
  });

  it('renders unknown date if date is null', () => {
    wrapper.setProps({ date: null, label: 'due' });

    expect(wrapper.find(TextInfo).length).toBe(1);
    expect(wrapper.find(TextInfo).props().messageId).toBe('dateInfo.due');
    expect(wrapper.find(TextInfo).props().textMessageId).toBe('dateInfo.nullDate');
  });
});
