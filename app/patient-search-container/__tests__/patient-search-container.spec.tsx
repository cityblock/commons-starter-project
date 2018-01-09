import { shallow } from 'enzyme';
import * as React from 'react';
import Pagination from '../../shared/library/pagination/pagination';
import PatientSearchHeader from '../header';
import PatientSearchInput from '../input';
import { PatientSearchContainer } from '../patient-search-container';
import PatientSearchResults from '../results';

describe('Patient Search Container', () => {
  const query = 'stark';
  const pageNumber = 0;
  const pageSize = 10;
  const totalCount = 33;
  const placeholderFn = () => true as any;
  const result1 = { firstName: 'Arya', lastName: 'Stark' };
  const result2 = { firstName: 'Sansa', lastName: 'Stark' };
  const searchResults = {
    edges: [
      {
        node: result1,
      },
      {
        node: result2,
      },
    ],
    pageInfo: {
      hasNextPage: true,
      hasPreviousPage: true,
    },
    totalCount,
  };

  const wrapper = shallow(
    <PatientSearchContainer
      query={query}
      pageNumber={pageNumber}
      pageSize={pageSize}
      updateSearchParams={placeholderFn}
      loading={false}
      searchResults={searchResults as any}
    />,
  );

  it('renders a container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders patient search header', () => {
    expect(wrapper.find(PatientSearchHeader).length).toBe(1);
    expect(wrapper.find(PatientSearchHeader).props().query).toBe(query);
  });

  it('renders patient search input field', () => {
    expect(wrapper.find(PatientSearchInput).length).toBe(1);
    expect(wrapper.find(PatientSearchInput).props().searchTerm).toBeFalsy();
  });

  it('changes search term', () => {
    const searchTerm = 'arya';
    wrapper.setState({ searchTerm });
    expect(wrapper.find(PatientSearchInput).props().searchTerm).toBe(searchTerm);
  });

  it('renders patient search results', () => {
    expect(wrapper.find(PatientSearchResults).length).toBe(1);
    expect(wrapper.find(PatientSearchResults).props().query).toBe(query);
    expect(wrapper.find(PatientSearchResults).props().searchResults).toEqual([result1, result2]);
    expect(wrapper.find(PatientSearchResults).props().loading).toBeFalsy();
  });

  it('renders patient search pagination', () => {
    expect(wrapper.find(Pagination).length).toBe(1);
    expect(wrapper.find(Pagination).props().pageInfo).toEqual(searchResults.pageInfo);
    expect(wrapper.find(Pagination).props().totalCount).toBe(totalCount);
    expect(wrapper.find(Pagination).props().pageNumber).toBe(pageNumber);
  });
});
