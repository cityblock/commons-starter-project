import { shallow } from 'enzyme';
import React from 'react';
import PatientSearchHeader from '../header';
import { PatientSearchDescription, PatientSearchTitle } from '../helper-components';

describe('Patient Search Header', () => {
  const query = 'lady';
  const totalResults = 11;

  const wrapper = shallow(<PatientSearchHeader query={query} totalResults={totalResults} />);

  it('renders patient search title', () => {
    expect(wrapper.find(PatientSearchTitle).length).toBe(1);
    expect(wrapper.find(PatientSearchTitle).props().query).toBe(query);
  });

  it('renders patient search description', () => {
    expect(wrapper.find(PatientSearchDescription).length).toBe(1);
    expect(wrapper.find(PatientSearchDescription).props().totalResults).toBe(totalResults);
  });
});
