import { shallow } from 'enzyme';
import * as React from 'react';
import Spinner from '../../shared/library/spinner/spinner';
import { patient } from '../../shared/util/test-data';
import DashboardPagination from '../dashboard-pagination';
import { DashboardPatientsContainer } from '../dashboard-patients-container';

describe('Dashboard Urgent Tasks Page Container', () => {
  const selected = 'tasks';
  const pageNumber = 1;
  const pageSize = 10;
  const totalCount = 22;

  const pageInfo = {
    hasNextPage: true,
    hasPreviousPage: true,
  };
  const patientResults = {
    edges: [
      {
        node: patient,
      },
    ],
    totalCount,
    pageInfo,
  };

  const wrapper = shallow(
    <DashboardPatientsContainer
      pageNumber={pageNumber}
      pageSize={pageSize}
      loading={false}
      patientResults={patientResults}
      selected={selected}
    />,
  );

  it('renders dashboard data with pagination', () => {
    expect(wrapper.find(DashboardPagination).length).toBe(1);
    expect(wrapper.find(DashboardPagination).props().patientResults).toEqual(patientResults);
    expect(wrapper.find(DashboardPagination).props().pageNumber).toBe(pageNumber);
    expect(wrapper.find(DashboardPagination).props().pageSize).toBe(pageSize);
    expect(wrapper.find(DashboardPagination).props().selected).toBe(selected);
  });

  it('renders loading spinner if loading', () => {
    wrapper.setProps({ loading: true });

    expect(wrapper.find(Spinner).length).toBe(1);
    expect(wrapper.find('.container').length).toBe(0);
  });
});
