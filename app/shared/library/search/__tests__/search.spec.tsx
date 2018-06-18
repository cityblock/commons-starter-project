import { shallow } from 'enzyme';
import React from 'react';
import SearchInput from '../input';
import SearchResults from '../results';
import Search from '../search';

describe('Library Search Component', () => {
  const value = 'Sansa';
  const placeholderFn = jest.fn();
  const searchOption1 = {
    title: 'Lady of Winterfell',
    id: 'sansa',
  };
  const searchOption2 = {
    title: 'Faceless Man',
    id: 'arya',
  };
  const searchOptions = [searchOption1, searchOption2];
  const placeholderMessageId = 'Enter your favorite Stark';
  const emptyPlaceholderMessageId = 'Not a Stark :(';

  const wrapper = shallow(
    <Search
      value={value}
      onChange={placeholderFn}
      searchOptions={searchOptions}
      onOptionClick={placeholderFn}
      placeholderMessageId={placeholderMessageId}
      emptyPlaceholderMessageId={emptyPlaceholderMessageId}
    />,
  );

  it('renders a search input', () => {
    expect(wrapper.find(SearchInput).length).toBe(1);
    expect(wrapper.find(SearchInput).props().value).toBe(value);
    expect(wrapper.find(SearchInput).props().placeholderMessageId).toBe(placeholderMessageId);
  });

  it('renders search results', () => {
    expect(wrapper.find(SearchResults).length).toBe(1);
    expect(wrapper.find(SearchResults).props().emptyPlaceholderMessageId).toBe(
      emptyPlaceholderMessageId,
    );
    expect(wrapper.find(SearchResults).props().searchResults).toEqual([]);
    expect(wrapper.find(SearchResults).props().hideResults).toBeFalsy();
  });

  it('passes search results after searching', () => {
    wrapper.setState({ searchResults: [searchOption2] });
    expect(wrapper.find(SearchResults).props().searchResults).toEqual([searchOption2]);
  });

  it('hides results if no value given', () => {
    wrapper.setProps({ value: '' });
    expect(wrapper.find(SearchResults).props().hideResults).toBeTruthy();
  });

  it('passes all options if show all triggered', () => {
    wrapper.setProps({ showAll: true });
    expect(wrapper.find(SearchResults).props().searchResults).toEqual(searchOptions);
  });
});
