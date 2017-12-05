import { shallow } from 'enzyme';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import SearchResult from '../result';

describe('Library Search Result Component', () => {
  const id = 'aryaStark';
  const title = 'First Of Her Name';
  const searchResult = { title, id };
  const value = '';
  const onOptionClick = () => true as any;

  const wrapper = shallow(
    <SearchResult searchResult={searchResult} value={value} onOptionClick={onOptionClick} />,
  );

  it('renders basic search result', () => {
    expect(wrapper.find('p').length).toBe(1);
    expect(wrapper.find('p').props().className).toBe('text');
    expect(wrapper.find('p').text()).toBe(title);

    expect(wrapper.find(FormattedMessage).length).toBe(0);
  });

  it('returns formatted message with placeholder if empty', () => {
    const emptyPlaceholderMessageId = 'Nymeria Left :(';
    wrapper.setProps({ emptyPlaceholderMessageId });
    expect(wrapper.find('p').length).toBe(0);

    expect(wrapper.find(FormattedMessage).length).toBe(1);
    expect(wrapper.find(FormattedMessage).props().id).toBe(emptyPlaceholderMessageId);
  });

  it('returns nothing if no search result present', () => {
    wrapper.setProps({ searchResult: null });
    expect(wrapper.instance()).toBeNull();
  });
});
