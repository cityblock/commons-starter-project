import { shallow } from 'enzyme';
import * as React from 'react';
import Pagination from '../../shared/library/pagination/pagination';
import Spinner from '../../shared/library/spinner/spinner';
import { patient } from '../../shared/util/test-data';
import { DashboardTasksContainer } from '../dashboard-tasks-container';
import PatientWithTasksList from '../patient-list/patient-with-tasks-list';

describe('Dashboard Urgent Tasks Page Container', () => {
  const pageNumber = 1;
  const pageSize = 10;
  const totalCount = 22;
  const placeholderFn = () => true as any;
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
    <DashboardTasksContainer
      pageNumber={pageNumber}
      pageSize={pageSize}
      updatePageParams={placeholderFn}
      loading={false}
      patientResults={patientResults}
    />,
  );

  it('renders container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders patient with tasks list', () => {
    expect(wrapper.find(PatientWithTasksList).length).toBe(1);
    expect(wrapper.find(PatientWithTasksList).props().patients).toEqual([patient]);
  });

  it('renders pagination', () => {
    expect(wrapper.find(Pagination).length).toBe(1);
    expect(wrapper.find(Pagination).props().pageInfo).toEqual(pageInfo);
    expect(wrapper.find(Pagination).props().totalCount).toBe(totalCount);
    expect(wrapper.find(Pagination).props().pageNumber).toBe(pageNumber);
    expect(wrapper.find(Pagination).props().pageSize).toBe(pageSize);
    expect(wrapper.find(Pagination).props().className).toBe('pages');
  });

  it('removes pagination if no results', () => {
    wrapper.setProps({ patientResults: { totalCount: 0 } });

    expect(wrapper.find(Pagination).length).toBe(0);
  });

  it('renders loading spinner if loading', () => {
    wrapper.setProps({ loading: true });

    expect(wrapper.find(Spinner).length).toBe(1);
    expect(wrapper.find('.container').length).toBe(0);
  });
});
