import { shallow } from 'enzyme';
import * as React from 'react';
import { PatientSearchResultsColumnHeader } from '../helpers';
import PatientSearchResultsHeader from '../results-header';

describe('Patient Search Results Header', () => {
  const wrapper = shallow(<PatientSearchResultsHeader />);

  it('renders container', () => {
    expect(wrapper.find('.headerContainer').length).toBe(1);
  });

  it('renders headers for all columns', () => {
    expect(wrapper.find(PatientSearchResultsColumnHeader).length).toBe(5);
  });

  it('renders header for patient name', () => {
    expect(
      wrapper
        .find(PatientSearchResultsColumnHeader)
        .at(0)
        .props().messageId,
    ).toBe('patientSearch.name');
    expect(
      wrapper
        .find(PatientSearchResultsColumnHeader)
        .at(0)
        .props().className,
    ).toBe('name');
  });

  it('renders header for patient status', () => {
    expect(
      wrapper
        .find(PatientSearchResultsColumnHeader)
        .at(1)
        .props().messageId,
    ).toBe('patientSearch.status');
    expect(
      wrapper
        .find(PatientSearchResultsColumnHeader)
        .at(1)
        .props().className,
    ).toBe('status');
  });

  it('renders header for patient member ID', () => {
    expect(
      wrapper
        .find(PatientSearchResultsColumnHeader)
        .at(2)
        .props().messageId,
    ).toBe('patientSearch.memberId');
    expect(
      wrapper
        .find(PatientSearchResultsColumnHeader)
        .at(2)
        .props().className,
    ).toBe('memberId');
  });

  it('renders header for patient date of birth', () => {
    expect(
      wrapper
        .find(PatientSearchResultsColumnHeader)
        .at(3)
        .props().messageId,
    ).toBe('patientSearch.dateOfBirth');
    expect(
      wrapper
        .find(PatientSearchResultsColumnHeader)
        .at(3)
        .props().className,
    ).toBe('dateOfBirth');
  });

  it('renders header for patient address', () => {
    expect(
      wrapper
        .find(PatientSearchResultsColumnHeader)
        .at(4)
        .props().messageId,
    ).toBe('patientSearch.address');
    expect(
      wrapper
        .find(PatientSearchResultsColumnHeader)
        .at(4)
        .props().className,
    ).toBe('address');
  });
});
