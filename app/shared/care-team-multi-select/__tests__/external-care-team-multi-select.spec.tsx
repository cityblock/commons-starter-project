import { mount } from 'enzyme';
import * as React from 'react';
import * as uuid from 'uuid/v4';
import ApolloTestProvider from '../../util/apollo-test-provider';
import { externalProviderPerson, healthcareProxy, patient } from '../../util/test-data';
import CareTeamMultiSelect from '../care-team-multi-select';
import ExternalCareTeamMultiSelectContainer, {
  getFamilyMemberInfo,
  getProviderInfo,
} from '../external-care-team-multi-select';

describe('External Care Team Multi Select', () => {
  const placeholderFn = () => true as any;
  const patientId = patient.id;
  const name = 'familyMember';
  const placeholderMessageId = 'patientAppointmentModal.externalGuestPlaceholder';
  const selectedUsers = [] as any;
  const familyQuery = () => ({ ...healthcareProxy, id: uuid() });
  const externalProvidersQuery = () => ({ ...externalProviderPerson, id: uuid() });
  const graphqlMocks = () => ({
    PatientContact: familyQuery,
    PatientExternalProvider: externalProvidersQuery,
  });

  const container = mount(
    <ApolloTestProvider graphqlMocks={graphqlMocks()}>
      <ExternalCareTeamMultiSelectContainer
        patientId={patientId}
        onChange={placeholderFn}
        selectedUsers={selectedUsers}
        placeholderMessageId={placeholderMessageId}
        name={name}
      />
    </ApolloTestProvider>,
  );

  it('renders care team multi select component', () => {
    const wrapper = container.update();
    expect(wrapper.find(CareTeamMultiSelect).length).toBe(1);

    const familyMember = getFamilyMemberInfo(healthcareProxy);
    delete familyMember.id;
    const externalMember = getProviderInfo(externalProviderPerson);
    delete externalMember.id;

    const selectProps = wrapper.find(CareTeamMultiSelect).props();
    expect(selectProps.patientId).toBe(patientId);
    expect(selectProps.onChange).toBe(placeholderFn);
    expect(selectProps.selectedUsers).toBe(selectedUsers);
    expect(selectProps.placeholderMessageId).toBe(placeholderMessageId);
    expect(selectProps.name).toBe(name);
    expect(selectProps.users).toContainEqual(expect.objectContaining(familyMember));
    expect(selectProps.users).toContainEqual(expect.objectContaining(externalMember));
  });
});
