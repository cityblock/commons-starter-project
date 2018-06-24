import { ApolloError } from 'apollo-client';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import familyGraphql from '../../graphql/queries/get-patient-contacts.graphql';
import externalProvidersGraphql from '../../graphql/queries/get-patient-external-providers.graphql';
import { FullPatientContact, FullPatientExternalProvider } from '../../graphql/types';
import { getFamilyMemberInfo, getProviderInfo } from './get-info-helpers';
import UserMultiSelect, { IUser } from './user-multi-select';

export interface IProps {
  patientId: string;
  onChange: (users: IUser[], name?: string) => void;
  selectedUsers: IUser[];
  placeholderMessageId: string;
  name?: string;
}

interface IGraphqlProps {
  isExternalProvidersLoading?: boolean;
  externalProvidersError?: ApolloError | null | undefined;
  externalProviders?: FullPatientExternalProvider[];
  isFamilyLoading?: boolean;
  familyError?: ApolloError | null | undefined;
  family?: FullPatientContact[];
}

export type allProps = IProps & IGraphqlProps;

export const ExternalCareTeamMultiSelect = (props: allProps) => {
  const {
    isExternalProvidersLoading,
    isFamilyLoading,
    externalProvidersError,
    familyError,
    family,
    externalProviders,
    placeholderMessageId,
    onChange,
    selectedUsers,
    name,
  } = props;

  const formattedProviders: IUser[] = (externalProviders || []).map(getProviderInfo);
  const formattedFamily: IUser[] = (family || []).map(getFamilyMemberInfo);

  const error = externalProvidersError || familyError;

  return (
    <UserMultiSelect
      onChange={onChange}
      selectedUsers={selectedUsers}
      users={formattedProviders.concat(formattedFamily)}
      placeholderMessageId={placeholderMessageId}
      name={name}
      isLoading={isExternalProvidersLoading || isFamilyLoading}
      error={error ? error.message : undefined}
    />
  );
};

export default compose(
  graphql(externalProvidersGraphql, {
    options: (ownProps: IProps) => ({
      variables: {
        patientId: ownProps.patientId,
      },
      fetchPolicy: 'network-only',
    }),
    props: ({ data }) => ({
      isExternalProvidersLoading: data ? data.loading : false,
      externalProvidersError: data ? data.error : null,
      externalProviders: data ? (data as any).patientExternalProviders : null,
    }),
  }),
  graphql(familyGraphql, {
    options: (ownProps: IProps) => ({
      variables: {
        patientId: ownProps.patientId,
      },
      fetchPolicy: 'network-only',
    }),
    props: ({ data }) => ({
      isFamilyLoading: data ? data.loading : false,
      familyError: data ? data.error : null,
      family: data ? (data as any).patientContacts : null,
    }),
  }),
)(ExternalCareTeamMultiSelect) as React.ComponentClass<IProps>;
