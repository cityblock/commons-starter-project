import { shallow } from 'enzyme';
import querystring from 'querystring';
import React from 'react';
import Pagination from '../../library/pagination/pagination';
import { PatientTablePagination } from '../patient-table-pagination';

describe('Patient Table Pagination', () => {
  const pageNumber = 0;
  const pageSize = 10;
  const totalCount = 33;
  const history = { push: jest.fn() } as any;
  const location = {} as any;
  const match = {} as any;
  const pageInfo = {
    hasNextPage: true,
    hasPreviousPage: true,
  };
  const createQueryString = (pageNum: number, size: number) => {
    return querystring.stringify({
      pageNumber: pageNum,
      pageSize: size,
    });
  };

  const wrapper = shallow(
    <PatientTablePagination
      history={history}
      location={location}
      match={match}
      getQuery={createQueryString}
      pageNumber={pageNumber}
      pageSize={pageSize}
      staticContext={{} as any}
      pageInfo={pageInfo}
      totalCount={totalCount}
    />,
  );

  it('renders patient pagination', () => {
    expect(wrapper.find(Pagination).length).toBe(1);
    expect(wrapper.find(Pagination).props().pageInfo).toEqual(pageInfo);
    expect(wrapper.find(Pagination).props().totalCount).toBe(totalCount);
    expect(wrapper.find(Pagination).props().pageNumber).toBe(pageNumber);
  });
});
