import { shallow } from 'enzyme';
import * as React from 'react';
import SearchResult from '../result';
import SearchResults from '../results';

describe('Library Search Results Component', () => {
  const searchResult1 = {
    title: 'Khaleesi of the Great Grass Sea',
    id: 'dany',
  };
  const searchResult2 = {
    title: "Lord Commander of the Night's Watch",
    id: 'jonSnow',
  };
  const value = 'queen';
  const emptyPlaceholderMessageId = 'No lords or ladies matching search term';

  const placeholderFn = jest.fn();

  const wrapper = shallow(
    <SearchResults
      searchResults={[searchResult1, searchResult2]}
      value={value}
      hideResults={false}
      onOptionClick={placeholderFn}
      emptyPlaceholderMessageId={emptyPlaceholderMessageId}
    />,
  );

  it('renders container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders search results', () => {
    expect(wrapper.find(SearchResult).length).toBe(2);
    expect(
      wrapper
        .find(SearchResult)
        .at(0)
        .props().searchResult,
    ).toEqual(searchResult1);
    expect(
      wrapper
        .find(SearchResult)
        .at(0)
        .props().value,
    ).toBe(value);
    expect(
      wrapper
        .find(SearchResult)
        .at(0)
        .props().emptyPlaceholderMessageId,
    ).toBeFalsy();

    expect(
      wrapper
        .find(SearchResult)
        .at(1)
        .props().searchResult,
    ).toEqual(searchResult2);
    expect(
      wrapper
        .find(SearchResult)
        .at(1)
        .props().value,
    ).toBe(value);
    expect(
      wrapper
        .find(SearchResult)
        .at(1)
        .props().emptyPlaceholderMessageId,
    ).toBeFalsy();
  });

  it('renders empty placeholder if given and no results', () => {
    wrapper.setProps({ searchResults: [] });

    expect(wrapper.find(SearchResult).length).toBe(1);
    expect(wrapper.find(SearchResult).props().searchResult).toBeNull();
    expect(wrapper.find(SearchResult).props().value).toBe(value);
    expect(wrapper.find(SearchResult).props().emptyPlaceholderMessageId).toBe(
      emptyPlaceholderMessageId,
    );
  });

  it('hides results if specified', () => {
    wrapper.setProps({ hideResults: true });
    expect(wrapper.find(SearchResult).length).toBe(0);
  });

  it('does not hide results if show all', () => {
    wrapper.setProps({ showAll: true, searchResults: [searchResult1, searchResult2] });
    expect(wrapper.find(SearchResult).length).toBe(2);
  });
});
