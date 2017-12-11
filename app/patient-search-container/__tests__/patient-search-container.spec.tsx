import { shallow } from 'enzyme';
import * as React from 'react';
import PatientSearchHeader from '../header';
import PatientSearchInput from '../input';
import { PatientSearchContainer } from '../patient-search-container';

describe('Patient Search Container', () => {
  const query = 'sansa';
  const pageNumber = 0;
  const pageSize = 10;
  const placeholderFn = () => true as any;

  const wrapper = shallow(
    <PatientSearchContainer
      query={query}
      pageNumber={pageNumber}
      pageSize={pageSize}
      updateSearchParams={placeholderFn}
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
});
