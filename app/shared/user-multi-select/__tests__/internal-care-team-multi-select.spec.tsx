import { mount } from 'enzyme';
import * as React from 'react';
import * as uuid from 'uuid/v4';
import ApolloTestProvider from '../../util/apollo-test-provider';
import { patient, userForCareTeam } from '../../util/test-data';
import { getUserInfo } from '../get-info-helpers';
import InternalCareTeamMultiSelectContainer from '../internal-care-team-multi-select';
import UserMultiSelect from '../user-multi-select';

describe('Internal Care Team Multi Select', () => {
  const placeholderFn = () => true as any;
  const patientId = patient.id;
  const name = 'careMember';
  const placeholderMessageId = 'appointmentModal.guestPlaceholder';
  const selectedUsers = [] as any;
  const careTeamQuery = () => ({ ...userForCareTeam, id: uuid() });
  const graphqlMocks = () => ({
    CareTeamUser: careTeamQuery,
  });

  const container = mount(
    <ApolloTestProvider graphqlMocks={graphqlMocks()}>
      <InternalCareTeamMultiSelectContainer
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
    expect(wrapper.find(UserMultiSelect).length).toBe(1);

    const member = getUserInfo(userForCareTeam);
    delete member.id;

    const selectProps = wrapper.find(UserMultiSelect).props();
    expect(selectProps.onChange).toBe(placeholderFn);
    expect(selectProps.selectedUsers).toBe(selectedUsers);
    expect(selectProps.placeholderMessageId).toBe(placeholderMessageId);
    expect(selectProps.name).toBe(name);
    expect(selectProps.users).toContainEqual(expect.objectContaining(member));
  });
});
