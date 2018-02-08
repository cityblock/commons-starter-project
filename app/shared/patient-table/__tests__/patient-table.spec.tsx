import { shallow } from 'enzyme';
import * as React from 'react';
import Spinner from '../../library/spinner/spinner';
import { PatientTableNoResults, PatientTablePlaceholder } from '../helper-components';
import PatientTable from '../patient-table';
import PatientTableHeader from '../patient-table-header';
import PatientTableRow from '../patient-table-row';

describe('Patient Table', () => {
  const query = 'stark';
  const result1 = { firstName: 'Arya', lastName: 'Stark' };
  const result2 = { firstName: 'Sansa', lastName: 'Stark' };

  const wrapper = shallow(
    <PatientTable
      query={query}
      isQueried={!!query}
      isLoading={false}
      patients={[result1, result2] as any}
      messageIdPrefix="patientTable"
      onRetryClick={() => {
        return;
      }}
    />,
  );

  it('does not render loading spinner if not loading', () => {
    expect(wrapper.find(Spinner).length).toBe(0);
  });

  it('renders table header', () => {
    expect(wrapper.find(PatientTableHeader).length).toBe(1);
  });

  it('renders patient table row component for each patient', () => {
    expect(wrapper.find(PatientTableRow).length).toBe(2);
    expect(
      wrapper
        .find(PatientTableRow)
        .at(0)
        .props().patient,
    ).toEqual(result1);
    expect(
      wrapper
        .find(PatientTableRow)
        .at(0)
        .props().query,
    ).toBe(query);
    expect(
      wrapper
        .find(PatientTableRow)
        .at(1)
        .props().patient,
    ).toEqual(result2);
    expect(
      wrapper
        .find(PatientTableRow)
        .at(1)
        .props().query,
    ).toBe(query);
  });

  it('renders placeholder instructions if in empty state', () => {
    wrapper.setProps({ isQueried: false, patients: [] });
    expect(wrapper.find(PatientTablePlaceholder).length).toBe(1);
    expect(wrapper.find(PatientTableNoResults).length).toBe(0);
  });

  it('renders no results messaging if no results', () => {
    wrapper.setProps({ patients: [], isQueried: true });
    expect(wrapper.find(PatientTablePlaceholder).length).toBe(0);
    expect(wrapper.find(PatientTableNoResults).length).toBe(1);
  });

  it('renders spinner if loading', () => {
    wrapper.setProps({ isLoading: true });
    expect(wrapper.find(Spinner).length).toBe(1);
  });
});
