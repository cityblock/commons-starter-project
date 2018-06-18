import { mount } from 'enzyme';
import React from 'react';
import uuid from 'uuid/v4';
import ApolloTestProvider from '../../../../shared/util/apollo-test-provider';
import { patientDiagnosis } from '../../../../shared/util/test-data';
import InfoGroupContainer from '../container';
import InfoGroupHeader from '../header';
import InfoGroupItem from '../item';
import ProblemList from '../problem-list';

describe('Patient Left Nav Problem List Accordion', () => {
  const patientDiagnosisQuery = () => ({ ...patientDiagnosis, id: uuid() });
  const graphqlMocks = () => ({
    PatientDiagnosis: patientDiagnosisQuery,
  });
  const container = mount(
    <ApolloTestProvider graphqlMocks={graphqlMocks()}>
      <ProblemList patientId="patientId" isOpen={false} onClick={jest.fn()} />
    </ApolloTestProvider>,
  );

  it('renders info group header', () => {
    const wrapper = container.update();
    expect(wrapper.find(InfoGroupHeader).props().selected).toBe('problemList');
    expect(wrapper.find(InfoGroupHeader).props().isOpen).toBeFalsy();
    expect(wrapper.find(InfoGroupHeader).props().itemCount).toBe(2);
  });

  it('renders info group container', () => {
    const wrapper = container.update();
    expect(wrapper.find(InfoGroupContainer).props().isOpen).toBeFalsy();
  });

  it('renders info group items for each problem', () => {
    const wrapper = container.update();
    expect(wrapper.find(InfoGroupItem).length).toBe(2);
  });

  it('opens info group header', () => {
    const openContainer = mount(
      <ApolloTestProvider graphqlMocks={graphqlMocks()}>
        <ProblemList patientId="patientId" isOpen={true} onClick={jest.fn()} />
      </ApolloTestProvider>,
    );
    const wrapper = openContainer.update();

    expect(wrapper.find(InfoGroupHeader).props().isOpen).toBeTruthy();
  });
});
