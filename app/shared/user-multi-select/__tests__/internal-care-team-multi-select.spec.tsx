import { mount } from 'enzyme';
import React from 'react';
import uuid from 'uuid/v4';
import ApolloTestProvider from '../../util/apollo-test-provider';
import { patient, userForCareTeam } from '../../util/test-data';
import { getUserInfo } from '../get-info-helpers';
import InternalCareTeamMultiSelectContainer from '../internal-care-team-multi-select';
import UserMultiSelect from '../user-multi-select';

describe('Internal Care Team Multi Select', () => {
  const placeholderFn = jest.fn();
  const patientId = patient.id;
  const name = 'careMember';
  const placeholderMessageId = 'appointmentModal.guestPlaceholder';
  const selectedUsers = [] as any;
  const careTeam = () => ({ ...userForCareTeam, id: uuid() });
  const graphqlMocks = () => ({
    CareTeamUser: careTeam,
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
