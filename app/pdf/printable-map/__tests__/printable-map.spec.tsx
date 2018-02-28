import { Document, Page, View } from '@react-pdf/core';
import { shallow } from 'enzyme';
import * as React from 'react';
import { patient, patientConcern, user } from '../../../shared/util/test-data';
import Header from '../header';
import PrintableMap from '../printable-map';

describe('Printable MAP Component', () => {
  const wrapper = shallow(
    <PrintableMap patient={patient} carePlan={[patientConcern]} careTeam={[user]} />,
  );

  it('renders document', () => {
    expect(wrapper.find(Document).length).toBe(1);
  });

  it('renders page', () => {
    expect(wrapper.find(Page).length).toBe(1);
  });

  it('renders top border and container', () => {
    expect(wrapper.find(View).length).toBe(2);
  });

  it('renders header', () => {
    expect(wrapper.find(Header).length).toBe(1);
  });
});
