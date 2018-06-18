import { shallow } from 'enzyme';
import React from 'react';
import PatientTable from '../../shared/patient-table/patient-table';
import PatientTablePagination from '../../shared/patient-table/patient-table-pagination';
import PatientSearchHeader from '../header';
import PatientSearchInput from '../input';
import { PatientSearchContainer } from '../patient-search-container';

describe('Patient Search Container', () => {
  const query = 'stark';
  const pageNumber = 0;
  const pageSize = 10;
  const totalCount = 33;
  const history = { push: jest.fn() } as any;
  const location = {} as any;
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
      history={history}
      location={location}
      query={query}
      pageNumber={pageNumber}
      pageSize={pageSize}
      loading={false}
      searchResults={searchResults as any}
      error={null}
      refetch={() => {
        return;
      }}
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
    expect(wrapper.find(PatientTable).length).toBe(1);
    expect(wrapper.find(PatientTable).props().query).toBe(query);
    expect(wrapper.find(PatientTable).props().isQueried).toBe(!!query);
    expect(wrapper.find(PatientTable).props().patients).toEqual([result1, result2]);
    expect(wrapper.find(PatientTable).props().loading).toBeFalsy();
    expect(wrapper.find(PatientTable).props().messageIdPrefix).toBe('patientSearch');
  });

  it('renders patient search pagination', () => {
    expect(wrapper.find(PatientTablePagination).length).toBe(1);
  });
});
