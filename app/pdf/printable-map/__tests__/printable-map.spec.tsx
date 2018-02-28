import { Document, Page, View } from '@react-pdf/core';
import { shallow } from 'enzyme';
import * as React from 'react';
import {
  patient,
  patientConcern,
  patientConcernActive,
  user,
} from '../../../shared/util/test-data';
import Header from '../header';
import Info from '../info';
import PrintableMap from '../printable-map';

describe('Printable MAP Component', () => {
  const wrapper = shallow(
    <PrintableMap
      patient={patient}
      carePlan={[patientConcern, patientConcernActive]}
      careTeam={[user]}
    />,
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

  it('renders information about MAP', () => {
    expect(wrapper.find(Info).props().patient).toEqual(patient);
    expect(wrapper.find(Info).props().careTeam).toEqual([user]);
    expect(wrapper.find(Info).props().carePlan).toEqual([patientConcernActive]);
  });
});
