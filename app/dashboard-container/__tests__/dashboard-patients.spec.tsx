import { shallow } from 'enzyme';
import * as React from 'react';
import EmptyPlaceholder from '../../shared/library/empty-placeholder/empty-placeholder';
import Pagination from '../../shared/library/pagination/pagination';
import Spinner from '../../shared/library/spinner/spinner';
import { patient } from '../../shared/util/test-data';
import { DashboardPatients } from '../dashboard-patients';
import PatientList from '../patient-list/patient-list';
import PatientWithTasksList from '../patient-list/patient-with-tasks-list';

describe('Dashboard Patients List', () => {
  const pageNumber = 1;
  const pageSize = 10;
  const totalCount = 22;
  const placeholderFn = () => true as any;
  const selected = 'tasks';
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
    <DashboardPatients
      pageNumber={pageNumber}
      pageSize={pageSize}
      updatePageParams={placeholderFn}
      patientResults={patientResults}
      selected={selected}
      loading={false}
    />,
  );

  it('renders patient with tasks list', () => {
    expect(wrapper.find(PatientWithTasksList).length).toBe(1);
    expect(wrapper.find(PatientWithTasksList).props().patients).toEqual([patient]);
    expect(wrapper.find(PatientWithTasksList).props().pageNumber).toBe(pageNumber);
    expect(wrapper.find(PatientWithTasksList).props().pageSize).toBe(pageSize);
  });

  it('renders pagination', () => {
    expect(wrapper.find(Pagination).length).toBe(1);
    expect(wrapper.find(Pagination).props().pageInfo).toEqual(pageInfo);
    expect(wrapper.find(Pagination).props().totalCount).toBe(totalCount);
    expect(wrapper.find(Pagination).props().pageNumber).toBe(pageNumber);
    expect(wrapper.find(Pagination).props().pageSize).toBe(pageSize);
    expect(wrapper.find(Pagination).props().className).toBe('pages');
  });

  it('renders patient without tasks list if not viewing urgent tasks', () => {
    wrapper.setProps({ selected: 'new' });

    expect(wrapper.find(PatientWithTasksList).length).toBe(0);
    expect(wrapper.find(PatientList).length).toBe(1);
    expect(wrapper.find(PatientList).props().patients).toEqual([patient]);
  });

  it('renders empty placeholder if no results', () => {
    wrapper.setProps({ patientResults: { totalCount: 0 }, selected });

    expect(wrapper.find(EmptyPlaceholder).length).toBe(1);
    expect(wrapper.find(EmptyPlaceholder).props().headerMessageId).toBe(
      `dashboard.empty${selected}`,
    );
  });

  it('removes pagination if no results', () => {
    expect(wrapper.find(Pagination).length).toBe(0);
  });

  it('renders loading spinner if loading', () => {
    wrapper.setProps({ loading: true });

    expect(wrapper.find(Spinner).length).toBe(1);
  });
});
