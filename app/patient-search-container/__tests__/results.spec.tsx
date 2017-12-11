import { shallow } from 'enzyme';
import * as React from 'react';
import Spinner from '../../shared/library/spinner/spinner';
import { PatientSearchNoResults, PatientSearchResultsPlaceholder } from '../helpers';
import PatientSearchResult from '../result';
import PatientSearchResults from '../results';
import PatientSearchResultsHeader from '../results-header';

describe('Patient Search Results', () => {
  const query = 'stark';
  const result1 = { firstName: 'Arya', lastName: 'Stark' };
  const result2 = { firstName: 'Sansa', lastName: 'Stark' };

  const wrapper = shallow(
    <PatientSearchResults
      query={query}
      loading={false}
      searchResults={[result1, result2] as any}
    />,
  );

  it('does not render loading spinner if not loading', () => {
    expect(wrapper.find(Spinner).length).toBe(0);
  });

  it('renders results header', () => {
    expect(wrapper.find(PatientSearchResultsHeader).length).toBe(1);
  });

  it('renders patient search result component for each result', () => {
    expect(wrapper.find(PatientSearchResult).length).toBe(2);
    expect(
      wrapper
        .find(PatientSearchResult)
        .at(0)
        .props().searchResult,
    ).toEqual(result1);
    expect(
      wrapper
        .find(PatientSearchResult)
        .at(0)
        .props().query,
    ).toBe(query);
    expect(
      wrapper
        .find(PatientSearchResult)
        .at(1)
        .props().searchResult,
    ).toEqual(result2);
    expect(
      wrapper
        .find(PatientSearchResult)
        .at(1)
        .props().query,
    ).toBe(query);
  });

  it('renders placeholder instructions to search if no results', () => {
    wrapper.setProps({ query: '' });
    expect(wrapper.find(PatientSearchResultsPlaceholder).length).toBe(1);
    expect(wrapper.find(PatientSearchNoResults).length).toBe(0);
  });

  it('renders no results messaging if no search results', () => {
    wrapper.setProps({ searchResults: [], query });
    expect(wrapper.find(PatientSearchResultsPlaceholder).length).toBe(0);
    expect(wrapper.find(PatientSearchNoResults).length).toBe(1);
  });

  it('renders spinner if loading', () => {
    wrapper.setProps({ loading: true });
    expect(wrapper.find(Spinner).length).toBe(1);
  });
});
