import { shallow } from 'enzyme';
import * as React from 'react';
import { PatientTableColumnHeader } from '../helper-components';
import PatientTableHeader from '../patient-table-header';

describe('Patient Table Header', () => {
  const wrapper = shallow(<PatientTableHeader />);

  it('renders container', () => {
    expect(wrapper.find('.headerContainer').length).toBe(1);
  });

  it('renders headers for all columns', () => {
    expect(wrapper.find(PatientTableColumnHeader).length).toBe(5);
  });

  it('renders header for patient name', () => {
    expect(
      wrapper
        .find(PatientTableColumnHeader)
        .at(0)
        .props().messageId,
    ).toBe('patientTable.name');
    expect(
      wrapper
        .find(PatientTableColumnHeader)
        .at(0)
        .props().className,
    ).toBe('name');
  });

  it('renders header for patient status', () => {
    expect(
      wrapper
        .find(PatientTableColumnHeader)
        .at(1)
        .props().messageId,
    ).toBe('patientTable.status');
    expect(
      wrapper
        .find(PatientTableColumnHeader)
        .at(1)
        .props().className,
    ).toBe('status');
  });

  it('renders header for patient member ID', () => {
    expect(
      wrapper
        .find(PatientTableColumnHeader)
        .at(2)
        .props().messageId,
    ).toBe('patientTable.memberId');
    expect(
      wrapper
        .find(PatientTableColumnHeader)
        .at(2)
        .props().className,
    ).toBe('memberId');
  });

  it('renders header for patient date of birth', () => {
    expect(
      wrapper
        .find(PatientTableColumnHeader)
        .at(3)
        .props().messageId,
    ).toBe('patientTable.dateOfBirth');
    expect(
      wrapper
        .find(PatientTableColumnHeader)
        .at(3)
        .props().className,
    ).toBe('dateOfBirth');
  });

  it('renders header for patient address', () => {
    expect(
      wrapper
        .find(PatientTableColumnHeader)
        .at(4)
        .props().messageId,
    ).toBe('patientTable.address');
    expect(
      wrapper
        .find(PatientTableColumnHeader)
        .at(4)
        .props().className,
    ).toBe('address');
  });
});
