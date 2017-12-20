import { shallow } from 'enzyme';
import * as React from 'react';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import DateInfo from '../date-info';

describe('Library Date Info Component', () => {
  const date = 'Snow Ball';
  const messageId = '011';

  const wrapper = shallow(<DateInfo date={date} messageId={messageId} />);

  it('renders container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders formatted message with specified id', () => {
    expect(wrapper.find(FormattedMessage).length).toBe(1);
    expect(wrapper.find(FormattedMessage).props().id).toBe(messageId);
  });

  it('renders formatted date', () => {
    expect(wrapper.find(FormattedRelative).length).toBe(1);
    expect(wrapper.find(FormattedRelative).props().value).toBe(date);
  });

  it('renders default label if specified', () => {
    wrapper.setProps({ label: 'updated', messageId: null });
    expect(wrapper.find(FormattedMessage).props().id).toBe('dateInfo.updated');
  });
});
