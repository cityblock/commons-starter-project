import { ApolloError } from 'apollo-client';
import React from 'react';
import { graphql } from 'react-apollo';
import careTeamGraphql from '../../graphql/queries/get-patient-care-team.graphql';
import { FullUser } from '../../graphql/types';
import { getUserInfo } from './get-info-helpers';
import UserMultiSelect, { IUser } from './user-multi-select';

export interface IProps {
  patientId: string;
  onChange: (users: IUser[], name?: string) => void;
  selectedUsers: IUser[];
  placeholderMessageId: string;
  name?: string;
}

interface IGraphqlProps {
  loading: boolean;
  error: ApolloError | null | undefined;
  careTeam: FullUser[];
}

export type allProps = IProps & IGraphqlProps;

export const InternalCareTeamMultiSelect: React.StatelessComponent<allProps> = props => {
  const { loading, error, careTeam, placeholderMessageId, onChange, selectedUsers, name } = props;
  const formattedCareTeam = careTeam ? careTeam.map(member => getUserInfo(member, false)) : [];

  return (
    <UserMultiSelect
      onChange={onChange}
      selectedUsers={selectedUsers}
      users={formattedCareTeam}
      placeholderMessageId={placeholderMessageId}
      name={name}
      isLoading={loading}
      error={error ? error.message : undefined}
    />
  );
};

export default graphql(careTeamGraphql, {
  options: (ownProps: IProps) => ({
    variables: {
      patientId: ownProps.patientId,
    },
  }),
  props: ({ data }) => ({
    loading: data ? data.loading : false,
    error: data ? data.error : null,
    careTeam: data ? (data as any).patientCareTeam : null,
  }),
})(InternalCareTeamMultiSelect);
