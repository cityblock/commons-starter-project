import { mount } from 'enzyme';
import * as React from 'react';
import * as uuid from 'uuid/v4';
import ApolloTestProvider from '../../../../shared/util/apollo-test-provider';
import { patientMedication } from '../../../../shared/util/test-data';
import InfoGroupContainer from '../container';
import InfoGroupHeader from '../header';
import InfoGroupItem from '../item';
import Medications from '../medications';

describe('Patient Left Nav Medications Accordion', () => {
  const patientMedicationQuery = () => ({ ...patientMedication, id: uuid() });
  const graphqlMocks = () => ({
    PatientMedication: patientMedicationQuery,
  });
  const container = mount(
    <ApolloTestProvider graphqlMocks={graphqlMocks()}>
      <Medications isOpen={false} onClick={jest.fn()} patientId="patientId" />
    </ApolloTestProvider>,
  );

  it('renders info group header', () => {
    const wrapper = container.update();
    expect(wrapper.find(InfoGroupHeader).props().selected).toBe('medications');
    expect(wrapper.find(InfoGroupHeader).props().isOpen).toBeFalsy();
    expect(wrapper.find(InfoGroupHeader).props().itemCount).toBe(2);
  });

  it('renders info group container', () => {
    const wrapper = container.update();
    expect(wrapper.find(InfoGroupContainer).props().isOpen).toBeFalsy();
  });

  it('renders info group items for each medication', () => {
    const wrapper = container.update();
    expect(wrapper.find(InfoGroupItem).length).toBe(2);
  });

  it('opens info group header', () => {
    const openContainer = mount(
      <ApolloTestProvider graphqlMocks={graphqlMocks()}>
        <Medications isOpen={true} onClick={jest.fn()} patientId="patientId" />
      </ApolloTestProvider>,
    );
    const wrapper = openContainer.update();

    expect(wrapper.find(InfoGroupHeader).props().isOpen).toBeTruthy();
  });
});
